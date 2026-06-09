export interface Round {
  id: number;
  name: string;
  timeLimit: number;
  points: number;
  description: string;
  type: "randomFragment" | "coverOnly" | "noTitle" | "intro" | "outro";
  showCover?: boolean;
  hideTrackTitle?: boolean;
  useIntro?: boolean;
  useOutro?: boolean;
}

export const rounds: Round[] = [
  {
    id: 1,
    name: "Первый раунд",
    timeLimit: 20,
    points: 50,
    description: "Угадайте песню по случайному отрывку за 20 секунд!",
    type: "randomFragment",
  },
  {
    id: 2,
    name: "Второй раунд",
    timeLimit: 15,
    points: 100,
    description: "Угадайте песню по случайному отрывку за 15 секунд!",
    type: "randomFragment",
  },
  {
    id: 3,
    name: "Третий раунд",
    timeLimit: 10,
    points: 200,
    description: "Угадайте песню по случайному отрывку за 10 секунд!",
    type: "randomFragment",
  },
  {
    id: 4,
    name: "Четвертый раунд",
    timeLimit: 15,
    points: 300,
    description: "Угадайте песню только по обложке за 15 секунд!",
    type: "coverOnly",
    showCover: true,
    hideTrackTitle: false,
  },
  {
    id: 5,
    name: "Пятый раунд",
    timeLimit: 15,
    points: 300,
    description:
      "Угадайте песню по случайному отрывку за 15 секунд не видя названия!",
    type: "noTitle",
    hideTrackTitle: true,
  },
  {
    id: 6,
    name: "Шестой раунд",
    timeLimit: 10,
    points: 400,
    description: "Угадай песню по одному только вступлению!",
    type: "intro",
    useIntro: true,
  },
  {
    id: 7,
    name: "Седьмой раунд",
    timeLimit: 20,
    points: 400,
    description: "Угадайте песню только по финалу!",
    type: "outro",
    useOutro: true,
  },
];
