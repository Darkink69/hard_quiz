import MusicQuiz from "./components/MusicQuiz";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎵 Музыкальный Квиз
          </h1>
          <p className="text-gray-600">
            Угадайте трек за 20 секунд! Название и исполнитель появятся после
            обратного отсчета
          </p>
        </header>

        <main>
          <MusicQuiz />
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2026 Hard quiz!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
