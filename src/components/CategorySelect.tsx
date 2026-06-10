import React, { useState } from "react";
import {
  categories,
  getDifficultyText,
  getDifficultyColor,
  // getDifficultyMultiplier,
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
  const [tooltipText, setTooltipText] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleDifficultyMouseEnter = (
    e: React.MouseEvent,
    difficulty: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setTooltipText(`Все набранные очки умножаются на ${difficulty}`);
    setShowTooltip(true);
  };

  const handleDifficultyMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 py-12 px-4">
      {/* Верхняя панель с общим результатом */}
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-end mb-8">
          <div className="bg-yellow-500/30 backdrop-blur-sm rounded-full px-6 py-3 text-yellow-100 font-bold border border-yellow-400/50 shadow-lg">
            🏆 Общий результат: {globalScore}
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Квиз - фиг угадаешь
          </h1>
          <p className="text-xl text-purple-200">
            Выберите категорию, да посложнее!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div
                className={`absolute inset-0 bg-linear-to-r ${category.color} opacity-90`}
              />
              <div className="relative p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-5xl">{category.icon}</div>
                  <div
                    className={`relative ${getDifficultyColor(category.difficulty)} px-3 py-1 rounded-full text-xs font-bold shadow-lg cursor-help`}
                    onMouseEnter={(e) =>
                      handleDifficultyMouseEnter(e, category.difficulty)
                    }
                    onMouseLeave={handleDifficultyMouseLeave}
                  >
                    {getDifficultyText(category.difficulty)}
                    <span className="ml-1 text-xs opacity-75">
                      {/* {getDifficultyMultiplier(category.difficulty)} */}
                    </span>
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

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          {tooltipText}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
