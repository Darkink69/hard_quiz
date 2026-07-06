import React from "react";
import { categories } from "../data/categories";
import { levelConfigs } from "../data/levels";
import { rounds } from "../data/rounds";

interface AboutPageProps {
  onClose: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  // Подсчет уникальных типов раундов
  // const uniqueRoundTypes = new Set(rounds.map((r) => r.type));
  const totalRounds = rounds.length;
  const totalCategories = categories.length;
  //   const totalLevels = levelConfigs.length;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900  overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Кнопка закрытия */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onClose}
            className="text-white hover:text-purple-300 transition-colors p-2"
            aria-label="Закрыть"
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

        {/* Контент */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-white ibm">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </div>

          <p className="text-lg md:text-xl text-purple-200 mb-8">
            Считаете себя меломаном и знатоком музыки? Давайте это проверим!
          </p>

          <div className="space-y-6">
            {/* Описание игры */}
            <section>
              <h2 className="text-xl md:text-2xl text-yellow-300 mb-3">
                Что это за игра?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                <span className="text-white">Муз Квиз</span> — это игра, самая
                сложная викторина в интернете для настоящих ценителей музыки.
                Вам предстоит угадывать мелодии, исполнителей и названия треков
                в различных форматах. Все говорят, что знают и любят музыку.
                Время это доказать!
              </p>
            </section>

            {/* Как играть */}
            <section>
              <h2 className="text-xl md:text-2xl text-yellow-300 mb-3">
                Как играть?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="w-20">
                    <img src="/img/80s.png" alt="" />
                  </div>
                  <h3 className="text-white mb-1">Выберите категорию</h3>
                  <p className="text-gray-400 text-sm">
                    {totalCategories} категорий: от прошлых веков до современной
                    музыки. Плюс сложные, нишевые направления, в которых
                    разбираются единицы!
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="w-20">
                    <img src="/img/kids2.png" alt="" />
                  </div>
                  <h3 className="text-white mb-1">Угадайте за время</h3>
                  <p className="text-gray-400 text-sm">
                    {totalRounds} раундов с разными заданиями и ограничением по
                    времени. Shazam не успеете открыть! :-|
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="w-20">
                    <img src="/img/2000.png" alt="" />
                  </div>
                  <h3 className="text-white mb-1">Разные форматы</h3>
                  <p className="text-gray-400 text-sm">
                    Угадывайте по отрывку, обложке, вступлению или финалу.
                    Скучно слушать просто отрывок? Придумаем что-нибудь еще!
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="w-20">
                    <img src="/img/euro.png" alt="" />
                  </div>
                  <h3 className="text-white mb-1">Зарабатывайте очки</h3>
                  <p className="text-gray-400 text-sm">
                    Очки за правильный ответ, это конечно не деньги.. Но так вы
                    точно узнаете, что лучше вас никто не знает этот странный
                    музыкальный стиль со сложным названием.
                  </p>
                </div>
              </div>
            </section>

            {/* Уровни */}
            <section>
              <h2 className="text-xl md:text-2xl text-yellow-300 mb-2">
                Уровни игроков
              </h2>
              <p className="text-white text-sm mb-3">
                Скучно просто угадывать, хочется знать, на каком теперь вы
                уровне знаний. Чтобы подниматься, нужно не просто много играть,
                но играть в разных категориях и ставить рекорды.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {levelConfigs.map((level) => (
                  <div
                    key={level.level}
                    className={`bg-black rounded-xl p-3 text-center ${
                      level.level === 1
                        ? "border border-green-500"
                        : level.level === levelConfigs.length
                          ? "border border-yellow-500"
                          : "border border-white"
                    }`}
                  >
                    <div className="text-lg text-white">
                      <img
                        src="/icon_3.jpg"
                        alt="Уровень"
                        className="w-10 inline -mt-2"
                      />{" "}
                      {level.level}
                    </div>
                    <div className="text-md text-gray-400">{level.title}</div>
                    {level.level > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {level.requiredScore}+ очков
                        {level.requiredRecord > 0 &&
                          `, рекорд ${level.requiredRecord}+`}
                        {level.requiredCategories > 0 &&
                          `, ${level.requiredCategories} кат.`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Раунды */}
            <section>
              <h2 className="text-xl md:text-2xl text-yellow-300 mb-3">
                Форматы раундов
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rounds.slice(0, 6).map((round) => (
                  <div
                    key={round.id}
                    className="bg-white/5 rounded-xl p-3 flex items-start gap-3"
                  >
                    <div className="text-2xl shrink-0">
                      {round.type === "randomFragment"}
                      {round.type === "coverOnly"}
                      {round.type === "noTitle"}
                      {round.type === "intro"}
                      {round.type === "outro"}
                      {round.type === "guessExecutor"}
                      {round.type === "guessCover"}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {round.description}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {round.timeLimit} сек · {round.points} очков
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-100 text-sm mt-3">
                ...всего {totalRounds} раундов с разными условиями и наградами!
              </p>
            </section>

            {/* Категории */}
            <section>
              <h2 className="text-xl md:text-2xl text-yellow-300 mb-3">
                Категории
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 12).map((cat) => (
                  <span
                    key={cat.id}
                    className="bg-white/10 rounded-full px-3 py-1 text-sm text-gray-300"
                  >
                    <img
                      className="w-5 inline"
                      src={"img/" + cat.icon}
                      alt=""
                    />{" "}
                    {cat.name}
                  </span>
                ))}
                {categories.length > 12 && (
                  <span className="bg-white/10 rounded-full px-3 py-1 text-sm text-gray-400">
                    +{categories.length - 12} еще
                  </span>
                )}
              </div>
              <p className="text-gray-100 text-sm mt-3">
                {totalCategories} категорий с разным уровнем сложности. Но и это
                не всё. В некоторых невозможно ответить на все вопросы. Даже мы
                не можем, слишком много музыки...
              </p>
            </section>

            {/* Контакты */}
            <section className="border-t border-white/10 pt-6 mt-6">
              <p className="text-center text-gray-400">
                По вопросам и предложениям пишите на e-mail:{" "}
                <a
                  href="mailto:mail@mail.ru"
                  className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
                >
                  mail@mail.ru
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
