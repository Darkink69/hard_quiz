import { categories, type Category } from "../data/categories";

interface CategorySelectProps {
  onSelectCategory: (category: Category) => void;
  globalScore: number;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  onSelectCategory,
  globalScore,
}) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-purple-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Верхняя панель с общим результатом */}
        <div className="flex justify-end mb-8">
          <div className="bg-yellow-500/30 backdrop-blur-sm rounded-full px-6 py-3 text-yellow-100 font-bold border border-yellow-400/50 shadow-lg">
            🏆 Общий результат: {globalScore}
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎵 Супер сложный квиз
          </h1>
          <p className="text-xl text-purple-200">
            Выберите категорию и проверьте свои знания!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12 text-purple-200 text-sm">
          <p className="mt-2">✨ Посмотрим, какой вы меломан... ✨</p>
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
