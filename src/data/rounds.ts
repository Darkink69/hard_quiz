export interface Round {
  id: number;
  name: string;
  timeLimit: number;
  points: number;
  description: string;
  type:
    | "randomFragment"
    | "coverOnly"
    | "noTitle"
    | "intro"
    | "outro"
    | "guessExecutor"
    | "guessCover";
  showCover?: boolean;
  hideTrackTitle?: boolean;
  useIntro?: boolean;
  useOutro?: boolean;
  showTitleOnly?: boolean;
  showCoverOptions?: boolean;
}

export const rounds: Round[] = [
  {
    id: 1,
    name: "Первый раунд",
    timeLimit: 20,
    points: 20,
    description: "Угадайте песню по случайному отрывку за 20 секунд!",
    type: "randomFragment",
  },
  {
    id: 2,
    name: "Второй раунд",
    timeLimit: 10,
    points: 70,
    description: "Угадайте песню только по обложке за 10 секунд!",
    type: "coverOnly",
    showCover: true,
    hideTrackTitle: false,
  },
  {
    id: 10,
    name: "Третий раунд",
    timeLimit: 15,
    points: 50,
    description: "Угадайте песню по случайному отрывку за 15 секунд!",
    type: "randomFragment",
  },
  {
    id: 3,
    name: "Четвертый раунд",
    timeLimit: 10,
    points: 80,
    description: "Угадайте трек по случайному отрывку за 10 секунд!",
    type: "randomFragment",
  },
  {
    id: 4,
    name: "Пятый раунд",
    timeLimit: 15,
    points: 100,
    description: "Угадайте кому принадлежит эта песня за 15 секунд!",
    type: "guessExecutor",
    showTitleOnly: true,
  },
  {
    id: 5,
    name: "Шестой раунд",
    timeLimit: 15,
    points: 100,
    description:
      "Названия песен скрыты! Угадайте группу по случайному отрывку за 15 секунд.",
    type: "noTitle",
    hideTrackTitle: true,
  },
  {
    id: 6,
    name: "Седьмой раунд",
    timeLimit: 15,
    points: 100,
    description: "Угадайте обложку песни за 15 секунд!",
    type: "guessCover",
    showCoverOptions: true,
  },
  {
    id: 7,
    name: "Восьмой раунд",
    timeLimit: 10,
    points: 120,
    description: "Угадайте композицию по одному только вступлению!",
    type: "intro",
    useIntro: true,
  },
  {
    id: 9,
    name: "Девятый раунд",
    timeLimit: 15,
    points: 150,
    description: "Угадайте песню только по финалу!",
    type: "outro",
    useOutro: true,
  },
  {
    id: 8,
    name: "Десятый раунд",
    timeLimit: 5,
    points: 200,
    description:
      "Супер сложный раунд! Угадайте песню по случайному отрывку за 5 секунд!",
    type: "randomFragment",
  },
];
