export const AGE_GROUPS = [
  { id: '0-2', label: '0–2 years', emoji: '👶', color: '#FFB3BA' },
  { id: '3-5', label: '3–5 years', emoji: '🧒', color: '#FFDFBA' },
  { id: '6-8', label: '6–8 years', emoji: '👦', color: '#FFFFBA' },
  { id: '9-11', label: '9–11 years', emoji: '🧑', color: '#BAFFC9' },
  { id: '12-14', label: '12–14 years', emoji: '👧', color: '#BAE1FF' },
  { id: '15-17', label: '15–17 years', emoji: '🧑‍🎓', color: '#D4BAFF' },
];

export const PERSONALITY_TYPES = {
  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    emoji: '🔭',
    color: '#FF6B35',
    description: 'Curious, energetic, loves trying new things',
    traits: ['Creative', 'Curious', 'Energetic', 'Adventurous'],
  },
  caretaker: {
    id: 'caretaker',
    name: 'The Caretaker',
    emoji: '💝',
    color: '#FF69B4',
    description: 'Caring, empathetic, loves helping others',
    traits: ['Empathetic', 'Caring', 'Patient', 'Cooperative'],
  },
  leader: {
    id: 'leader',
    name: 'The Leader',
    emoji: '👑',
    color: '#FFD700',
    description: 'Confident, decisive, likes to take charge and lead',
    traits: ['Confident', 'Decisive', 'Proactive', 'Responsible'],
  },
  dreamer: {
    id: 'dreamer',
    name: 'The Dreamer',
    emoji: '🌙',
    color: '#9B59B6',
    description: 'Imaginative, sensitive, deep, and artistic',
    traits: ['Creative', 'Sensitive', 'Artistic', 'Thoughtful'],
  },
  analyst: {
    id: 'analyst',
    name: 'The Analyst',
    emoji: '🔬',
    color: '#3498DB',
    description: 'Logical, systematic, loves solving complex problems',
    traits: ['Logical', 'Persistent', 'Precise', 'Independent'],
  },
};

