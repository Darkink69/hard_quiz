import { useState, useEffect } from "react";
import CategorySelect from "./components/CategorySelect";
import MusicQuiz from "./components/MusicQuiz";

import "./App.css";
import type { Category } from "./data/categories";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [globalTotalScore, setGlobalTotalScore] = useState<number>(0);

  // Загрузка глобального счета из localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem("musicQuizGlobalScore");
    if (savedScore) {
      setGlobalTotalScore(parseInt(savedScore, 10));
    }
  }, []);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const handleUpdateGlobalScore = (newScore: number) => {
    const updatedScore = globalTotalScore + newScore;
    setGlobalTotalScore(updatedScore);
    localStorage.setItem("musicQuizGlobalScore", updatedScore.toString());
  };

  return (
    <div>
      {!selectedCategory ? (
        <CategorySelect
          onSelectCategory={handleSelectCategory}
          globalScore={globalTotalScore}
        />
      ) : (
        <MusicQuiz
          category={selectedCategory}
          onBack={handleBack}
          onUpdateGlobalScore={handleUpdateGlobalScore}
        />
      )}
    </div>
  );
}

export default App;
