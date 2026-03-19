export const EQ_DIMENSIONS = {
  selfAwareness: {
    id: 'selfAwareness',
    name: 'Self-Awareness',
    emoji: '🪞',
    color: '#6C63FF',
    description: 'Ability to recognize and understand your own emotions',
  },
  selfRegulation: {
    id: 'selfRegulation',
    name: 'Self-Regulation',
    emoji: '⚖️',
    color: '#FF6B6B',
    description: 'Ability to control emotions and behavior',
  },
  empathy: {
    id: 'empathy',
    name: 'Empathy',
    emoji: '💝',
    color: '#FF69B4',
    description: 'Ability to understand and share feelings with others',
  },
  socialSkills: {
    id: 'socialSkills',
    name: 'Social Skills',
    emoji: '🤝',
    color: '#4ECDC4',
    description: 'Ability to communicate and build relationships',
  },
  motivation: {
    id: 'motivation',
    name: 'Inner Motivation',
    emoji: '🚀',
    color: '#FFD700',
    description: 'Ability to motivate oneself and sustain effort',
  },
};

export const EQ_QUESTIONS = [
  // Self-Awareness
  {
    id: 1,
    dimension: 'selfAwareness',
    question: 'When your child feels sad or angry, do they know why?',
    options: [
      { text: 'Always — can explain clearly', score: 4 },
      { text: 'Usually, but sometimes hard to explain', score: 3 },
      { text: 'Sometimes yes, sometimes no', score: 2 },
      { text: 'Rarely knows why they feel that way', score: 1 },
    ],
  },
  {
    id: 2,
    dimension: 'selfAwareness',
    question: 'How does your child notice when they are stressed or anxious?',
    options: [
      { text: 'Immediately — through physical signs (fast heartbeat, upset stomach)', score: 4 },
      { text: 'Notices when someone asks or points it out', score: 3 },
      { text: 'Sometimes notices afterward', score: 2 },
      { text: 'Usually does not notice', score: 1 },
    ],
  },
  {
    id: 3,
    dimension: 'selfAwareness',
    question: 'Can your child describe their own strengths and weaknesses?',
    options: [
      { text: 'Can describe both in detail', score: 4 },
      { text: 'Knows strengths more clearly than weaknesses', score: 3 },
      { text: 'Only knows in general terms', score: 2 },
      { text: 'Hard to identify own strengths or weaknesses', score: 1 },
    ],
  },
  // Self-Regulation
  {
    id: 4,
    dimension: 'selfRegulation',
    question: 'When angry, what does your child usually do?',
    options: [
      { text: 'Stops, breathes, and thinks before reacting', score: 4 },
      { text: 'Steps away to calm down, then returns', score: 3 },
      { text: 'Sometimes in control, sometimes not', score: 2 },
      { text: 'Reacts immediately (crying, yelling, throwing things)', score: 1 },
    ],
  },
  {
    id: 5,
    dimension: 'selfRegulation',
    question: 'When your child wants something right away but has to wait, how do they handle it?',
    options: [
      { text: 'Waits patiently and finds their own way to stay busy', score: 4 },
      { text: 'Can wait but feels uncomfortable', score: 3 },
      { text: 'Keeps asking until they get it', score: 2 },
      { text: 'Has difficulty accepting waiting', score: 1 },
    ],
  },
  {
    id: 6,
    dimension: 'selfRegulation',
    question: 'When your child makes a mistake, how do they react?',
    options: [
      { text: 'Admits it, learns from it, and moves on', score: 4 },
      { text: 'Feels bad for a while, then tries to do better', score: 3 },
      { text: 'Often blames circumstances or others', score: 2 },
      { text: 'Becomes very hard on themselves, over-self-critical', score: 1 },
    ],
  },
  // Empathy
  {
    id: 7,
    dimension: 'empathy',
    question: 'When a friend is sad, what does your child usually do?',
    options: [
      { text: 'Sits with them, listens, and asks what they need', score: 4 },
      { text: 'Tries to cheer them up with conversation', score: 3 },
      { text: 'Notices the friend is sad but does not know what to do', score: 2 },
      { text: 'Usually does not pay attention to others\' feelings', score: 1 },
    ],
  },
  {
    id: 8,
    dimension: 'empathy',
    question: 'Can your child guess how others feel from their face or body language?',
    options: [
      { text: 'Very easily — even when someone tries to hide it', score: 4 },
      { text: 'Usually correct with people they know', score: 3 },
      { text: 'Sometimes right, sometimes wrong', score: 2 },
      { text: 'Hard to read emotions from outward signs', score: 1 },
    ],
  },
  {
    id: 9,
    dimension: 'empathy',
    question: 'When watching a movie or reading a book, does your child feel the same emotions as the characters?',
    options: [
      { text: 'Often — can cry or feel joy alongside the characters', score: 4 },
      { text: 'Sometimes, with especially moving stories', score: 3 },
      { text: 'Rarely affected emotionally by characters', score: 2 },
      { text: 'Almost never', score: 1 },
    ],
  },
  // Social Skills
  {
    id: 10,
    dimension: 'socialSkills',
    question: 'How does your child make new friends?',
    options: [
      { text: 'Approaches naturally, starts conversations, makes friends easily', score: 4 },
      { text: 'Takes a little time but can make friends', score: 3 },
      { text: 'Waits for others to approach first', score: 2 },
      { text: 'Very hard to make new friends, tends to worry about it', score: 1 },
    ],
  },
  {
    id: 11,
    dimension: 'socialSkills',
    question: 'When there is a conflict with friends, how does your child handle it?',
    options: [
      { text: 'Talks openly and finds a solution both sides are happy with', score: 4 },
      { text: 'Tries to compromise even if they give up more', score: 3 },
      { text: 'Avoids conflict and keeps feelings inside', score: 2 },
      { text: 'Usually does not know how to handle it, asks adults to step in', score: 1 },
    ],
  },
  {
    id: 12,
    dimension: 'socialSkills',
    question: 'When needing to say no to a friend\'s request, how does your child do it?',
    options: [
      { text: 'Declines clearly but kindly, with a reason', score: 4 },
      { text: 'Declines but often feels guilty', score: 3 },
      { text: 'Hard to say no, usually agrees even when they do not want to', score: 2 },
      { text: 'Says no directly without thinking about the other\'s feelings', score: 1 },
    ],
  },
  // Inner Motivation
  {
    id: 13,
    dimension: 'motivation',
    question: 'What is your child\'s main reason for studying or doing activities?',
    options: [
      { text: 'Because they find it interesting and want to grow', score: 4 },
      { text: 'Both for enjoyment and for praise or rewards', score: 3 },
      { text: 'Mainly for good grades or rewards', score: 2 },
      { text: 'Because they are required to', score: 1 },
    ],
  },
  {
    id: 14,
    dimension: 'motivation',
    question: 'When facing difficulty in studying or an activity, your child usually?',
    options: [
      { text: 'Sees it as a challenge and keeps trying to overcome it', score: 4 },
      { text: 'Tries a bit longer before asking for help', score: 3 },
      { text: 'Gets discouraged quickly and gives up', score: 2 },
      { text: 'Avoids hard things from the start', score: 1 },
    ],
  },
  {
    id: 15,
    dimension: 'motivation',
    question: 'How does your child set goals for themselves?',
    options: [
      { text: 'Sets specific goals and tracks their own progress', score: 4 },
      { text: 'Has general goals and tries to reach them', score: 3 },
      { text: 'Only follows instructions from adults', score: 2 },
      { text: 'Does not usually set goals', score: 1 },
    ],
  },
];

