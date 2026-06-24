import React, { useRef, useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import type { Category } from "../data/categories";
import { rounds } from "../data/rounds";

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
  onUpdateGlobalScore: (score: number, categoryId: string) => void;
  difficulty: number;
}

const MusicQuiz: React.FC<MusicQuizProps> = ({
  category,
  onBack,
  onUpdateGlobalScore,
  difficulty,
}) => {
  const playerRef = useRef<AudioPlayer>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const lostSoundRef = useRef<HTMLAudioElement | null>(null);
  const winMidSoundRef = useRef<HTMLAudioElement | null>(null);

  // Используем ref для хранения актуального счета
  const totalScoreRef = useRef<number>(0);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const [showScoreAnimation, setShowScoreAnimation] = useState<boolean>(false);
  const [_isCorrect, setIsCorrect] = useState<boolean>(false);
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
  const [showCoverForRound, setShowCoverForRound] = useState<boolean>(false);
  const [showTitleForRound, setShowTitleForRound] = useState<boolean>(false);
  const [showTrackInfoForGuessCover, setShowTrackInfoForGuessCover] =
    useState<boolean>(false);

  // Синхронизируем ref с state
  useEffect(() => {
    totalScoreRef.current = totalScore;
  }, [totalScore]);

  // Инициализация звуков
  useEffect(() => {
    winSoundRef.current = new Audio("/win.mp3");
    lostSoundRef.current = new Audio("/lost.mp3");
    winMidSoundRef.current = new Audio("/win_mid.m4a");

    return () => {
      if (winSoundRef.current) winSoundRef.current.pause();
      if (lostSoundRef.current) lostSoundRef.current.pause();
      if (winMidSoundRef.current) winMidSoundRef.current.pause();
    };
  }, []);

  const currentRoundConfig = rounds[currentRound];
  const isLastRound = currentRound === rounds.length - 1;

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
      console.log("Музыка остановлена");
    }
  };

  // Расчет штрафа (10% от очков раунда)
  const calculatePenalty = (points: number): number => {
    return Math.floor(points * 0.1);
  };

  // Показ анимации очков и проигрывание звука
  const showPointsAnimation = (
    correct: boolean,
    points: number,
    isPenalty: boolean = false,
  ) => {
    if (isPenalty) {
      setRoundScore(-points);
      setIsCorrect(false);
    } else {
      setRoundScore(correct ? points : 0);
      setIsCorrect(correct);
    }

    setShowScoreAnimation(true);

    if (correct && winSoundRef.current) {
      winSoundRef.current.currentTime = 0;
      winSoundRef.current
        .play()
        .catch((e) => console.log("Звук не воспроизвелся:", e));
    } else if ((!correct || isPenalty) && lostSoundRef.current) {
      lostSoundRef.current.currentTime = 0;
      lostSoundRef.current
        .play()
        .catch((e) => console.log("Звук не воспроизвелся:", e));
    }

    setTimeout(() => {
      setShowScoreAnimation(false);
      setRoundScore(null);
    }, 1500);
  };

  // Функция для генерации случайного времени
  const generateRandomTime = (track: Track): number => {
    if (!track || track.duration <= 0) return 0;

    if (currentRoundConfig.useIntro) {
      return 0;
    } else if (currentRoundConfig.useOutro) {
      const outroTime = Math.max(0, track.duration - 20);
      return outroTime;
    } else {
      const maxStartTime = track.duration / 2;
      const randomSeconds = Math.random() * maxStartTime;
      return Math.round(randomSeconds * 100) / 100;
    }
  };

  // Загрузка треков из JSON файла
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
    clearCountdown();

    let timeLeft = currentRoundConfig.timeLimit;
    setCountdown(timeLeft);

    countdownIntervalRef.current = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearCountdown();
        stopMusic();

        console.log(`⏰ РАУНД ${currentRound + 1}: Время вышло!`);
        const penalty = calculatePenalty(
          currentRoundConfig.points * difficulty,
        );
        const currentScore = totalScoreRef.current;
        const newScore = currentScore - penalty;
        console.log(
          `   Штраф: 10% от ${currentRoundConfig.points * difficulty} = ${penalty}`,
        );
        console.log(`   Счет был: ${currentScore}, стал: ${newScore}`);

        // Обновляем состояние
        setTotalScore(newScore);
        totalScoreRef.current = newScore;

        setAnswerSelected(true);
        showPointsAnimation(false, penalty, true);

        const updatedOptions = answerOptions.map((opt) => ({
          ...opt,
          showResult: true,
        }));
        setAnswerOptions(updatedOptions);

        setTimeout(() => {
          nextRound();
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
      if (currentRoundConfig.type === "coverOnly") {
        setShowCoverForRound(true);
        setHasStarted(true);
        setIsTrackLoading(false);
        startCountdown();
        return;
      } else if (currentRoundConfig.type === "guessExecutor") {
        setShowTitleForRound(true);
        setHasStarted(true);
        setIsTrackLoading(false);
        startCountdown();
        return;
      } else if (currentRoundConfig.type === "guessCover") {
        setShowTrackInfoForGuessCover(true);
        setHasStarted(true);
        setIsTrackLoading(false);
        startCountdown();
        return;
      }

      console.log("Начинаем загрузку трека...");
      await preloadAudio(currentTrack.audiofile);
      setTrackLoadProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const startPosition = generateRandomTime(currentTrack);
      setRandomTime(startPosition);
      console.log(`Стартовая позиция: ${startPosition} сек`);

      let attempts = 0;
      while (!playerRef.current?.audio.current && attempts < 20) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        attempts++;
      }

      if (playerRef.current?.audio.current) {
        playerRef.current.audio.current.currentTime = startPosition;
        await playerRef.current.audio.current.play();
        console.log("Воспроизведение успешно началось");

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

  const nextRound = () => {
    // Берем актуальное значение из ref
    const currentScore = totalScoreRef.current;

    console.log(`🔄 ПЕРЕХОД К СЛЕДУЮЩЕМУ РАУНДУ`);
    console.log(`   Текущий раунд: ${currentRound + 1}/${rounds.length}`);
    console.log(`   Текущий счет: ${currentScore}`);

    if (isLastRound) {
      console.log(`🏁 ИГРА ЗАВЕРШЕНА!`);
      console.log(`   Итоговый счет: ${currentScore}`);

      if (winMidSoundRef.current) {
        winMidSoundRef.current.currentTime = 0;
        winMidSoundRef.current
          .play()
          .catch((e) => console.log("Звук не воспроизвелся:", e));
      }

      console.log(`📤 Передаем результат игры в App: ${currentScore}`);
      console.log(`📂 ID категории: ${category.id}`);
      onUpdateGlobalScore(currentScore, category.id);

      setQuizCompleted(true);
      setIsQuizActive(false);
      setShowListenButton(false);
      return;
    }

    setCurrentRound((prev) => prev + 1);
    setHasStarted(false);
    setIsQuizActive(true);
    setAnswerSelected(false);
    setSelectedAnswerUid(null);
    setIsTrackLoading(true);
    setShowListenButton(true);
    setRandomTime(null);
    setShowCoverForRound(false);
    setShowTitleForRound(false);
    setShowTrackInfoForGuessCover(false);

    selectRandomTrackAndOptions(tracks);
  };

  const handleAnswerClick = (option: AnswerOption) => {
    if (answerSelected || !isQuizActive || !hasStarted) return;

    clearCountdown();
    stopMusic();

    setAnswerSelected(true);
    setSelectedAnswerUid(option.track.uidTrack);

    const updatedOptions = answerOptions.map((opt) => ({
      ...opt,
      showResult: true,
    }));
    setAnswerOptions(updatedOptions);

    // Используем текущее значение из ref
    const currentScore = totalScoreRef.current;

    if (option.isCorrect) {
      console.log(`✅ РАУНД ${currentRound + 1}: Правильный ответ!`);
      const roundPointsWithMultiplier = currentRoundConfig.points * difficulty;
      console.log(
        `   База: ${currentRoundConfig.points} × ${difficulty} = ${roundPointsWithMultiplier}`,
      );
      const newScore = currentScore + roundPointsWithMultiplier;
      console.log(`   Счет был: ${currentScore}, стал: ${newScore}`);

      setTotalScore(newScore);
      totalScoreRef.current = newScore;
      showPointsAnimation(true, roundPointsWithMultiplier);

      setTimeout(() => {
        nextRound();
      }, 1500);
    } else {
      console.log(`❌ РАУНД ${currentRound + 1}: Неправильный ответ!`);
      const penalty = calculatePenalty(currentRoundConfig.points * difficulty);
      console.log(
        `   Штраф: 10% от ${currentRoundConfig.points * difficulty} = ${penalty}`,
      );
      const newScore = currentScore - penalty;
      console.log(`   Счет был: ${currentScore}, стал: ${newScore}`);

      setTotalScore(newScore);
      totalScoreRef.current = newScore;
      showPointsAnimation(false, penalty, true);

      setTimeout(() => {
        nextRound();
      }, 2000);
    }
  };

  const startNewGame = () => {
    setCurrentRound(0);
    setTotalScore(0);
    totalScoreRef.current = 0;
    setQuizCompleted(false);
    setIsQuizActive(true);
    setHasStarted(false);
    setAnswerSelected(false);
    setSelectedAnswerUid(null);
    setIsTrackLoading(true);
    setShowListenButton(true);
    setRandomTime(null);
    setShowCoverForRound(false);
    setShowTitleForRound(false);
    setShowTrackInfoForGuessCover(false);
    selectRandomTrackAndOptions(tracks);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-600 ibm">
              Загрузка квиза "{category.name}"...
            </p>
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
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-no-repeat bg-cover bg-fixed relative py-8 px-4">
      {/* Анимация очков */}
      {showScoreAnimation && roundScore !== null && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-6xl md:text-8xl font-bold animate-bounce ${roundScore > 0 ? "text-green-500" : "text-red-500"}`}
        >
          {roundScore > 0 ? `+${roundScore}` : `${roundScore}`}
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        {/* Верхняя панель с названием категории и раундом */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white text-xl shadow-md ibm">
            {category.name}
          </div>
          <div className=" text-pink-400 text-xl ibm">
            Раунд {currentRound + 1}/{rounds.length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Верхняя секция с информацией о раунде */}
          <div
            className={`bg-linear-to-r ${category.color} p-4 md:p-6 text-black ibm`}
          >
            <div className="text-center">
              <div className="text-lg md:text-xl">
                {!quizCompleted && <div>{currentRoundConfig.description}</div>}
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="p-4 md:p-6">
            {/* Аудио плеер (скрытый) */}
            {currentTrack.audiofile &&
              currentRoundConfig.type !== "coverOnly" &&
              currentRoundConfig.type !== "guessExecutor" &&
              currentRoundConfig.type !== "guessCover" && (
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
              )}

            {/* Отображение обложки для раунда coverOnly */}
            {showCoverForRound && currentTrack && (
              <div className="text-center py-8">
                <img
                  src={currentTrack.coverHTTP || "/icon_2.jpg"}
                  alt="Обложка альбома"
                  className="w-64 h-64 mx-auto rounded-full shadow-2xl object-cover"
                />
                <p className="mt-4 text-gray-600">Угадайте песню по обложке!</p>
              </div>
            )}

            {/* Отображение названия трека для раунда guessExecutor */}
            {showTitleForRound && currentTrack && (
              <div className="text-center py-8">
                <div className="bg-purple-100 rounded-xl p-6 max-w-md mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-purple-800">
                    {currentTrack.titleTrack}
                  </h3>
                </div>
                <p className="mt-4 text-gray-600 ibm">
                  Кто исполняет эту песню?
                </p>
              </div>
            )}

            {/* Отображение названия трека и исполнителя для раунда guessCover */}
            {showTrackInfoForGuessCover && currentTrack && (
              <div className="text-center py-8">
                <div className="bg-purple-100 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-sm text-purple-600 mb-2">
                    Название песни:
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-purple-800 mb-3">
                    {currentTrack.titleTrack}
                  </h3>
                  <p className="text-sm text-purple-600 mb-2">Исполнитель:</p>
                  <p className="text-xl md:text-2xl font-semibold text-purple-700">
                    {currentTrack.titleExecutor}
                  </p>
                </div>
                <p className="mt-4 text-gray-600 ibm">
                  Выберите правильную обложку!
                </p>
              </div>
            )}

            {/* Кнопка "Слушать" или индикатор загрузки */}
            {!quizCompleted && (
              <>
                {showListenButton ? (
                  <div className="text-center">
                    <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl text-blue-600 ibm">
                        Очков за победу:{" "}
                        {currentRoundConfig.points * difficulty}
                      </p>
                    </div>
                    <button
                      onClick={startListening}
                      className="px-8 py-4 bg-pink-500 text-white rounded-xl ibm text-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-sm"
                    >
                      Играть
                    </button>
                  </div>
                ) : isTrackLoading && !hasStarted ? (
                  <div className="text-center">
                    <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl text-blue-600 ibm">
                        Очков за победу:{" "}
                        {currentRoundConfig.points * difficulty}
                      </p>
                    </div>
                    <div className="inline-flex flex-col items-center gap-3">
                      {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div> */}
                      <div className="w-10">
                        <img src="/loading.gif" alt="" />
                      </div>
                      <div className="text-gray-600 ibm">
                        Загрузка задания... {Math.round(trackLoadProgress)}%
                      </div>
                      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300 ibm"
                          style={{ width: `${trackLoadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  hasStarted && (
                    <>
                      {/* Таймер */}
                      <div
                        className={`text-center mb-6 ${countdown < 6 ? "animate-ping" : "animate-none"}`}
                      >
                        <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2">
                          <span className="text-2xl text-purple-600 ibm">
                            {countdown}
                          </span>
                          <span className="text-purple-600 ibm">
                            секунд осталось
                          </span>
                        </div>
                      </div>

                      {/* Варианты ответов */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                          Выберите правильный вариант:
                        </h3>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                          {answerOptions.map((option) => {
                            let borderClass = "border-2 border-transparent";
                            if (option.showResult) {
                              if (option.isCorrect) {
                                borderClass =
                                  "border-4 border-green-500 shadow-lg";
                              } else if (
                                selectedAnswerUid === option.track.uidTrack &&
                                !option.isCorrect
                              ) {
                                borderClass = "border-4 border-red-500";
                              }
                            }

                            const isRound4 =
                              currentRoundConfig.type === "guessExecutor";
                            const isRound6 =
                              currentRoundConfig.type === "guessCover";
                            const isRound5 =
                              currentRoundConfig.type === "noTitle";
                            const showCoverInOption =
                              currentRoundConfig.type !== "coverOnly" &&
                              !isRound6;

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
                                    {isRound6 ? (
                                      <div className="w-24 h-24 md:w-28 md:h-28">
                                        <img
                                          src={
                                            option.track.coverHTTP ||
                                            "/icon_2.jpg"
                                          }
                                          alt="Обложка"
                                          className="w-full h-full rounded-lg object-cover shadow-md"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                              "/icon_2.jpg";
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      showCoverInOption &&
                                      option.track.coverHTTP && (
                                        <div className="w-20 h-20 md:w-24 md:h-24 mb-3">
                                          <img
                                            src={option.track.coverHTTP}
                                            alt={option.track.titleTrack}
                                            className="w-full h-full rounded-lg object-cover shadow-md"
                                            onError={(e) => {
                                              (
                                                e.target as HTMLImageElement
                                              ).src = "/icon_2.jpg";
                                            }}
                                          />
                                        </div>
                                      )
                                    )}
                                    <div className="flex-1 w-full">
                                      {isRound4 || isRound5 ? (
                                        <h4 className="font-semibold text-gray-800 text-base md:text-lg wrap-break-word">
                                          {option.track.titleExecutor}
                                        </h4>
                                      ) : (
                                        !isRound6 && (
                                          <>
                                            <h4 className="font-semibold text-gray-800 text-sm md:text-base wrap-break-word">
                                              {option.track.titleTrack}
                                            </h4>
                                            <p className="text-xs md:text-sm text-gray-600 mt-1 wrap-break-word">
                                              {option.track.titleExecutor}
                                            </p>
                                          </>
                                        )
                                      )}
                                    </div>
                                    {option.showResult && option.isCorrect && (
                                      <div className="absolute top-2 right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">
                                        ✓
                                      </div>
                                    )}
                                    {option.showResult &&
                                      selectedAnswerUid ===
                                        option.track.uidTrack &&
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
                      </div>
                    </>
                  )
                )}
              </>
            )}

            {/* Результаты игры */}
            {quizCompleted && (
              <div className="text-center py-8 ibm">
                <h3 className="text-4xl text-gray-800 mb-4">Игра завершена!</h3>
                <div className="bg-pink-500 rounded-xl p-6 mb-6">
                  <p className="text-white text-lg mb-2">
                    Ваш результат в этой игре:
                  </p>
                  <p className="text-amber-200 text-5xl">{totalScore}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={startNewGame}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Играть заново
                  </button>
                  <button
                    onClick={onBack}
                    className="px-6 py-3 bg-lime-500 text-white hover:text-black rounded-lg hover:bg-lime-200 transition-all"
                  >
                    Выбрать другую категорию
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {!quizCompleted && (
          <button
            onClick={onBack}
            className="mt-4 text-sm ibm text-purple-200 cursor-pointer"
          >
            {"> "}Выход из игры
          </button>
        )}
        {quizCompleted && (
          <button
            onClick={onBack}
            className="mt-4 text-sm ibm text-purple-200 cursor-pointer"
          >
            Нравится игра? Сделайте донат.
          </button>
        )}
      </div>
    </div>
  );
};

export default MusicQuiz;
