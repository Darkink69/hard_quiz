export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  file: string;
}

export const categories: Category[] = [
  {
    id: "80s",
    name: "Дискотека 80-х",
    description: "Лучшие хиты 80-х годов",
    icon: "🕺",
    color: "from-blue-500 to-cyan-500",
    file: "1.json",
  },
  {
    id: "90s",
    name: "Евроденс 90-х",
    description: "Дискотечные Евроденс хиты",
    icon: "💃",
    color: "from-purple-500 to-pink-500",
    file: "74.json",
  },
  {
    id: "ussr",
    name: "Дискотека СССР",
    description: "Советская эстрада и диско",
    icon: "🎸",
    color: "from-red-500 to-orange-500",
    file: "144.json",
  },
  {
    id: "kids",
    name: "Детские мультфильмы и фильмы СССР",
    description: "Песни из любимых мультфильмов",
    icon: "🧸",
    color: "from-green-500 to-emerald-500",
    file: "408.json",
  },
  {
    id: "rock",
    name: "Русский рок",
    description: "«Если есть в кармане пачка..»",
    icon: "🧸",
    color: "from-green-500 to-emerald-500",
    file: "42.json",
  },
  {
    id: "shan",
    name: "Шансон",
    description: "Лучшие блатные песни всех лет",
    icon: "🕺",
    color: "from-blue-500 to-cyan-500",
    file: "50.json",
  },
];
