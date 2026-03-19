export const PARENTING_STYLES = {
  authoritative: {
    id: 'authoritative',
    name: 'Authoritative',
    nameEn: 'Authoritative',
    color: '#6C63FF',
    emoji: '🌟',
    description:
      'You set clear but flexible rules, listen to your child, and explain your reasoning. You are both warm and disciplined.',
    strengths: [
      'Child develops self-confidence and independence',
      'Good social skills',
      'More effective learning',
      'Fewer psychological issues',
    ],
    improvements: [
      'Ensure consistency when enforcing rules',
      'Avoid excessive negotiation',
    ],
    advice: [
      'Keep maintaining the balance between warmth and discipline',
      'Join your child in learning activities',
      'Encourage your child to ask questions and think critically',
    ],
  },
  authoritarian: {
    id: 'authoritarian',
    name: 'Authoritarian',
    nameEn: 'Authoritarian',
    color: '#FF6B6B',
    emoji: '⚡',
    description:
      'You have high expectations and strict rules. Obedience and discipline are the top priority.',
    strengths: [
      'Child has good discipline',
      'Understands boundaries and rules clearly',
      'Has structure and organization in life',
    ],
    improvements: [
      'Listen more to your child\'s emotions and opinions',
      'Explain the reasons behind rules',
      'Create space for your child to express themselves',
    ],
    advice: [
      'Practice active listening every day',
      'Add fun elements to family activities',
      'Praise effort more than results',
    ],
  },
  permissive: {
    id: 'permissive',
    name: 'Permissive',
    nameEn: 'Permissive',
    color: '#FFB347',
    emoji: '🌈',
    description:
      'You are very warm and nurturing, with few limits set. You want your child to be happy and free.',
    strengths: [
      'Child feels loved and accepted',
      'Creative and free in expression',
      'Close relationship with parents',
    ],
    improvements: [
      'Establish more consistent limits and rules',
      'Learn to say "no" with love',
      'Help your child develop self-control',
    ],
    advice: [
      'Start with a few simple and consistent rules',
      'Explain the consequences of behavior',
      'Praise your child when they respect boundaries',
    ],
  },
  uninvolved: {
    id: 'uninvolved',
    name: 'Uninvolved',
    nameEn: 'Uninvolved',
    color: '#A8A8A8',
    emoji: '🔄',
    description:
      'You provide your child\'s basic needs but are less engaged emotionally and in guidance.',
    strengths: ['Child may develop independence', 'Problem-solving skills'],
    improvements: [
      'Spend more quality time with your child',
      'Pay attention to your child\'s emotions and experiences',
      'Participate in your child\'s learning and play activities',
    ],
    advice: [
      'Set a regular schedule for time with your child',
      'Ask about your child\'s day every evening',
      'Attend important events in your child\'s life',
    ],
  },
};

export const PARENTING_QUESTIONS = [
  {
    id: 1,
    question: 'When your child refuses to eat vegetables, what do you usually do?',
    options: [
      {
        text: 'Explain why vegetables are good and ask them to try a small bite',
        style: 'authoritative',
        score: 3,
      },
      { text: 'Make them finish the vegetables before leaving the table', style: 'authoritarian', score: 3 },
      { text: 'Make something else because you do not want them to be unhappy', style: 'permissive', score: 3 },
      {
        text: 'Do not intervene — let them decide whether to eat or not',
        style: 'uninvolved',
        score: 3,
      },
    ],
  },
  {
    id: 2,
    question: 'Your child comes home with a bad test score. Your first reaction is?',
    options: [
      {
        text: 'Ask what happened and find a way to improve together',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Strictly criticize and require extra study immediately',
        style: 'authoritarian',
        score: 3,
      },
      {
        text: 'Comfort them and say grades do not matter as long as they are happy',
        style: 'permissive',
        score: 3,
      },
      { text: 'Glance at it and set it aside, you are busy', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 3,
    question: 'Your child wants to join a new extracurricular activity. You would?',
    options: [
      {
        text: 'Discuss the benefits, cost, and time commitment, then support their decision',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Decide which activity is best for their future yourself',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Sign them up right away because you want them to experience everything', style: 'permissive', score: 3 },
      { text: 'Let them handle it themselves — you do not have time to follow up', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 4,
    question: 'Your child has an argument with a friend. How do you usually handle it?',
    options: [
      {
        text: 'Listen to your child\'s side, help them understand their feelings and find a solution',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Tell them the correct behavior and order an apology if needed',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Take your child\'s side completely and might confront the other parent', style: 'permissive', score: 3 },
      { text: 'Encourage them to sort it out themselves — it is a kids\' thing', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 5,
    question: 'What are the screen time rules in your home?',
    options: [
      {
        text: 'Clear limits but flexible, discussed and agreed upon with the child',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Strict regulations: specific hours, specific types of allowed content',
        style: 'authoritarian',
        score: 3,
      },
      {
        text: 'Not many limits as long as it does not affect their health',
        style: 'permissive',
        score: 3,
      },
      { text: 'No specific rules — they can use screens as much as they want', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 6,
    question: 'When your child makes a serious mistake, what discipline do you usually use?',
    options: [
      {
        text: 'Talk about consequences, help fix the problem together, and learn from it',
        style: 'authoritative',
        score: 3,
      },
      { text: 'Punish immediately with clear and firm consequences', style: 'authoritarian', score: 3 },
      {
        text: 'Rarely punish — mainly give a gentle reminder and forgive easily',
        style: 'permissive',
        score: 3,
      },
      { text: 'Usually overlook it or do not pay much attention', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 7,
    question: 'How much quality time do you spend with your child each day?',
    options: [
      {
        text: 'At least 1–2 hours fully focused on them with meaningful activities',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Time dedicated to studying and developing specific skills',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'As much as possible — whatever they want to do, we do together', style: 'permissive', score: 3 },
      { text: 'Less than 30 minutes or irregular due to a busy schedule', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 8,
    question: 'Your child wants to do something different from what you want. You usually?',
    options: [
      {
        text: 'Listen to their reasons, compromise when reasonable, explain when you disagree',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Stand firm with your own decision because you know what is best',
        style: 'authoritarian',
        score: 3,
      },
      {
        text: 'Usually agree with them because you want them to be happy',
        style: 'permissive',
        score: 3,
      },
      { text: 'Let them decide — you do not want to argue', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 9,
    question: 'How do you usually praise your child?',
    options: [
      {
        text: 'Specifically about effort and process: "You worked so hard on this!"',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'When they achieve a good result: "Great job! Excellent score!"',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Frequently and for everything they do', style: 'permissive', score: 3 },
      { text: 'Rarely, or only when they do something truly outstanding', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 10,
    question: 'When your child has a difficult problem at school, you usually?',
    options: [
      {
        text: 'Guide them on how to solve it but let them do it, ready to help when needed',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Closely supervise and make sure they solve it the right way',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Solve it for them so they do not have to worry', style: 'permissive', score: 3 },
      { text: 'Let them handle it — it is a learning opportunity', style: 'uninvolved', score: 3 },
    ],
  },
];
