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
    color: "red-500",
    file: "1.json",
    difficulty: 2,
  },
  {
    id: "90s",
    name: "Евроденс 90-х",
    description: "Евроденс хиты из 90-x",
    icon: "💃",
    color: "purple-500",
    file: "74.json",
    difficulty: 2,
  },
  {
    id: "ussr",
    name: "Дискотека СССР",
    description: "Советская эстрада",
    icon: "🎸",
    color: "red-500",
    file: "144.json",
    difficulty: 1,
  },
  {
    id: "kids",
    name: "Каникулы в СССР",
    description: "Песни из старых детских мультфильмов и фильмов",
    icon: "🧸",
    color: "green-500",
    file: "408.json",
    difficulty: 1,
  },
  {
    id: "kids2",
    name: "Детские песни",
    description: "Песни для детей всех времен",
    icon: "🧸",
    color: "yellow-500",
    file: "93.json",
    difficulty: 2,
  },
  {
    id: "rock",
    name: "Русский рок",
    description: "«Если есть в кармане пачка..»",
    icon: "🎸",
    color: "purple-500",
    file: "42.json",
    difficulty: 1,
  },
  {
    id: "shan",
    name: "Шансон",
    description: "Лучшие песни всех лет",
    icon: "🎤",
    color: "green-500",
    file: "50.json",
    difficulty: 2,
  },
  {
    id: "gold90",
    name: "90's Gold",
    description: "Золотой музыкальный фонд 90-х",
    icon: "🌟",
    color: "yellow-500",
    file: "75.json",
    difficulty: 1,
  },
  {
    id: "classic",
    name: "Классика",
    description: "Популярная классическая музыка",
    icon: "🎻",
    color: "red-500",
    file: "97.json",
    difficulty: 3,
  },
  {
    id: "trend",
    name: "Русские в тренде!",
    description: "Современная русская поп-музыка",
    icon: "🎻",
    color: "purple-500",
    file: "390.json",
    difficulty: 2,
  },
  {
    id: "euro",
    name: "Евро хиты!",
    description: "Современная популярная музыка",
    icon: "🎤",
    color: "yellow-500",
    file: "82.json",
    difficulty: 2,
  },
  {
    id: "2000",
    name: "Хиты 2000-х",
    description: "Любимые песни начала века",
    icon: "🎤",
    color: "green-500",
    file: "435.json",
    difficulty: 2,
  },
  {
    id: "sssr",
    name: "Бабушкин Хит",
    description: "Старые песни СССР",
    icon: "🎤",
    color: "purple-500",
    file: "46.json",
    difficulty: 2,
  },
  {
    id: "cyber",
    name: "Открытый космос",
    description: "Ретро электронная музыка",
    icon: "🎻",
    color: "red-500",
    file: "79.json",
    difficulty: 3,
  },
  {
    id: "kid3",
    name: "Ура! Каникулы!",
    description: "Песни из современных мультфильмов",
    icon: "🎻",
    color: "yellow-500",
    file: "409.json",
    difficulty: 2,
  },
  {
    id: "NY",
    name: "С Новым годом!",
    description: "Песни про Новый год и Рождество",
    icon: "🎻",
    color: "yellow-500",
    file: "384.json",
    difficulty: 1,
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
      return "text-green-500";
    case 2:
      return "text-yellow-500";
    case 3:
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
