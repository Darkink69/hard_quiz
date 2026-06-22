import React, { useState, useEffect } from "react";

import { getLevelConfig } from "../data/levels";
import type { PlayerProgress } from "../utils/levelUtils";

interface HeaderProps {
  globalScore: number;
  highScore: string;
  playerProgress: PlayerProgress;
}

const Header: React.FC<HeaderProps> = ({
  globalScore,
  highScore,
  playerProgress,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const currentLevelConfig = getLevelConfig(playerProgress.level);

  return (
    <>
      {/* Хедер */}
      <header className="bg-linear-to-r from-gray-900 to-gray-950 sticky top-0 z-40 ibm opacity-90">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Логотип */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-5" />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Общий результат */}
              <div className="px-3 py-1.5 md:px-4 md:py-2">
                <span className="text-yellow-300 text-sm md:text-base">
                  {isMobile ? (
                    <img
                      src="/icon_1.jpg"
                      alt="Общий результат"
                      className="w-5 h-5 inline"
                    />
                  ) : (
                    <span className="flex items-center gap-1">
                      <img
                        src="/icon_1.jpg"
                        alt="Общий результат"
                        className="w-5 h-5 inline"
                      />
                      ОБЩИЙ РЕЗУЛЬТАТ:
                    </span>
                  )}
                </span>
                <span className="text-yellow-100 ml-1 text-sm md:text-base">
                  {globalScore}
                </span>
              </div>

              {/* Рекорд */}
              <div className="px-3 py-1.5 md:px-4 md:py-2">
                <span className="text-purple-300 text-sm md:text-base">
                  {isMobile ? (
                    <img
                      src="/icon_2.jpg"
                      alt="Рекорд"
                      className="w-10 inline"
                    />
                  ) : (
                    <span className="flex items-center gap-1">
                      <img
                        src="/icon_2.jpg"
                        alt="Рекорд"
                        className="w-10 inline"
                      />
                      РЕКОРД:
                    </span>
                  )}
                </span>
                <span className="text-purple-100 ml-1 text-sm md:text-base">
                  {highScore}
                </span>
              </div>

              {/* Уровень */}
              <div className="px-3 py-1.5 md:px-4 md:py-2">
                <span className="text-green-300 text-sm md:text-base">
                  {isMobile ? (
                    <img
                      src="/icon_3.jpg"
                      alt="Уровень"
                      className="w-5 h-5 inline"
                    />
                  ) : (
                    <span className="flex items-center gap-1">
                      <img
                        src="/icon_3.jpg"
                        alt="Уровень"
                        className="w-5 h-5 inline"
                      />
                      УРОВЕНЬ:
                    </span>
                  )}
                </span>
                <span className="text-green-100 ml-1 text-sm md:text-base">
                  {playerProgress.level}
                  {!isMobile && currentLevelConfig && (
                    <span className="text-green-300/70 text-sm ml-1">
                      ({currentLevelConfig.title})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Гамбургер-меню */}
            <button
              onClick={toggleMenu}
              className="flex flex-col gap-1.5 p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Меню"
            >
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Полноэкранное меню */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-linear-to-br from-gray-900 to-purple-900 flex flex-col ibm"
          onClick={closeMenu}
        >
          <div
            className="container mx-auto max-w-6xl px-4 py-6 flex flex-col h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <div className="flex justify-end">
              <button
                onClick={closeMenu}
                className="text-white hover:text-purple-300 transition-colors p-2"
                aria-label="Закрыть меню"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Логотип в меню */}
            <div className="flex justify-center mb-8">
              <img src="/logo.png" alt="Logo" className="w-auto" />
            </div>

            {/* Пункты меню */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-4">
              <button
                onClick={() => {
                  closeMenu();
                  // TODO: Открыть страницу "Подробнее"
                }}
                className="text-2xl md:text-3xl text-white hover:text-purple-300 transition-colors py-3 px-8 hover:bg-white/10 rounded-xl w-full max-w-sm text-center"
              >
                Подробнее
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  // TODO: Открыть страницу "Правила"
                }}
                className="text-2xl md:text-3xl text-white hover:text-purple-300 transition-colors py-3 px-8 hover:bg-white/10 rounded-xl w-full max-w-sm text-center"
              >
                Правила
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  // TODO: Открыть страницу "Настройки"
                }}
                className="text-2xl md:text-3xl text-white hover:text-purple-300 transition-colors py-3 px-8 hover:bg-white/10 rounded-xl w-full max-w-sm text-center"
              >
                Настройки
              </button>
            </nav>

            {/* Донорская кнопка */}
            <div className="pb-8 flex justify-center">
              <button
                onClick={() => {
                  closeMenu();
                  // TODO: Открыть страницу доната
                }}
                className="text-xl md:text-2xl text-yellow-400 hover:text-yellow-300 transition-colors py-3 px-8 border-2 border-yellow-400/50 rounded-xl hover:bg-yellow-400/10 w-full max-w-sm text-center cursor-not-allowed"
              >
                Сделать донат
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
