export interface LevelConfig {
  level: number;
  requiredScore: number;
  requiredRecord: number;
  requiredCategories: number;
  bonus: number;
  title: string;
}

export const levelConfigs: LevelConfig[] = [
  {
    level: 1,
    requiredScore: 0,
    requiredRecord: 0,
    requiredCategories: 0,
    bonus: 0,
    title: "Новичок",
  },
  {
    level: 2,
    requiredScore: 3000,
    requiredRecord: 0,
    requiredCategories: 0,
    bonus: 1000,
    title: "Любитель",
  },
  {
    level: 3,
    requiredScore: 10000,
    requiredRecord: 1000,
    requiredCategories: 0,
    bonus: 1000,
    title: "Знаток",
  },
  {
    level: 4,
    requiredScore: 15000,
    requiredRecord: 1500,
    requiredCategories: 9,
    bonus: 1000,
    title: "Эксперт",
  },
  {
    level: 5,
    requiredScore: 20000,
    requiredRecord: 2000,
    requiredCategories: 15,
    bonus: 2000,
    title: "Маэстро",
  },
  {
    level: 6,
    requiredScore: 30000,
    requiredRecord: 2500,
    requiredCategories: 20,
    bonus: 3000,
    title: "Легенда",
  },
  {
    level: 7,
    requiredScore: 50000,
    requiredRecord: 2800,
    requiredCategories: 30,
    bonus: 5000,
    title: "Музыкальный Бог",
  },
];

export const getMaxLevel = (): number => {
  return levelConfigs.length;
};

export const getLevelConfig = (level: number): LevelConfig | undefined => {
  return levelConfigs.find((config) => config.level === level);
};

export const getNextLevelConfig = (
  currentLevel: number,
): LevelConfig | undefined => {
  return levelConfigs.find((config) => config.level === currentLevel + 1);
};
