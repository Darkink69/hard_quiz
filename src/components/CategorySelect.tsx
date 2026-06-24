import { useEffect, useState } from "react";
import Header from "./Header";
import {
  categories,
  getDifficultyText,
  getDifficultyColor,
  type Category,
} from "../data/categories";

// import { getLevelConfig } from "../data/levels";
import type { PlayerProgress } from "../utils/levelUtils";

const colorMap: Record<string, string> = {
  "red-500": "border-red-500",
  "purple-500": "border-purple-500",
  "green-500": "border-green-500",
  "yellow-500": "border-yellow-500",
  "blue-500": "border-blue-500",
  "pink-500": "border-pink-500",
  "orange-500": "border-orange-500",
  "indigo-500": "border-indigo-500",
  "teal-500": "border-teal-500",
  "cyan-500": "border-cyan-500",
  "rose-500": "border-rose-500",
  "amber-500": "border-amber-500",
  "lime-500": "border-lime-500",
  "emerald-500": "border-emerald-500",
  "violet-500": "border-violet-500",
  "fuchsia-500": "border-fuchsia-500",
};

interface CategorySelectProps {
  onSelectCategory: (category: Category) => void;
  globalScore: number;
  playerProgress: PlayerProgress;
  levelUpData: { level: number; bonus: number; title: string } | null;
  onClearLevelUpData: () => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  onSelectCategory,
  globalScore,
  playerProgress,
  levelUpData,
  onClearLevelUpData,
}) => {
  const [highScore, setHighScore] = useState<string>("0");
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);

  // Загружаем рекорд из localStorage при монтировании
  useEffect(() => {
    const savedHighScore = localStorage.getItem("gameHighScore");
    if (savedHighScore) {
      setHighScore(savedHighScore);
    } else {
      // Если в gameHighScore нет, используем из playerProgress
      setHighScore(playerProgress.record.toString());
    }
  }, [playerProgress.record]);

  // Слушаем обновления рекорда из localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedHighScore = localStorage.getItem("gameHighScore");
      if (savedHighScore) {
        setHighScore(savedHighScore);
      } else {
        setHighScore(playerProgress.record.toString());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [playerProgress.record]);

  // Показываем анимацию повышения уровня
  useEffect(() => {
    if (levelUpData) {
      setShowLevelUp(true);
      const timer = setTimeout(() => {
        setShowLevelUp(false);
        onClearLevelUpData();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [levelUpData, onClearLevelUpData]);

  // const currentLevelConfig = getLevelConfig(playerProgress.level);

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-no-repeat bg-cover bg-fixed">
      {/* Хедер */}
      <Header
        globalScore={globalScore}
        highScore={highScore}
        playerProgress={playerProgress}
      />

      {/* Анимация повышения уровня */}
      {showLevelUp && levelUpData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="animate-bounce-slow text-center bg-orange-500 rounded-2xl p-8 shadow-2xl max-w-md mx-4">
            <div className="mb-4">
              <img src="/logo.png" alt="" />
            </div>
            <h2 className="text-4xl text-white mb-2 ibm">НОВЫЙ УРОВЕНЬ!</h2>
            <p className="text-3xl text-yellow-100 mb-2 ibm">
              {levelUpData.title}
            </p>
            <p className="text-2xl text-white ibm">
              Уровень {levelUpData.level}
            </p>
            <p className="text-xl text-green-300 mt-4 ibm">
              +{levelUpData.bonus} бонусных очков!
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <img className="w-80 mx-auto" src="/logo.png" alt="" />

          <p className="text-xl text-purple-200 ibm">
            Угадайте песню. Выберите категорию игры, да посложнее!
          </p>
          {/* <p className="text-sm text-purple-300/70 mt-2">
            Сыграно категорий: {playerProgress.playedCategories.length}
          </p> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const borderClass = colorMap[category.color] || "border-gray-500";

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category)}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-0 bg-black border-4 ${borderClass} opacity-90`}
                />
                <div className="relative p-4 text-white">
                  <div className="md:flex flex-none items-start gap-4">
                    <div className="shrink-0">
                      <img
                        src={"/img/" + category.icon}
                        alt={category.name}
                        className="w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Название категории */}
                      <h2
                        className={`text-lg md:text-2xl text-${category.color} text-left wrap-break-word ibm leading-7 mt-1`}
                      >
                        {category.name}
                      </h2>

                      {/* Описание */}
                      <p className="text-white/80 text-xs md:text-sm mb-2 text-left wrap-break-word ibm">
                        {category.description}
                      </p>

                      {/* Сложность */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${getDifficultyColor(category.difficulty)}`}
                        >
                          {getDifficultyText(category.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-12 text-purple-200 text-sm ibm">
          <p>Посмотрим, какой вы меломан...|</p>
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
