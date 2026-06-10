export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  file: string;
  difficulty: number; // 1 - легкий, 2 - средний, 3 - сложный
}

export const categories: Category[] = [
  {
    id: "80s",
    name: "Дискотека 80-х",
    description: "Лучшие хиты 80-х годов",
    icon: "🕺",
    color: "from-blue-500 to-cyan-500",
    file: "1.json",
    difficulty: 2,
  },
  {
    id: "90s",
    name: "Евроденс 90-х",
    description: "Евроденс хиты из 90-x",
    icon: "💃",
    color: "from-purple-500 to-pink-500",
    file: "74.json",
    difficulty: 2,
  },
  {
    id: "ussr",
    name: "Дискотека СССР",
    description: "Советская эстрада",
    icon: "🎸",
    color: "from-red-500 to-orange-500",
    file: "144.json",
    difficulty: 1,
  },
  {
    id: "kids",
    name: "Каникулы в СССР",
    description: "Песни из детских мультфильмов и фильмов",
    icon: "🧸",
    color: "from-green-500 to-emerald-500",
    file: "408.json",
    difficulty: 1,
  },
  {
    id: "kids2",
    name: "Детские песни",
    description: "Песни для детей всех времен",
    icon: "🧸",
    color: "from-green-500 to-emerald-500",
    file: "93.json",
    difficulty: 2,
  },
  {
    id: "rock",
    name: "Русский рок",
    description: "«Если есть в кармане пачка..»",
    icon: "🎸",
    color: "from-red-500 to-orange-500",
    file: "42.json",
    difficulty: 1,
  },
  {
    id: "shan",
    name: "Шансон",
    description: "Лучшие песни всех лет",
    icon: "🎤",
    color: "from-blue-500 to-cyan-500",
    file: "50.json",
    difficulty: 2,
  },
  {
    id: "gold90",
    name: "90's Gold",
    description: "Золотой музыкальный фонд 90-х",
    icon: "🌟",
    color: "from-yellow-500 to-orange-500",
    file: "75.json",
    difficulty: 1,
  },
  {
    id: "classic",
    name: "Классика",
    description: "Популярная классическая музыка",
    icon: "🎻",
    color: "from-purple-500 to-pink-500",
    file: "97.json",
    difficulty: 3,
  },
];

// Функция для получения текста сложности
export const getDifficultyText = (difficulty: number): string => {
  switch (difficulty) {
    case 1:
      return "Легкий";
    case 2:
      return "Нормальный";
    case 3:
      return "Сложный";
    default:
      return "Неизвестно";
  }
};

// Функция для получения цвета сложности
export const getDifficultyColor = (difficulty: number): string => {
  switch (difficulty) {
    case 1:
      return "bg-green-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Функция для получения множителя в текстовом виде
// export const getDifficultyMultiplier = (difficulty: number): string => {
//   return `×${difficulty}`;
// };