export const EQ_LEVELS = [
  { min: 0, max: 25, level: 'Needs Development', color: '#FF6B6B', emoji: '🌱' },
  { min: 26, max: 35, level: 'Developing', color: '#FFB347', emoji: '🌿' },
  { min: 36, max: 45, level: 'Good', color: '#4ECDC4', emoji: '🌳' },
  { min: 46, max: 60, level: 'Excellent', color: '#6C63FF', emoji: '⭐' },
];

export const EQ_ADVICE = {
  selfAwareness: {
    low: [
      'Practice an emotion journal together with your child each day',
      'Ask "How are you feeling?" after events throughout the day',
      'Teach your child words to describe different emotions',
    ],
    high: [
      'Encourage your child to share their feelings with others',
      'Use self-awareness to help your child make better decisions',
    ],
  },
  selfRegulation: {
    low: [
      'Teach deep breathing techniques when angry',
      'Create a "calm corner" at home',
      'Practice delaying gratification through games',
    ],
    high: [
      'Continue modeling self-control in daily life',
      'Teach your child to apply these skills under higher-pressure situations',
    ],
  },
  empathy: {
    low: [
      'Read books with diverse emotional characters',
      'Role-play social scenarios together',
      'Discuss how movie characters feel',
    ],
    high: [
      'Guide your child toward volunteer activities',
      'Teach the balance between empathy and personal boundaries',
    ],
  },
  socialSkills: {
    low: [
      'Organize structured playdates with small groups',
      'Role-play social situations at home',
      'Join clubs or group activities',
    ],
    high: [
      'Encourage leadership roles in groups',
      'Teach your child to help shy friends feel included',
    ],
  },
  motivation: {
    low: [
      'Connect learning to your child\'s interests',
      'Break big goals into smaller steps',
      'Praise effort more than results',
    ],
    high: [
      'Introduce new and more complex challenges',
      'Teach your child to share their passion to inspire others',
    ],
  },
};
