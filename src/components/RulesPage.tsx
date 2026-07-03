import React from "react";
// import { rounds } from "../data/rounds";

interface RulesPageProps {
  onClose: () => void;
}

const RulesPage: React.FC<RulesPageProps> = ({ onClose }) => {
  // Подсчет общей статистики
  //   const totalRounds = rounds.length;
  //   const totalPoints = rounds.reduce((sum, r) => sum + r.points, 0);
  //   const avgTime = Math.round(
  //     rounds.reduce((sum, r) => sum + r.timeLimit, 0) / totalRounds,
  //   );

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 overflow-y-auto ibm">
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
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl text-center mb-2">
            Правила игры
          </h1>
          <p className="text-center text-purple-200 text-lg mb-8">
            Как играть и побеждать в Музыкальном Квизе
          </p>

          <div className="space-y-6">
            {/* Основное правило */}
            <section className="bg-white/5 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-30">
                  <img src="/img/kids2.png" alt="" />
                </div>
                <div>
                  <h2 className="text-lg text-yellow-300 mb-2">
                    Главное правило
                  </h2>
                  <p className="text-gray-200 leading-relaxed">
                    В каждом раунде вам предлагается{" "}
                    <span className="text-purple-300">4 варианта ответа</span>.
                    Ваша задача — выбрать правильный. Только один вариант
                    является верным. Будьте внимательны и не торопитесь, но
                    помните про время! Если вы не успели - очень жаль. Но на то
                    он и квиз, чтобы делать всё быстро.
                  </p>
                </div>
              </div>
            </section>

            {/* Время и скорость */}
            <section className="bg-white/5 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-24">
                  <img src="/img/kids2.png" alt="" />
                </div>
                <div>
                  <h2 className="text-lg text-yellow-300 mb-2">
                    Время и скорость
                  </h2>
                  <p className="text-gray-200 leading-relaxed">
                    В каждом раунде у вас есть ограниченное время — от{" "}
                    <span className="text-purple-300">5 до 20 секунд</span>.
                    Эрудиция, внимательность и скорость реакции — ваши главные
                    союзники. Если вы не успеваете угадать за отведённое время,
                    вы теряете очки и собственное уважение :-/
                  </p>
                </div>
              </div>
            </section>

            {/* Как угадывать */}
            <section className="bg-white/5 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-30">
                  <img src="/img/kids2.png" alt="" />
                </div>
                <div>
                  <h2 className="text-lg text-yellow-300 mb-2">
                    Как угадывать?
                  </h2>
                  <ul className="space-y-3 text-gray-100">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-300 mt-1">•</span>
                      <span>
                        <span className="text-white ">
                          Слушайте внимательно:
                        </span>{" "}
                        В большинстве раундов трек включается в случайном месте.
                        Вам может не повезти, если попадётся неинформативный
                        фрагмент без слов. Но в другой раз может включиться
                        самый яркий и узнаваемый момент песни! Есть маленькая
                        хитрость - слушайте фрагмент как можно дольше. Возможно
                        вы услышите в тексте песни ее название или какой-то
                        намек.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-300 mt-1">•</span>
                      <span>
                        <span className="text-white "></span> Знание музыки и
                        конкретной категории сильно повышает шансы на успех.
                        Потому все категории и поделены на сложности. Однако
                        даже в сложной и незнакомой внимательный игрок сможет
                        заработать очки. Это не говоря уже о чистом везении.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-300 mt-1">•</span>
                      <span>
                        Внимательно рассматривая обложки треков, можно
                        почерпнуть много полезной информации. Название
                        композиции или имя исполнителя не всегда хорошо видны.
                        Более того - иногда играющий трек - сингл и про него
                        вообще ничего нет на обложке. Это не считается ошибкой
                        раунда. В следующий раз вам повезет больше и название
                        будет крупно по центру...
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-300 mt-1">•</span>
                      <span>
                        <span className="text-white ">
                          Исключайте неверные варианты:
                        </span>{" "}
                        Угадывать «от обратного» - вполне рабочий метод.
                        Исключите варианты, которые явно не подходят.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Очки и штрафы */}
            <section className="bg-white/5 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10">
                  <img src="/img/kids2.png" alt="" />
                </div>
                <div>
                  <h2 className="text-lg text-yellow-300 mb-2">
                    Очки и штрафы
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                      <div className="text-green-400 text-sm">
                        За правильный ответ
                      </div>
                      <div className="text-white text-lg ">+ очки</div>
                      <div className="text-gray-200 text-xs mt-1">
                        Сумма зависит от сложности раунда (х2, х3)
                      </div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                      <div className="text-red-400 font-bold text-sm">
                        За неправильный ответ или просрочку
                      </div>
                      <div className="text-red-400 text-lg">− 10% штрафа</div>
                      <div className="text-gray-200 text-xs mt-1">
                        От стоимости раунда
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-100 mt-3">
                    Чтобы азартнее было играть и отличать по сложности каждый
                    раунд - начисляются очки. За неправильные ответы - небольшой
                    штраф. Потому что жизнь-боль :/
                  </p>
                </div>
              </div>
            </section>

            {/* Категории и разнообразие */}
            <section className="bg-white/5 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-24">
                  <img src="/img/kids2.png" alt="" />
                </div>
                <div>
                  <h2 className="text-lg text-yellow-300 mb-2">
                    Категории и зачем они нужны?
                  </h2>
                  <p className="text-gray-100 leading-relaxed">
                    Да потому что не все, например, любят шансон! Но некоторые
                    обожают. В каждой категории содержится множество треков, из
                    которых случайным образом формируются конкретные раунды. Это
                    значит, что каждый раз игра уникальна! Вы можете проходить
                    одну категорию снова и снова — каждый раз будут новые
                    вопросы.
                  </p>
                </div>
              </div>
            </section>

            {/* Уровни и рекорды */}
            <section className="bg-white/5 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-24">
                  <img src="/img/kids2.png" alt="" />
                </div>
                <div>
                  <h2 className="text-lg text-yellow-300 mb-2">
                    Уровни и рекорды
                  </h2>
                  <p className="text-gray-100 leading-relaxed">
                    Чем больше вы играете, тем выше ваш уровень. Для повышения
                    уровня нужно набирать очки, устанавливать рекорды и
                    проходить разные категории. Помните, что невозможно
                    установить большой рекорд играя только в легкие категории.
                    Так же нельзя многого добиться, если не вылазить из
                    советских мультиков :/
                  </p>
                </div>
              </div>
            </section>
            {/* Хитрости */}
            <section className="bg-white/5 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12">
                  <img src="/img/kids2.png" alt="" />
                </div>
                <div>
                  <h2 className="text-lg text-yellow-300 mb-2">
                    У меня все равно не получается!
                  </h2>
                  <p className="text-gray-100 leading-relaxed">
                    Конечно есть маленькие хитрости! Можно угадать правильный
                    вариант, даже если вы ничего не знаете.<br></br>- Слушайте
                    дольше, пока таймер не истек совсем. Есть шанс, что
                    прозвучит название песни. Но именно поэтому есть раунд, где
                    названия песен скрыты! <br></br>- Если песня на русском, а 3
                    варианта ответов англоязычные - тут сложно ошибиться!
                    <br></br>- Подобное бывает и с обложками. Поет женский
                    голос, а на трех обложках синглов мужики одни. Есть большой
                    шанс, что это точно не они!
                    <br></br>- Часто бывает, что звучит вроде бы что-то
                    знакомое. Вы совсем не уверены - но жмите на вариант, где и
                    название что-то напоминает. По статистике - это и есть
                    правильный ответ.
                    <span className="text-purple-300 block mt-2 text-sm">
                      А еще можно использовать Shaz... Шучу! Вы ведь тут не для
                      этого!
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Заключение */}
            <section className="bg-purple-500/20  rounded-xl p-5 border border-purple-500/20">
              <div className="text-center">
                <p className="text-lg text-white">Готовы?</p>
                <p className="text-purple-200 text-sm mt-1">
                  Выбирайте категорию, слушайте, анализируйте и побеждайте!
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
