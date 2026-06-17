import { useState, useEffect } from "react";
import CategorySelect from "./components/CategorySelect";
import MusicQuiz from "./components/MusicQuiz";
import "./App.css";
import type { Category } from "./data/categories";
import {
  loadPlayerProgress,
  savePlayerProgress,
  updateTotalScore,
  updateRecord,
  addPlayedCategory,
  checkLevelUp,
  type PlayerProgress,
} from "./utils/levelUtils";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [globalTotalScore, setGlobalTotalScore] = useState<number>(0);
  const [playerProgress, setPlayerProgress] =
    useState<PlayerProgress>(loadPlayerProgress());
  const [levelUpData, setLevelUpData] = useState<{
    level: number;
    bonus: number;
    title: string;
  } | null>(null);

  // Загрузка глобального счета из localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem("musicQuizGlobalScore");
    if (savedScore) {
      setGlobalTotalScore(parseInt(savedScore, 10));
    }
  }, []);

  // Загрузка прогресса игрока
  useEffect(() => {
    setPlayerProgress(loadPlayerProgress());
  }, []);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const handleUpdateGlobalScore = (gameScore: number, categoryId: string) => {
    console.log("=== НАЧАЛО ОБРАБОТКИ РЕЗУЛЬТАТА ИГРЫ ===");
    console.log(`📊 Результат игры (без бонусов): ${gameScore}`);
    console.log(`📂 Категория: ${categoryId}`);

    if (!categoryId) {
      console.warn("⚠️ categoryId не передан! Использую 'unknown'");
      categoryId = "unknown";
    }

    // 1. Обновляем общий счет
    const updatedScore = globalTotalScore + gameScore;
    console.log(
      `💰 Общий счет был: ${globalTotalScore}, стал: ${updatedScore}`,
    );
    setGlobalTotalScore(updatedScore);
    localStorage.setItem("musicQuizGlobalScore", updatedScore.toString());

    // 2. Загружаем прогресс игрока
    let progress = loadPlayerProgress();
    console.log(`👤 Текущий уровень: ${progress.level}`);
    console.log(`📈 Текущий рекорд: ${progress.record}`);
    console.log(`📊 Текущий общий счет игрока: ${progress.totalScore}`);

    // 3. Добавляем категорию в список сыгранных
    progress = addPlayedCategory(progress, categoryId);
    console.log(`📂 Сыграно категорий: ${progress.playedCategories.length}`);

    // 4. Обновляем общий счет игрока (для уровней)
    progress = updateTotalScore(progress, gameScore);
    console.log(
      `📊 Общий счет игрока после обновления: ${progress.totalScore}`,
    );

    // 5. Обновляем рекорд
    progress = updateRecord(progress, gameScore);
    console.log(`📈 Рекорд после обновления: ${progress.record}`);

    // 6. СОХРАНЯЕМ РЕКОРД В gameHighScore ДЛЯ ОТОБРАЖЕНИЯ
    const currentHighScore = localStorage.getItem("gameHighScore");
    const currentHighScoreNumber = currentHighScore
      ? parseInt(currentHighScore, 10)
      : 0;

    if (gameScore > currentHighScoreNumber) {
      console.log(
        `📈 НОВЫЙ РЕКОРД В gameHighScore! ${gameScore} > ${currentHighScoreNumber}`,
      );
      localStorage.setItem("gameHighScore", gameScore.toString());
    } else {
      console.log(
        `📈 Рекорд gameHighScore не обновлен: ${gameScore} <= ${currentHighScoreNumber}`,
      );
    }

    // 7. Проверяем повышение уровня
    const levelUpResult = checkLevelUp(progress);
    console.log(`🔍 Проверка уровня: canLevelUp=${levelUpResult.canLevelUp}`);

    if (levelUpResult.canLevelUp && levelUpResult.config) {
      console.log(
        `⭐ ПОВЫШЕНИЕ УРОВНЯ! Новый уровень: ${levelUpResult.newLevel}`,
      );
      console.log(`💰 Бонус за уровень: ${levelUpResult.bonus}`);

      setLevelUpData({
        level: levelUpResult.newLevel,
        bonus: levelUpResult.bonus,
        title: levelUpResult.config.title,
      });

      const scoreWithBonus = updatedScore + levelUpResult.bonus;
      console.log(`💰 Общий счет с бонусом за уровень: ${scoreWithBonus}`);
      setGlobalTotalScore(scoreWithBonus);
      localStorage.setItem("musicQuizGlobalScore", scoreWithBonus.toString());

      progress.level = levelUpResult.newLevel;
      progress.totalScore += levelUpResult.bonus;
      console.log(`📊 Общий счет игрока с бонусом: ${progress.totalScore}`);
    }

    // 8. Сохраняем прогресс
    savePlayerProgress(progress);
    setPlayerProgress(progress);

    console.log("=== КОНЕЦ ОБРАБОТКИ РЕЗУЛЬТАТА ===");
    console.log(
      `🏆 Итоговый общий счет: ${localStorage.getItem("musicQuizGlobalScore")}`,
    );
    console.log(`📈 Итоговый рекорд (playerProgress): ${progress.record}`);
    console.log(
      `📈 Итоговый рекорд (gameHighScore): ${localStorage.getItem("gameHighScore")}`,
    );
    console.log(`⭐ Итоговый уровень: ${progress.level}`);
    console.log("====================================\n");
  };

  const clearLevelUpData = () => {
    setLevelUpData(null);
  };

  return (
    <div>
      {!selectedCategory ? (
        <CategorySelect
          onSelectCategory={handleSelectCategory}
          globalScore={globalTotalScore}
          playerProgress={playerProgress}
          levelUpData={levelUpData}
          onClearLevelUpData={clearLevelUpData}
        />
      ) : (
        <MusicQuiz
          category={selectedCategory}
          onBack={handleBack}
          onUpdateGlobalScore={handleUpdateGlobalScore}
          difficulty={selectedCategory.difficulty}
        />
      )}
    </div>
  );
}

export default App;
