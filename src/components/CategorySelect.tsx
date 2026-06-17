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
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900">
      {/* Хедер */}
      <Header
        globalScore={globalScore}
        highScore={highScore}
        playerProgress={playerProgress}
      />

      {/* Анимация повышения уровня */}
      {showLevelUp && levelUpData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="animate-bounce-slow text-center bg-linear-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 shadow-2xl max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-2">
              НОВЫЙ УРОВЕНЬ!
            </h2>
            <p className="text-3xl font-bold text-yellow-100 mb-2">
              {levelUpData.title}
            </p>
            <p className="text-2xl font-bold text-white">
              Уровень {levelUpData.level}
            </p>
            <p className="text-xl font-bold text-green-300 mt-4">
              +{levelUpData.bonus} бонусных очков!
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <img className="w-80 mx-auto" src="/logo.png" alt="" />

          <p className="text-xl text-purple-200">
            Выберите категорию игры, да посложнее!
          </p>
          {/* <p className="text-sm text-purple-300/70 mt-2">
            Сыграно категорий: {playerProgress.playedCategories.length}
          </p> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const isPlayed = playerProgress.playedCategories.includes(
              category.id,
            );
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category)}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-r ${category.color} opacity-90`}
                />
                <div className="relative p-4 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-5xl">{category.icon}</div>
                    <div
                      className={`relative ${getDifficultyColor(category.difficulty)} px-3 py-1 rounded-full text-xs shadow-lg`}
                    >
                      {getDifficultyText(category.difficulty)}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-left">
                    {category.name}
                  </h2>
                  <p className="text-white/90 text-sm mb-3 text-left">
                    {category.description}
                  </p>
                  {isPlayed && (
                    <div className="absolute bottom-2 right-3 text-white/50 text-xs">
                      ✓ Пройдена
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-12 text-purple-200 text-sm">
          <p>🎯 Посмотрим, какой вы меломан...</p>
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
