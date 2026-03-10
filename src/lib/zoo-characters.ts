export type ZooCharacter = {
  id: string;
  name: string;
  emoji: string;
  image: string;
  accent: string;
  tagline: string;
  personalityLine: string;
  greenCheer: string;
  starCheer: string;
};

export const ZOO_CHARACTERS: ZooCharacter[] = [
  {
    id: 'turtle',
    name: 'Tilly the Turtle',
    emoji: '🐢',
    image: '/images/classroom-zoo/turtle.png',
    accent: '#22c55e',
    tagline: 'Tilly chose {student} today!',
    personalityLine: 'Slow breath, brave choice, then shine.',
    greenCheer: '🐢 Tilly says {student} is calm, steady, and green-zone ready!',
    starCheer: '⭐ Tilly awards {student} for calm choices all day long!',
  },
  {
    id: 'lion',
    name: 'Leo the Lion',
    emoji: '🦁',
    image: '/images/classroom-zoo/lion.png',
    accent: '#f59e0b',
    tagline: 'Leo roared and picked {student}!',
    personalityLine: 'Use a kind roar: brave voice, gentle hands.',
    greenCheer: '🦁 Leo cheers: {student} showed brave focus and returned to Green Zone!',
    starCheer: '⭐ Leo crowns {student} for courageous classroom choices!',
  },
  {
    id: 'bee',
    name: 'Bibi the Bee',
    emoji: '🐝',
    image: '/images/classroom-zoo/bee.png',
    accent: '#eab308',
    tagline: 'Bibi buzzed over to {student}!',
    personalityLine: 'Buzz-buzz helper mode: tiny steps count.',
    greenCheer: '🐝 Bibi buzzes: {student} found the helper path back to green!',
    starCheer: '⭐ Bibi gives {student} a honey-gold Star Day badge!',
  },
  {
    id: 'owl',
    name: 'Olive the Owl',
    emoji: '🦉',
    image: '/images/classroom-zoo/owl.png',
    accent: '#a78bfa',
    tagline: 'Olive spotted {student} first!',
    personalityLine: 'Wise eyes, quiet wings, thoughtful choices.',
    greenCheer: '🦉 Olive noticed {student} making wise moves back to Green Zone!',
    starCheer: '⭐ Olive names {student} a Wise Choice Star Day leader!',
  },
  {
    id: 'frog',
    name: 'Freddy the Frog',
    emoji: '🐸',
    image: '/images/classroom-zoo/frog.png',
    accent: '#10b981',
    tagline: 'Freddy hopped over to {student}!',
    personalityLine: 'Hop, pause, reset, then leap into learning.',
    greenCheer: '🐸 Freddy hops with joy: {student} leaped right back into green!',
    starCheer: '⭐ Freddy gives {student} a giant lily-pad Star Day cheer!',
  },
  {
    id: 'elephant',
    name: 'Ellie the Elephant',
    emoji: '🐘',
    image: '/images/classroom-zoo/elephant.png',
    accent: '#38bdf8',
    tagline: 'Ellie trumpeted for {student}!',
    personalityLine: 'Big heart, big listening ears, big kindness.',
    greenCheer: '🐘 Ellie trumpets: {student} listened, reset, and rejoined Green Zone!',
    starCheer: '⭐ Ellie celebrates {student} for kind leadership today!',
  },
  {
    id: 'giraffe',
    name: 'Gigi the Giraffe',
    emoji: '🦒',
    image: '/images/classroom-zoo/giraffe.png',
    accent: '#f97316',
    tagline: 'Gigi reached high and picked {student}!',
    personalityLine: 'Reach high with choices that help everyone.',
    greenCheer: '🦒 Gigi says {student} stretched into super choices and hit green!',
    starCheer: '⭐ Gigi awards {student} for high-reaching behavior goals!',
  },
  {
    id: 'penguin',
    name: 'Penny the Penguin',
    emoji: '🐧',
    image: '/images/classroom-zoo/penguin.png',
    accent: '#06b6d4',
    tagline: 'Penny waddled over to {student}!',
    personalityLine: 'Waddle together: teamwork beats wobble days.',
    greenCheer: '🐧 Penny waddles proud: {student} is back in Green Zone with the team!',
    starCheer: '⭐ Penny gives {student} a cool-and-kind Star Day shoutout!',
  },
  {
    id: 'bunny',
    name: 'Benny the Bunny',
    emoji: '🐰',
    image: '/images/classroom-zoo/bunny.png',
    accent: '#ec4899',
    tagline: 'Benny bounced to {student}!',
    personalityLine: 'Bounce back fast with kind words and hands.',
    greenCheer: '🐰 Benny bounces: {student} hopped right back to Green Zone!',
    starCheer: '⭐ Benny picks {student} for extra-kind Star Day energy!',
  },
  {
    id: 'bear',
    name: 'Bruno the Bear',
    emoji: '🐻',
    image: '/images/classroom-zoo/bear.png',
    accent: '#f43f5e',
    tagline: 'Bruno gave a big cheer for {student}!',
    personalityLine: 'Strong body, soft voice, safe choices.',
    greenCheer: '🐻 Bruno cheers loud: {student} made strong safe choices back in green!',
    starCheer: '⭐ Bruno gives {student} a big bear-hug Star Day victory!',
  },
];

export const ZOO_CHARACTER_NAMES = ZOO_CHARACTERS.map(character => character.name);
