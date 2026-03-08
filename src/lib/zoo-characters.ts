export type ZooCharacter = {
  id: string;
  name: string;
  emoji: string;
  image: string;
  accent: string;
  tagline: string;
};

export const ZOO_CHARACTERS: ZooCharacter[] = [
  {
    id: 'turtle',
    name: 'Tilly the Turtle',
    emoji: '🐢',
    image: '/images/classroom-zoo/turtle.png',
    accent: '#22c55e',
    tagline: 'Tilly chose {student} today!',
  },
  {
    id: 'lion',
    name: 'Leo the Lion',
    emoji: '🦁',
    image: '/images/classroom-zoo/lion.png',
    accent: '#f59e0b',
    tagline: 'Leo roared and picked {student}!',
  },
  {
    id: 'bee',
    name: 'Bibi the Bee',
    emoji: '🐝',
    image: '/images/classroom-zoo/bee.png',
    accent: '#eab308',
    tagline: 'Bibi buzzed over to {student}!',
  },
  {
    id: 'owl',
    name: 'Olive the Owl',
    emoji: '🦉',
    image: '/images/classroom-zoo/owl.png',
    accent: '#a78bfa',
    tagline: 'Olive spotted {student} first!',
  },
  {
    id: 'frog',
    name: 'Freddy the Frog',
    emoji: '🐸',
    image: '/images/classroom-zoo/frog.png',
    accent: '#10b981',
    tagline: 'Freddy hopped over to {student}!',
  },
  {
    id: 'elephant',
    name: 'Ellie the Elephant',
    emoji: '🐘',
    image: '/images/classroom-zoo/elephant.png',
    accent: '#38bdf8',
    tagline: 'Ellie trumpeted for {student}!',
  },
  {
    id: 'giraffe',
    name: 'Gigi the Giraffe',
    emoji: '🦒',
    image: '/images/classroom-zoo/giraffe.png',
    accent: '#f97316',
    tagline: 'Gigi reached high and picked {student}!',
  },
  {
    id: 'penguin',
    name: 'Penny the Penguin',
    emoji: '🐧',
    image: '/images/classroom-zoo/penguin.png',
    accent: '#06b6d4',
    tagline: 'Penny waddled over to {student}!',
  },
  {
    id: 'bunny',
    name: 'Benny the Bunny',
    emoji: '🐰',
    image: '/images/classroom-zoo/bunny.png',
    accent: '#ec4899',
    tagline: 'Benny bounced to {student}!',
  },
  {
    id: 'bear',
    name: 'Bruno the Bear',
    emoji: '🐻',
    image: '/images/classroom-zoo/bear.png',
    accent: '#f43f5e',
    tagline: 'Bruno gave a big cheer for {student}!',
  },
];

export const ZOO_CHARACTER_NAMES = ZOO_CHARACTERS.map(character => character.name);
