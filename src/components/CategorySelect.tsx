import React from "react";
import { categories, type Category } from "../data/categories";

interface CategorySelectProps {
  onSelectCategory: (category: Category) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  onSelectCategory,
}) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎵 Музыкальный Квиз
          </h1>
          <p className="text-xl text-purple-200">
            Выберите категорию и проверьте свои знания!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div
                className={`absolute inset-0 bg-linear-to-r ${category.color} opacity-90`}
              />
              <div className="relative p-8 text-white">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                <p className="text-white/90 mb-4">{category.description}</p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span>Начать квиз</span>
                  <span>→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12 text-purple-200 text-sm">
          <p>
            🎯 Угадайте трек за 20 секунд! Выбирайте правильный вариант из 4
            предложенных.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
