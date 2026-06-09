import React, { useRef, useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import type { Category } from "../data/categories";

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

interface MusicQuizProps {
  category: Category;
  onBack: () => void;
}

const MusicQuiz: React.FC<MusicQuizProps> = ({ category, onBack }) => {
  const playerRef = useRef<AudioPlayer>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [countdown, setCountdown] = useState<number>(20);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [_randomTime, setRandomTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answerSelected, setAnswerSelected] = useState<boolean>(false);
  const [selectedAnswerUid, setSelectedAnswerUid] = useState<number | null>(
    null,
  );
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [isTrackLoading, setIsTrackLoading] = useState<boolean>(true);
  const [trackLoadProgress, setTrackLoadProgress] = useState<number>(0);
  const [showListenButton, setShowListenButton] = useState<boolean>(true);
  const [_isPlaying, setIsPlaying] = useState<boolean>(false);

  // Очистка таймера
  const clearCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  // Функция для остановки музыки
  const stopMusic = () => {
    if (playerRef.current && playerRef.current.audio.current) {
      const audio = playerRef.current.audio.current;
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      console.log("Музыка остановлена");
    }
  };

  // Функция для генерации случайного времени (только в первой половине трека)
  const generateRandomTime = (track: Track): number => {
    if (!track || track.duration <= 0) return 0;
    // Берем только первую половину трека
    const maxStartTime = track.duration / 2;
    const randomSeconds = Math.random() * maxStartTime;
    const roundedTime = Math.round(randomSeconds * 100) / 100;
    console.log(
      `Сгенерировано случайное время: ${roundedTime} сек (макс: ${maxStartTime} сек)`,
    );
    return roundedTime;
  };

  // Загрузка треков из JSON файла выбранной категории
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/json/${category.file}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Track[] = await response.json();

        if (!data || data.length === 0) {
          throw new Error("Файл с треками пуст или имеет неверный формат");
        }

        setTracks(data);
        console.log(
          `Загружено треков для категории "${category.name}":`,
          data.length,
        );

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

    // Очистка при размонтировании
    return () => {
      clearCountdown();
      stopMusic();
    };
  }, [category]);

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

  const startCountdown = () => {
    clearCountdown(); // Очищаем предыдущий таймер если есть

    let timeLeft = 20;
    countdownIntervalRef.current = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearCountdown();
        // Время вышло
        stopMusic();
        setAnswerSelected(true);
        const updatedOptions = answerOptions.map((opt) => ({
          ...opt,
          showResult: true,
        }));
        setAnswerOptions(updatedOptions);
        setTimeout(() => {
          setIsQuizActive(false);
          setQuizCompleted(true);
        }, 2000);
      }
    }, 1000);
  };

  const startListening = async () => {
    if (!currentTrack || !currentTrack.audiofile) return;

    setShowListenButton(false);
    setIsTrackLoading(true);
    setTrackLoadProgress(0);

    try {
      // Предварительно загружаем трек
      console.log("Начинаем загрузку трека...");
      await preloadAudio(currentTrack.audiofile);
      setTrackLoadProgress(100);

      // Небольшая задержка для уверенности
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Генерируем случайную позицию (только в первой половине)
      const randomSeconds = generateRandomTime(currentTrack);
      setRandomTime(randomSeconds);

      // Инициализируем воспроизведение
      let attempts = 0;
      while (!playerRef.current?.audio.current && attempts < 20) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        attempts++;
      }

      if (playerRef.current?.audio.current) {
        // Устанавливаем случайную позицию
        playerRef.current.audio.current.currentTime = randomSeconds;

        // Начинаем воспроизведение
        await playerRef.current.audio.current.play();
        setIsPlaying(true);
        console.log("Воспроизведение успешно началось");

        // Запускаем таймер
        setHasStarted(true);
        setIsTrackLoading(false);
        startCountdown();
      } else {
        throw new Error("Не удалось инициализировать аудио плеер");
      }
    } catch (error) {
      console.error("Ошибка при загрузке трека:", error);
      setError(
        "Не удалось загрузить аудио трек. Пожалуйста, попробуйте снова.",
      );
      setIsTrackLoading(false);
      setShowListenButton(true);
    }
  };

  const startNewGame = () => {
    if (!tracks.length) return;

    // Очищаем таймер
    clearCountdown();

    stopMusic();
    selectRandomTrackAndOptions(tracks);
    setHasStarted(false);
    setIsQuizActive(true);
    setCountdown(20);
    setAnswerSelected(false);
    setSelectedAnswerUid(null);
    setQuizCompleted(false);
    setIsTrackLoading(true);
    setTrackLoadProgress(0);
    setShowListenButton(true);
    setIsPlaying(false);
    setRandomTime(null);
  };

  // Обработка выбора ответа
  const handleAnswerClick = (option: AnswerOption) => {
    if (answerSelected || !isQuizActive || !hasStarted) return;

    // Очищаем таймер
    clearCountdown();

    stopMusic();

    setAnswerSelected(true);
    setSelectedAnswerUid(option.track.uidTrack);

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

  // const formatTime = (seconds: number): string => {
  //   if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  //   const mins = Math.floor(seconds / 60);
  //   const secs = Math.floor(seconds % 60);
  //   return `${mins}:${secs.toString().padStart(2, "0")}`;
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-600">Загрузка квиза "{category.name}"...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentTrack) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
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
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Назад к категориям
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Кнопка назад */}
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-white hover:text-purple-200 transition-colors"
        >
          ← Назад к категориям
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Верхняя секция с информацией о категории */}
          <div
            className={`bg-linear-to-r ${category.color} p-4 md:p-6 text-white`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  {category.name}
                </h2>
                <p className="text-white/90 text-sm">{category.description}</p>
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="p-4 md:p-6">
            {/* Аудио плеер (скрытый) */}
            <div hidden>
              <AudioPlayer
                ref={playerRef}
                autoPlay={false}
                src={currentTrack.audiofile}
                showSkipControls={false}
                showJumpControls={false}
                layout="stacked"
                customAdditionalControls={[]}
              />
            </div>

            {/* Кнопка "Слушать" или индикатор загрузки */}
            {showListenButton ? (
              <div className="text-center py-12">
                <button
                  onClick={startListening}
                  className="px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  🎧 Слушать
                </button>
                <p className="text-gray-500 mt-4 text-sm">
                  Нажмите, чтобы начать квиз. Трек начнется со случайного места
                  в первой половине
                </p>
              </div>
            ) : isTrackLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  <div className="text-gray-600">
                    Загрузка трека... {Math.round(trackLoadProgress)}%
                  </div>
                  <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${trackLoadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Таймер и статус игры */}
                <div className="text-center mb-6">
                  {hasStarted && isQuizActive && !answerSelected && (
                    <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2">
                      <span className="text-2xl font-bold text-purple-600">
                        {countdown}
                      </span>
                      <span className="text-purple-600">секунд осталось</span>
                    </div>
                  )}

                  {answerSelected && (
                    <div
                      className={`text-center p-3 rounded-lg ${selectedAnswerUid === currentTrack.uidTrack ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {selectedAnswerUid === currentTrack.uidTrack ? (
                        <div>🎉 Правильно! Отличная работа! 🎉</div>
                      ) : (
                        <div>
                          😔 Неправильно... Правильный ответ:{" "}
                          {currentTrack.titleTrack} -{" "}
                          {currentTrack.titleExecutor}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Варианты ответов */}
                {!quizCompleted ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      Выберите правильный трек:
                    </h3>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {answerOptions.map((option) => {
                        let borderClass = "border-2 border-transparent";
                        if (option.showResult) {
                          if (option.isCorrect) {
                            borderClass = "border-4 border-green-500 shadow-lg";
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
                              answerSelected || !isQuizActive || !hasStarted
                            }
                            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${borderClass} ${
                              !answerSelected && isQuizActive && hasStarted
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
                  </>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {selectedAnswerUid === currentTrack.uidTrack
                        ? "🎉 Поздравляем! 🎉"
                        : "😔 Попробуйте еще раз! 😔"}
                    </h3>
                    <button
                      onClick={startNewGame}
                      className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                      🎮 Играть снова
                    </button>
                    <button
                      onClick={onBack}
                      className="px-6 py-3 ml-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                    >
                      🏠 Выбрать другую категорию
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicQuiz;
