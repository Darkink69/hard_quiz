import { getNextLevelConfig, type LevelConfig } from "../data/levels";

export interface PlayerProgress {
  level: number;
  totalScore: number;
  record: number;
  playedCategories: string[];
  levelUpAnimationShown?: boolean;
}

// Загрузка прогресса игрока из localStorage
export const loadPlayerProgress = (): PlayerProgress => {
  const saved = localStorage.getItem("playerProgress");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return getDefaultProgress();
    }
  }
  return getDefaultProgress();
};

// Получение прогресса по умолчанию
export const getDefaultProgress = (): PlayerProgress => {
  return {
    level: 1,
    totalScore: 0,
    record: 0,
    playedCategories: [],
    levelUpAnimationShown: false,
  };
};

// Сохранение прогресса игрока
export const savePlayerProgress = (progress: PlayerProgress): void => {
  localStorage.setItem("playerProgress", JSON.stringify(progress));
};

// Проверка возможности повышения уровня
export const checkLevelUp = (
  progress: PlayerProgress,
): {
  canLevelUp: boolean;
  newLevel: number;
  bonus: number;
  config: LevelConfig | null;
} => {
  const currentLevel = progress.level;
  const nextLevelConfig = getNextLevelConfig(currentLevel);

  if (!nextLevelConfig) {
    return {
      canLevelUp: false,
      newLevel: currentLevel,
      bonus: 0,
      config: null,
    };
  }

  const { requiredScore, requiredRecord, requiredCategories, bonus } =
    nextLevelConfig;

  const hasEnoughScore = progress.totalScore >= requiredScore;
  const hasEnoughRecord = progress.record >= requiredRecord;
  const hasEnoughCategories =
    progress.playedCategories.length >= requiredCategories;

  const canLevelUp = hasEnoughScore && hasEnoughRecord && hasEnoughCategories;

  if (canLevelUp) {
    console.log(
      `⭐ ПРОВЕРКА УРОВНЯ: Можно повысить до ${nextLevelConfig.level}`,
    );
    console.log(
      `   Требования: ${requiredScore} очков, ${requiredRecord} рекорд, ${requiredCategories} категорий`,
    );
    console.log(
      `   Текущие: ${progress.totalScore} очков, ${progress.record} рекорд, ${progress.playedCategories.length} категорий`,
    );
    return {
      canLevelUp: true,
      newLevel: nextLevelConfig.level,
      bonus,
      config: nextLevelConfig,
    };
  }

  return { canLevelUp: false, newLevel: currentLevel, bonus: 0, config: null };
};

// Добавление категории в список сыгранных
export const addPlayedCategory = (
  progress: PlayerProgress,
  categoryId: string,
): PlayerProgress => {
  // Проверяем, что categoryId не undefined и не null
  if (!categoryId) {
    console.warn("⚠️ categoryId не передан или равен null/undefined");
    return progress;
  }

  if (!progress.playedCategories.includes(categoryId)) {
    console.log(`📂 Добавлена категория: ${categoryId}`);
    return {
      ...progress,
      playedCategories: [...progress.playedCategories, categoryId],
    };
  }
  return progress;
};

// Обновление рекорда - ТОЛЬКО результат игры, без бонусов!
export const updateRecord = (
  progress: PlayerProgress,
  gameScore: number,
): PlayerProgress => {
  // gameScore - это чистый результат игры без бонусов
  if (gameScore > progress.record) {
    console.log(`📈 НОВЫЙ РЕКОРД! ${gameScore} > ${progress.record}`);
    return {
      ...progress,
      record: gameScore, // Сохраняем только результат игры, без бонусов!
    };
  }
  return progress;
};

// Обновление общего счета - только результат игры, без бонусов!
export const updateTotalScore = (
  progress: PlayerProgress,
  gameScore: number,
): PlayerProgress => {
  // gameScore - это чистый результат игры без бонусов
  console.log(
    `📊 Добавляем к общему счету ${gameScore} (было ${progress.totalScore})`,
  );
  return {
    ...progress,
    totalScore: progress.totalScore + gameScore,
  };
};
