export type OutfitMode = 'classic' | 'special' | 'winter';

export type ZooCharacter = {
  id: string;
  name: string;
  emoji: string;
  image: string;
  accent: string;
  title: string;
  tagline: string;
  personalityLine: string;
  motto: string;
  backstory: string;
  storyline: string;
  traits: [string, string, string];
  accessories: string[];
  outfits: Record<OutfitMode, string>;
  greenCheer: string;
  starCheer: string;
};

export const ZOO_CHARACTERS: ZooCharacter[] = [
  {
    id: 'turtle',
    name: 'Tilly the Turtle',
    emoji: '🐢',
    image: '/characters/turtle-classic.png',
    accent: '#22c55e',
    title: 'The Steady Starter',
    tagline: 'Tilly chose {student} today!',
    personalityLine: 'Slow breath, brave choice, then shine.',
    motto: 'Slow body, strong brain, kind heart.',
    backstory:
      'Tilly carries a tiny backpack full of calm-down tools. She takes her time so everyone remembers it is okay to pause before trying again.',
    storyline:
      'Tilly forgot her words during circle time, so she used turtle breaths and asked for a do-over. Now she teaches friends that calm is a superpower.',
    traits: ['Steady', 'Patient', 'Encouraging'],
    accessories: ['Tiny green backpack', 'Breathing bubble wand', 'Sticker chart pencil'],
    outfits: {
      classic: 'Mint shell scarf + mini backpack',
      special: 'Birthday sash + confetti shell clip',
      winter: 'Cozy knitted beanie + snow boots',
    },
    greenCheer: '🐢 Tilly says {student} is calm, steady, and green-zone ready!',
    starCheer: '⭐ Tilly awards {student} for calm choices all day long!',
  },
  {
    id: 'lion',
    name: 'Leo the Lion',
    emoji: '🦁',
    image: '/characters/lion-classic.png',
    accent: '#f59e0b',
    title: 'The Brave Leader',
    tagline: 'Leo roared and picked {student}!',
    personalityLine: 'Use a kind roar: brave voice, gentle hands.',
    motto: 'Be brave and be kind at the same time.',
    backstory:
      'Leo wears a gold star sticker in his mane because he loves cheering for classmates who try again. He leads line-up with confidence and calm hands.',
    storyline:
      'Leo once roared too loudly and startled his team. He learned to use a soft roar voice to lead safely and still feel brave.',
    traits: ['Confident', 'Protective', 'Loyal'],
    accessories: ['Gold star mane sticker', 'Whistle lanyard', 'Captain wristband'],
    outfits: {
      classic: 'Gold star sticker + coach lanyard',
      special: 'Parade cape + glitter crown',
      winter: 'Fuzzy lion mane earmuffs + red scarf',
    },
    greenCheer: '🦁 Leo cheers: {student} showed brave focus and returned to Green Zone!',
    starCheer: '⭐ Leo crowns {student} for courageous classroom choices!',
  },
  {
    id: 'bee',
    name: 'Bibi the Bee',
    emoji: '🐝',
    image: '/characters/bee-classic.png',
    accent: '#eab308',
    title: 'The Helpful Builder',
    tagline: 'Bibi buzzed over to {student}!',
    personalityLine: 'Buzz-buzz helper mode: tiny steps count.',
    motto: 'Share a little, help a lot.',
    backstory:
      'Bibi zips around with a honey-tool belt packed with sticky-note reminders. She is always first to ask, “Who needs help?”',
    storyline:
      'Bibi felt nervous sharing her honey jars at snack. After trying one small share, she discovered friends got sweeter when she shared too.',
    traits: ['Helpful', 'Curious', 'Busy'],
    accessories: ['Honey-tool belt', 'Tiny goggles', 'Map of helper jobs'],
    outfits: {
      classic: 'Honey belt + yellow helper goggles',
      special: 'Party wings with sparkle dots',
      winter: 'Striped puffer vest + warm mittens',
    },
    greenCheer: '🐝 Bibi buzzes: {student} found the helper path back to green!',
    starCheer: '⭐ Bibi gives {student} a honey-gold Star Day badge!',
  },
  {
    id: 'owl',
    name: 'Olive the Owl',
    emoji: '🦉',
    image: '/characters/owl-classic.png',
    accent: '#a78bfa',
    title: 'The Wise Problem Solver',
    tagline: 'Olive spotted {student} first!',
    personalityLine: 'Wise eyes, quiet wings, thoughtful choices.',
    motto: 'Think first, then soar.',
    backstory:
      'Olive keeps a tiny moon notebook where she writes “smart choices of the day.” She loves helping classmates find words for big feelings.',
    storyline:
      'Olive once rushed through a puzzle and got frustrated. She learned that pausing, thinking, and asking for clues helps her soar higher.',
    traits: ['Thoughtful', 'Observant', 'Calm'],
    accessories: ['Moon notebook', 'Purple reading glasses', 'Feather bookmark'],
    outfits: {
      classic: 'Moon notebook + reading glasses',
      special: 'Storytime cape + silver bow tie',
      winter: 'Lavender scarf + cozy wing warmers',
    },
    greenCheer: '🦉 Olive noticed {student} making wise moves back to Green Zone!',
    starCheer: '⭐ Olive names {student} a Wise Choice Star Day leader!',
  },
  {
    id: 'frog',
    name: 'Freddy the Frog',
    emoji: '🐸',
    image: '/characters/frog-classic.png',
    accent: '#10b981',
    title: 'The Bounce-Back Buddy',
    tagline: 'Freddy hopped over to {student}!',
    personalityLine: 'Hop, pause, reset, then leap into learning.',
    motto: 'Oops can become onward.',
    backstory:
      'Freddy carries a lily-pad timer and loves reset breaks. He makes mistakes on purpose in games just to show classmates how to try again.',
    storyline:
      'Freddy knocked over block towers during cleanup. He practiced “hop, help, reset” and now leads the fastest cleanup challenge.',
    traits: ['Playful', 'Resilient', 'Optimistic'],
    accessories: ['Lily-pad timer', 'Rainbow sneakers', 'Reset checklist card'],
    outfits: {
      classic: 'Lily timer + rainbow sneakers',
      special: 'Super-frog cape + star sneakers',
      winter: 'Splash-proof raincoat + booties',
    },
    greenCheer: '🐸 Freddy hops with joy: {student} leaped right back into green!',
    starCheer: '⭐ Freddy gives {student} a giant lily-pad Star Day cheer!',
  },
  {
    id: 'elephant',
    name: 'Ellie the Elephant',
    emoji: '🐘',
    image: '/characters/elephant-classic.png',
    accent: '#38bdf8',
    title: 'The Big-Heart Listener',
    tagline: 'Ellie trumpeted for {student}!',
    personalityLine: 'Big heart, big listening ears, big kindness.',
    motto: 'Listen big, care bigger.',
    backstory:
      'Ellie wears bright blue listening headphones to remind everyone about whole-body listening. She remembers everyone’s favorite things.',
    storyline:
      'Ellie interrupted during story time because she was excited. She learned a quiet hand signal and became the class listening captain.',
    traits: ['Kind', 'Attentive', 'Gentle'],
    accessories: ['Listening headphones', 'Blue kindness backpack', 'Trunk friendship bracelet'],
    outfits: {
      classic: 'Blue headphones + kindness backpack',
      special: 'Celebration bow + shiny sneakers',
      winter: 'Puffy vest + polka-dot scarf',
    },
    greenCheer: '🐘 Ellie trumpets: {student} listened, reset, and rejoined Green Zone!',
    starCheer: '⭐ Ellie celebrates {student} for kind leadership today!',
  },
  {
    id: 'giraffe',
    name: 'Gigi the Giraffe',
    emoji: '🦒',
    image: '/characters/giraffe-classic.png',
    accent: '#f97316',
    title: 'The Goal Reacher',
    tagline: 'Gigi reached high and picked {student}!',
    personalityLine: 'Reach high with choices that help everyone.',
    motto: 'Stretch for your best.',
    backstory:
      'Gigi wears a measuring tape sash to track classroom goals. She loves celebrating tiny progress with giant high-fives.',
    storyline:
      'Gigi felt disappointed when she could not zip her coat. She kept stretching and practicing, then taught friends the “try high” strategy.',
    traits: ['Driven', 'Cheerful', 'Motivating'],
    accessories: ['Goal-tracker sash', 'High-five glove', 'Goal sticker pouch'],
    outfits: {
      classic: 'Goal sash + sticker pouch',
      special: 'Confetti tutu + sparkly boots',
      winter: 'Long striped scarf + warm earmuffs',
    },
    greenCheer: '🦒 Gigi says {student} stretched into super choices and hit green!',
    starCheer: '⭐ Gigi awards {student} for high-reaching behavior goals!',
  },
  {
    id: 'penguin',
    name: 'Penny the Penguin',
    emoji: '🐧',
    image: '/characters/penguin-classic.png',
    accent: '#06b6d4',
    title: 'The Teamwork Captain',
    tagline: 'Penny waddled over to {student}!',
    personalityLine: 'Waddle together: teamwork beats wobble days.',
    motto: 'Together is our superpower.',
    backstory:
      'Penny keeps a friendship map and loves partner jobs. She wears tiny skates that remind everyone teamwork makes movement smooth.',
    storyline:
      'Penny tried to carry all the art supplies alone and dropped them. She asked for a partner and discovered team jobs are faster and happier.',
    traits: ['Friendly', 'Cooperative', 'Reliable'],
    accessories: ['Friendship map', 'Mini skates', 'Team captain badge'],
    outfits: {
      classic: 'Captain badge + mini skates',
      special: 'Dance bow tie + celebration skates',
      winter: 'Snowflake beanie + striped scarf',
    },
    greenCheer: '🐧 Penny waddles proud: {student} is back in Green Zone with the team!',
    starCheer: '⭐ Penny gives {student} a cool-and-kind Star Day shoutout!',
  },
  {
    id: 'bunny',
    name: 'Benny the Bunny',
    emoji: '🐰',
    image: '/characters/bunny-classic.png',
    accent: '#ec4899',
    title: 'The Kind Voice Coach',
    tagline: 'Benny bounced to {student}!',
    personalityLine: 'Bounce back fast with kind words and hands.',
    motto: 'Kind words jump far.',
    backstory:
      'Benny keeps a pink phrasebook of kind words and loves making classmates laugh kindly. His bow tie changes color with his mood.',
    storyline:
      'Benny blurted a rude comment during a game. He practiced “pause, choose kind words” and became the class kindness announcer.',
    traits: ['Kind', 'Energetic', 'Funny'],
    accessories: ['Color-shift bow tie', 'Kind-words phrasebook', 'Carrot-shaped pencil'],
    outfits: {
      classic: 'Pink bow tie + phrasebook satchel',
      special: 'Magic-show vest + glitter wand',
      winter: 'Pom-pom hat + bunny slippers',
    },
    greenCheer: '🐰 Benny bounces: {student} hopped right back to Green Zone!',
    starCheer: '⭐ Benny picks {student} for extra-kind Star Day energy!',
  },
  {
    id: 'bear',
    name: 'Bruno the Bear',
    emoji: '🐻',
    image: '/characters/bear-classic.png',
    accent: '#f43f5e',
    title: 'The Safe-Choice Champion',
    tagline: 'Bruno gave a big cheer for {student}!',
    personalityLine: 'Strong body, soft voice, safe choices.',
    motto: 'Strong can still be gentle.',
    backstory:
      'Bruno carries a safety badge and a tiny first-aid pouch for classroom pretend play. He models calm strength when things get loud.',
    storyline:
      'Bruno used to rush in line and bump friends. He learned “slow paws, safe space” and now helps classmates walk safely together.',
    traits: ['Protective', 'Calm', 'Responsible'],
    accessories: ['Safety badge', 'First-aid mini pouch', 'Red coach wristband'],
    outfits: {
      classic: 'Safety badge + coach wristband',
      special: 'Hero cape + medal ribbon',
      winter: 'Plaid jacket + warm boots',
    },
    greenCheer: '🐻 Bruno cheers loud: {student} made strong safe choices back in green!',
    starCheer: '⭐ Bruno gives {student} a big bear-hug Star Day victory!',
  },
];

export const ZOO_CHARACTER_NAMES = ZOO_CHARACTERS.map(character => character.name);
