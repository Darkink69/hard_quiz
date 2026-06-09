import { useState } from "react";
import CategorySelect from "./components/CategorySelect";
import MusicQuiz from "./components/MusicQuiz";

import "./App.css";
import type { Category } from "./data/categories";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div>
      {!selectedCategory ? (
        <CategorySelect onSelectCategory={handleSelectCategory} />
      ) : (
        <MusicQuiz category={selectedCategory} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
