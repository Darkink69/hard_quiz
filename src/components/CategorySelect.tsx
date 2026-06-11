import { useEffect, useState } from "react";
import {
  categories,
  getDifficultyText,
  getDifficultyColor,
  type Category,
} from "../data/categories";

interface CategorySelectProps {
  onSelectCategory: (category: Category) => void;
  globalScore: number;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  onSelectCategory,
  globalScore,
}) => {
  const [highScore, setHighScore] = useState<string>("0");

  // Загружаем рекорд из localStorage при монтировании компонента
  useEffect(() => {
    const savedHighScore = localStorage.getItem("gameHighScore");
    if (savedHighScore) {
      setHighScore(savedHighScore);
    }
  }, []);

  // Слушаем обновления рекорда из других компонентов (например, при завершении игры)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedHighScore = localStorage.getItem("gameHighScore");
      if (savedHighScore) {
        setHighScore(savedHighScore);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Верхняя панель с результатами */}
        <div className="flex justify-center md:justify-end gap-4 mb-8">
          <div className="bg-yellow-500/30 backdrop-blur-sm rounded-full px-6 py-3 text-yellow-100 font-bold border border-yellow-400/50 shadow-lg">
            🏆 Общий результат: {globalScore}
          </div>
          <div className="bg-purple-500/30 backdrop-blur-sm rounded-full px-6 py-3 text-purple-100 font-bold border border-purple-400/50 shadow-lg">
            📈 Рекорд игры: {highScore}
          </div>
        </div>

        <div className="text-center mb-12">
          <img className="w-80 mx-auto" src="/logo.png" alt="" />
          <p className="text-xl text-purple-200">
            Выберите категорию игры, да посложнее!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
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
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12 text-purple-200 text-sm">
          <p>🎯 Посмотрим, какой вы меломан...</p>
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