export const PERSONALITY_QUESTIONS_BY_AGE = {
  '0-2': [
    {
      id: 1,
      question: 'When your baby sees a new toy, how do they usually react?',
      options: [
        { text: 'Reaches for it immediately and starts exploring', type: 'explorer', score: 3 },
        { text: 'Watches from a distance, waits for an adult to introduce it', type: 'dreamer', score: 3 },
        { text: 'Shows it to someone else first', type: 'caretaker', score: 3 },
        { text: 'Picks it up, shakes it, and bangs it to figure it out', type: 'analyst', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'How does your baby react to strangers?',
      options: [
        { text: 'Smiles and moves toward them right away', type: 'leader', score: 3 },
        { text: 'Shy and clings tightly to mom', type: 'dreamer', score: 3 },
        { text: 'Observes for a long time before approaching', type: 'analyst', score: 3 },
        { text: 'Cries and shows fear', type: 'caretaker', score: 1 },
      ],
    },
    {
      id: 3,
      question: 'When your baby wants something, they usually?',
      options: [
        { text: 'Points, makes loud sounds, and persists until they get it', type: 'leader', score: 3 },
        { text: 'Looks into mom\'s eyes and makes soft sounds', type: 'caretaker', score: 3 },
        { text: 'Tries to get there themselves', type: 'explorer', score: 3 },
        { text: 'Watches and waits', type: 'analyst', score: 3 },
      ],
    },
  ],
  '3-5': [
    {
      id: 1,
      question: 'When playing with friends, your child usually?',
      options: [
        { text: 'Suggests the game and assigns roles to others', type: 'leader', score: 3 },
        { text: 'Happily plays whatever a friend suggests', type: 'caretaker', score: 3 },
        { text: 'Invents new ways to play using objects nearby', type: 'explorer', score: 3 },
        { text: 'Prefers to play alone or imagine their own story', type: 'dreamer', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'How does your child handle a tantrum?',
      options: [
        { text: 'Cries loudly and needs to be held', type: 'caretaker', score: 2 },
        { text: 'Has a meltdown, rolls on the floor, or hits things', type: 'leader', score: 1 },
        { text: 'Retreats to their own corner to calm down', type: 'dreamer', score: 3 },
        { text: 'Tries to explain why they are angry', type: 'analyst', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'When facing a hard puzzle or problem, your child usually?',
      options: [
        { text: 'Tries many different ways until they solve it', type: 'explorer', score: 3 },
        { text: 'Asks an adult for help right away', type: 'caretaker', score: 2 },
        { text: 'Thinks it through patiently on their own', type: 'analyst', score: 3 },
        { text: 'Imagines a story about the problem', type: 'dreamer', score: 3 },
      ],
    },
  ],
  '6-8': [
    {
      id: 1,
      question: 'During recess at school, your child most likes to?',
      options: [
        { text: 'Play sports or active games with friends', type: 'leader', score: 3 },
        { text: 'Draw or make up their own story', type: 'dreamer', score: 3 },
        { text: 'Take care of a friend who fell or is feeling sad', type: 'caretaker', score: 3 },
        { text: 'Explore, collect insects, or pick up rocks', type: 'explorer', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'Your child learns best when they?',
      options: [
        { text: 'Are told the reason why they need to learn something', type: 'analyst', score: 3 },
        { text: 'Get to practice and experiment hands-on', type: 'explorer', score: 3 },
        { text: 'Can learn with friends', type: 'caretaker', score: 3 },
        { text: 'Can learn at their own pace', type: 'dreamer', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'When doing a group project at school, your child usually takes the role of?',
      options: [
        { text: 'The organizer who divides up the tasks', type: 'leader', score: 3 },
        { text: 'The one who proposes creative ideas', type: 'explorer', score: 3 },
        { text: 'The one who resolves conflicts within the group', type: 'caretaker', score: 3 },
        { text: 'The one who carefully carries out their assigned task', type: 'analyst', score: 3 },
      ],
    },
  ],
  '9-11': [
    {
      id: 1,
      question: 'When your child has to do something they think is unfair, they?',
      options: [
        { text: 'Speak up immediately to object', type: 'leader', score: 3 },
        { text: 'Find a way for everyone to reach an agreement', type: 'caretaker', score: 3 },
        { text: 'Analyze whether it is truly unfair', type: 'analyst', score: 3 },
        { text: 'Feel angry but keep it inside', type: 'dreamer', score: 2 },
      ],
    },
    {
      id: 2,
      question: 'After school, your child usually wants to?',
      options: [
        { text: 'Play sports or do outdoor activities', type: 'explorer', score: 3 },
        { text: 'Read, draw, or do something alone', type: 'dreamer', score: 3 },
        { text: 'See friends or call someone to chat', type: 'caretaker', score: 3 },
        { text: 'Do homework right away to get it done', type: 'analyst', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'Your child usually resolves a conflict with a friend by?',
      options: [
        { text: 'Speaking honestly to work it out', type: 'leader', score: 3 },
        { text: 'Giving in to preserve the friendship', type: 'caretaker', score: 3 },
        { text: 'Avoiding the situation until they calm down', type: 'dreamer', score: 2 },
        { text: 'Analyzing clearly who is right and who is wrong', type: 'analyst', score: 3 },
      ],
    },
  ],
  '12-14': [
    {
      id: 1,
      question: 'When making an important decision, your child usually?',
      options: [
        { text: 'Decides quickly based on instinct', type: 'leader', score: 3 },
        { text: 'Thinks for a long time and worries about every possibility', type: 'dreamer', score: 2 },
        { text: 'Gathers information and analyzes carefully', type: 'analyst', score: 3 },
        { text: 'Asks friends and family for their opinions', type: 'caretaker', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'How does your child feel about sudden plan changes?',
      options: [
        { text: 'Adapts quickly and sees it as a new opportunity', type: 'explorer', score: 3 },
        { text: 'Needs time to adjust', type: 'dreamer', score: 2 },
        { text: 'Feels frustrated if not given an explanation', type: 'analyst', score: 3 },
        { text: 'As long as everyone else is okay, they are okay', type: 'caretaker', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'Your child\'s biggest interest is?',
      options: [
        { text: 'Sports, adventure, and new experiences', type: 'explorer', score: 3 },
        { text: 'Art, music, or writing', type: 'dreamer', score: 3 },
        { text: 'Volunteering and helping the community', type: 'caretaker', score: 3 },
        { text: 'Technology, science, or solving puzzles', type: 'analyst', score: 3 },
      ],
    },
  ],
  '15-17': [
    {
      id: 1,
      question: 'How does your child envision their future?',
      options: [
        { text: 'Leading an organization or running their own business', type: 'leader', score: 3 },
        { text: 'A creative career — art, design, or writing', type: 'dreamer', score: 3 },
        { text: 'Working in a field that helps others', type: 'caretaker', score: 3 },
        { text: 'Research in science or technology', type: 'analyst', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'When under academic pressure, your child usually?',
      options: [
        { text: 'Makes a concrete plan and follows it strictly', type: 'analyst', score: 3 },
        { text: 'Finds a more creative or fun way to study', type: 'explorer', score: 3 },
        { text: 'Studies in a group with friends', type: 'caretaker', score: 3 },
        { text: 'Needs a quiet space to focus', type: 'dreamer', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'What does your child care about most in life?',
      options: [
        { text: 'Achieving success and being recognized', type: 'leader', score: 3 },
        { text: 'Understanding the deeper meaning of life', type: 'dreamer', score: 3 },
        { text: 'Having a happy family and good friends', type: 'caretaker', score: 3 },
        { text: 'Solving the world\'s complex problems', type: 'analyst', score: 3 },
      ],
    },
  ],
};

export const PERSONALITY_ADVICE_BY_AGE = {
  '0-2': {
    explorer: {
      tips: [
        'Create a safe environment for your baby to explore freely',
        'Provide a variety of toys that stimulate the senses',
        'Let your baby experience nature and diverse environments',
      ],
      activities: ['Sand & water play', 'Outdoor walks', 'Sound exploration boxes'],
    },
    caretaker: {
      tips: [
        'Respond positively to your baby\'s emotional expressions',
        'Introduce your baby to other babies or pets',
        'Read books with characters who show care and kindness',
      ],
      activities: ['Dolls & stuffed animals', 'Imitation games', 'Picture books about emotions'],
    },
    leader: {
      tips: [
        'Give your baby opportunities to "lead" in simple activities',
        'Ask for their opinion on small choices',
        'Encourage clear communication',
      ],
      activities: ['Choose their own toy', 'Rhythm music games', 'Small group play'],
    },
    dreamer: {
      tips: [
        'Read picture books together every day',
        'Give your baby quiet space to observe',
        'Accept that your baby needs time to adjust to new things',
      ],
      activities: ['Picture books', 'Soft music', 'Watching the sky & nature'],
    },
    analyst: {
      tips: [
        'Introduce objects with simple mechanisms',
        'Ask "why" and "how" questions',
        'Be patient and let your baby explore on their own',
      ],
      activities: ['Shape sorters', 'Simple mechanical toys', 'Watching small experiments'],
    },
  },
  '3-5': {
    explorer: {
      tips: [
        'Enroll in sports or arts enrichment classes',
        'Organize field trips and nature exploration outings',
        'Encourage your child to ask questions about everything',
      ],
      activities: ['Hiking/camping', 'Simple science experiments', 'Growing plants/caring for pets'],
    },
    caretaker: {
      tips: [
        'Teach your child to identify and name emotions',
        'Praise when they help a sibling or friend',
        'Read books about friendship and caring',
      ],
      activities: ['Role-play games', 'Caring for small plants or pets', 'Making gifts for loved ones'],
    },
    leader: {
      tips: [
        'Give your child chances to make decisions within safe boundaries',
        'Teach them to listen to others\' opinions',
        'Praise them when they lead with respect',
      ],
      activities: ['Group games', 'Creative storytelling', 'Team sports'],
    },
    dreamer: {
      tips: [
        'Create a dedicated creative corner with art supplies',
        'Respect your child\'s personal space',
        'Encourage them to tell you about their imaginary world',
      ],
      activities: ['Drawing & coloring', 'Watching animated films', 'Bedtime storytelling'],
    },
    analyst: {
      tips: [
        'Introduce science books designed for children',
        'Answer "why" questions patiently and thoroughly',
        'Give your child time to complete games or puzzles',
      ],
      activities: ['LEGO building', 'Math games', 'Simple science experiments'],
    },
  },
};
