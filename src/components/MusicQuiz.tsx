import React, { useRef, useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface Track {
  title: string;
  titleTrack: string;
  titleExecutor: string;
  uidTrack: number;
  coverHTTP: string;
  audiofile: string;
  duration: number;
}

interface AnswerOption {
  track: Track;
  isCorrect: boolean;
  showResult: boolean;
}

const MusicQuiz: React.FC = () => {
  const playerRef = useRef<AudioPlayer>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [countdown, setCountdown] = useState<number>(20);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [randomTime, setRandomTime] = useState<number | null>(null);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [answerSelected, setAnswerSelected] = useState<boolean>(false);
  const [selectedAnswerUid, setSelectedAnswerUid] = useState<number | null>(
    null,
  );
  const [_showAnswer, setShowAnswer] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [isTrackLoading, setIsTrackLoading] = useState<boolean>(true);
  const [trackLoadProgress, setTrackLoadProgress] = useState<number>(0);
  const [countdownActive, setCountdownActive] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Функция для остановки музыки
  const stopMusic = () => {
    if (playerRef.current && playerRef.current.audio.current) {
      const audio = playerRef.current.audio.current;
      audio.pause();
      audio.currentTime = 0;
      console.log("Музыка остановлена");
    }
  };

  // Функция для генерации случайного времени
  const generateRandomTime = (track: Track): number => {
    if (!track || track.duration <= 0) return 0;
    const maxStartTime = Math.max(0, track.duration - 22);
    const randomSeconds = Math.random() * maxStartTime;
    return Math.round(randomSeconds * 100) / 100;
  };

  // Загрузка треков из локального JSON файла
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/74.json");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Track[] = await response.json();

        if (!data || data.length === 0) {
          throw new Error("Файл с треками пуст или имеет неверный формат");
        }

        setTracks(data);
        console.log("Треки успешно загружены:", data.length);

        selectRandomTrackAndOptions(data);
      } catch (error) {
        console.error("Ошибка при загрузке треков:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Неизвестная ошибка при загрузке треков",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const selectRandomTrackAndOptions = (tracksList: Track[]) => {
    if (!tracksList.length) return;

    const randomIndex = Math.floor(Math.random() * tracksList.length);
    const correctTrack = tracksList[randomIndex];
    setCurrentTrack(correctTrack);

    const otherTracks = tracksList.filter(
      (track) => track.uidTrack !== correctTrack.uidTrack,
    );
    const shuffledOther = [...otherTracks].sort(() => 0.5 - Math.random());
    const wrongTracks = shuffledOther.slice(0, 3);

    const options = [
      { track: correctTrack, isCorrect: true, showResult: false },
      ...wrongTracks.map((track) => ({
        track,
        isCorrect: false,
        showResult: false,
      })),
    ];

    const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
    setAnswerOptions(shuffledOptions);

    console.log("Выбран трек для угадывания:", correctTrack.title);
  };

  // Предварительная загрузка аудио трека
  const preloadAudio = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();

      audio.addEventListener("canplaythrough", () => {
        console.log("Трек полностью загружен");
        resolve();
      });

      audio.addEventListener("error", (e) => {
        console.error("Ошибка загрузки трека:", e);
        reject(new Error("Не удалось загрузить аудио трек"));
      });

      audio.addEventListener("progress", (e) => {
        if (e.target && (e.target as HTMLAudioElement).buffered.length > 0) {
          const buffered = (e.target as HTMLAudioElement).buffered;
          const loaded = buffered.end(buffered.length - 1);
          const duration = (e.target as HTMLAudioElement).duration;
          if (duration > 0) {
            const percent = (loaded / duration) * 100;
            setTrackLoadProgress(Math.min(99, percent));
          }
        }
      });

      audio.src = url;
      audio.load();
    });
  };

  const startNewGame = () => {
    if (!tracks.length) return;

    stopMusic();
    selectRandomTrackAndOptions(tracks);
    setHasStarted(false);
    setIsQuizActive(true);
    setCountdown(20);
    setUserInteracted(false);
    setAnswerSelected(false);
    setSelectedAnswerUid(null);
    setShowAnswer(false);
    setQuizCompleted(false);
    setIsTrackLoading(true);
    setTrackLoadProgress(0);
    setCountdownActive(false);
    setIsInitialized(false);
    setRandomTime(null); // Сброс случайного времени

    // Не запускаем воспроизведение здесь, оно запустится в initQuiz после загрузки трека
  };

  const attemptPlay = async (retryCount: number = 0) => {
    if (!playerRef.current?.audio.current) {
      if (retryCount < 10) {
        setTimeout(() => attemptPlay(retryCount + 1), 500);
      }
      return false;
    }

    try {
      await playerRef.current.audio.current.play();
      console.log("Воспроизведение успешно началось");
      return true;
    } catch (error) {
      console.warn(`Попытка воспроизведения ${retryCount + 1} failed:`, error);
      return false;
    }
  };

  // Запуск квиза после загрузки трека
  useEffect(() => {
    const initQuiz = async () => {
      // Проверяем, что трек загружен, игра не начата и не инициализирована
      if (
        currentTrack &&
        currentTrack.audiofile &&
        !hasStarted &&
        !quizCompleted &&
        !isInitialized
      ) {
        setIsInitialized(true); // Отмечаем, что инициализация началась
        setIsTrackLoading(true);
        setTrackLoadProgress(0);

        try {
          // Предварительно загружаем трек
          console.log("Начинаем загрузку трека...");
          await preloadAudio(currentTrack.audiofile);
          setTrackLoadProgress(100);

          // Небольшая задержка для уверенности
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Генерируем случайную позицию ТОЛЬКО ОДИН РАЗ
          const randomSeconds = generateRandomTime(currentTrack);
          setRandomTime(randomSeconds);

          // Инициализируем воспроизведение
          const initPlayback = async () => {
            let attempts = 0;
            while (!playerRef.current?.audio.current && attempts < 20) {
              await new Promise((resolve) => setTimeout(resolve, 200));
              attempts++;
            }

            if (playerRef.current?.audio.current) {
              // Устанавливаем случайную позицию
              playerRef.current.audio.current.currentTime = randomSeconds;

              const playSuccess = await attemptPlay();
              if (!playSuccess) {
                setUserInteracted(true);
              } else {
                // Запускаем таймер только после успешного начала воспроизведения
                setCountdownActive(true);
                setHasStarted(true);
                setIsTrackLoading(false);
              }
            } else {
              setIsTrackLoading(false);
              setError("Не удалось инициализировать аудио плеер");
            }
          };

          await initPlayback();
        } catch (error) {
          console.error("Ошибка при загрузке трека:", error);
          setError(
            "Не удалось загрузить аудио трек. Пожалуйста, попробуйте снова.",
          );
          setIsTrackLoading(false);
          setIsInitialized(false);
        }
      }
    };

    initQuiz();
  }, [currentTrack, hasStarted, quizCompleted, isInitialized]);

  // Запуск таймера только после загрузки трека и начала воспроизведения
  useEffect(() => {
    if (!countdownActive || !isQuizActive || answerSelected || !hasStarted)
      return;

    console.log("Таймер запущен!");
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Время вышло
          stopMusic();
          setAnswerSelected(true);
          setShowAnswer(true);
          const updatedOptions = answerOptions.map((opt) => ({
            ...opt,
            showResult: true,
          }));
          setAnswerOptions(updatedOptions);
          setTimeout(() => {
            setIsQuizActive(false);
            setQuizCompleted(true);
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    countdownActive,
    isQuizActive,
    answerSelected,
    hasStarted,
    answerOptions,
  ]);

  const handleUserInteraction = async () => {
    if (!userInteracted || !isQuizActive || answerSelected) return;

    const success = await attemptPlay();
    if (success) {
      setUserInteracted(false);
      // Запускаем таймер после успешного воспроизведения
      setCountdownActive(true);
      setHasStarted(true);
    }
  };

  // Обработка выбора ответа
  const handleAnswerClick = (option: AnswerOption) => {
    if (answerSelected || !isQuizActive || quizCompleted) return;

    stopMusic();
    setCountdownActive(false); // Останавливаем таймер

    setAnswerSelected(true);
    setSelectedAnswerUid(option.track.uidTrack);
    setShowAnswer(true);

    const updatedOptions = answerOptions.map((opt) => ({
      ...opt,
      showResult: true,
    }));
    setAnswerOptions(updatedOptions);

    if (option.isCorrect) {
      console.log("Правильный ответ!");
      setTimeout(() => {
        setIsQuizActive(false);
        setQuizCompleted(true);
      }, 1500);
    } else {
      console.log("Неправильный ответ!");
      setTimeout(() => {
        setIsQuizActive(false);
        setQuizCompleted(true);
      }, 2000);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-gray-600">Загрузка музыкального квиза...</p>
        </div>
      </div>
    );
  }

  if (error || !currentTrack) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-red-600">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl mb-2">⚠️ Ошибка загрузки</p>
          <p className="text-sm">{error || "Не удалось загрузить треки"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      onClick={handleUserInteraction}
    >
      {/* Верхняя секция с плеером и таймером */}
      <div className="bg-linear-to-br from-purple-900 to-pink-900 p-4 md:p-6">
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white text-center mb-2">
            🎵 Угадай трек за 20 секунд!
          </h2>

          {/* Индикатор загрузки трека */}
          {isTrackLoading && !hasStarted && (
            <div className="text-center mb-4">
              <div className="inline-flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <div className="text-white text-sm">
                  Загрузка трека... {Math.round(trackLoadProgress)}%
                </div>
                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${trackLoadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Таймер */}
          {!isTrackLoading && hasStarted && isQuizActive && !answerSelected && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 md:px-4 md:py-2">
                <span className="text-xl md:text-2xl font-bold text-white">
                  {countdown}
                </span>
                <span className="text-sm md:text-base text-white">
                  секунд осталось
                </span>
              </div>
            </div>
          )}

          {(answerSelected || !isQuizActive) && (
            <div className="text-center text-white text-sm md:text-base">
              {selectedAnswerUid === currentTrack.uidTrack ? (
                <div className="bg-green-500 rounded-lg p-2 animate-bounce">
                  🎉 Правильно! Отличная работа! 🎉
                </div>
              ) : (
                <div className="bg-red-500 rounded-lg p-2">
                  😔 Неправильно... Правильный ответ: {currentTrack.titleTrack}{" "}
                  - {currentTrack.titleExecutor}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Аудио плеер */}
        {currentTrack.audiofile && (
          <AudioPlayer
            ref={playerRef}
            autoPlay={false}
            src={currentTrack.audiofile}
            showSkipControls={false}
            showJumpControls={false}
            layout="stacked"
            customAdditionalControls={[]}
            className="custom-audio-player"
          />
        )}

        {randomTime !== null &&
          !answerSelected &&
          isQuizActive &&
          hasStarted &&
          !isTrackLoading && (
            <div className="mt-2 text-center text-xs text-purple-200">
              🎲 Трек начался с {formatTime(randomTime)} (из{" "}
              {formatTime(currentTrack.duration)})
            </div>
          )}

        {userInteracted &&
          !answerSelected &&
          isQuizActive &&
          !isTrackLoading &&
          !hasStarted && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await attemptPlay();
                setUserInteracted(false);
                setCountdownActive(true);
                setHasStarted(true);
              }}
              className="mt-4 w-full px-6 py-2 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-100 transition-all text-sm md:text-base"
            >
              ▶️ Нажмите для воспроизведения
            </button>
          )}
      </div>

      {/* Варианты ответов - фиксированная таблица 2x2 */}
      <div className="p-4 md:p-6">
        {!quizCompleted ? (
          <>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 text-center">
              Выберите правильный трек:
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {answerOptions.map((option) => {
                let borderClass = "border-2 border-transparent";
                if (option.showResult) {
                  if (option.isCorrect) {
                    borderClass =
                      "border-4 border-green-500 shadow-lg transform scale-105";
                  } else if (
                    selectedAnswerUid === option.track.uidTrack &&
                    !option.isCorrect
                  ) {
                    borderClass = "border-4 border-red-500";
                  }
                }

                return (
                  <button
                    key={option.track.uidTrack}
                    onClick={() => handleAnswerClick(option)}
                    disabled={
                      answerSelected ||
                      !isQuizActive ||
                      isTrackLoading ||
                      !hasStarted
                    }
                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${borderClass} ${
                      !answerSelected &&
                      isQuizActive &&
                      !isTrackLoading &&
                      hasStarted
                        ? "hover:scale-105 cursor-pointer"
                        : "cursor-default opacity-60"
                    }`}
                  >
                    <div className="p-3 md:p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 mb-3">
                          <img
                            src={
                              option.track.coverHTTP ||
                              "https://via.placeholder.com/96x96?text=🎵"
                            }
                            alt={option.track.titleTrack}
                            className="w-full h-full rounded-lg object-cover shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/96x96?text=🎵";
                            }}
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <h4 className="font-semibold text-gray-800 text-sm md:text-base wrap-break-word">
                            {option.track.titleTrack}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-600 mt-1 wrap-break-word">
                            {option.track.titleExecutor}
                          </p>
                        </div>
                        {option.showResult && option.isCorrect && (
                          <div className="absolute top-2 right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">
                            ✓
                          </div>
                        )}
                        {option.showResult &&
                          selectedAnswerUid === option.track.uidTrack &&
                          !option.isCorrect && (
                            <div className="absolute top-2 right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">
                              ✗
                            </div>
                          )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Сообщение о загрузке трека */}
            {isTrackLoading && !hasStarted && (
              <div className="text-center mt-4 text-gray-500 text-sm">
                ⏳ Пожалуйста, подождите, трек загружается...
              </div>
            )}

            {/* Сообщение о начале игры */}
            {!isTrackLoading && !hasStarted && !userInteracted && (
              <div className="text-center mt-4 text-blue-500 text-sm">
                🎯 Нажмите на кнопку воспроизведения, чтобы начать игру
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 md:py-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              {selectedAnswerUid === currentTrack.uidTrack
                ? "🎉 Поздравляем! 🎉"
                : "😔 Попробуйте еще раз! 😔"}
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              {selectedAnswerUid === currentTrack.uidTrack
                ? "Вы отлично знаете музыку 90-х!"
                : `Правильный ответ: ${currentTrack.titleTrack} - ${currentTrack.titleExecutor}`}
            </p>
            <button
              onClick={startNewGame}
              className="px-6 md:px-8 py-2 md:py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg text-sm md:text-base"
            >
              🎮 Новая игра
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicQuiz;
