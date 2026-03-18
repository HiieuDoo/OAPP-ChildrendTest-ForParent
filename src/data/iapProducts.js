// Credit packages - $0.20 USD = 1 credit
export const CREDIT_PACKAGES = [
  {
    id: 'crd_01_00',
    credits: 1,
    priceUSD: '$0.20',
    label: '1 Credit',
    icon: '💎',
    color: '#9CA3AF',
    badge: null,
  },
  {
    id: 'crd_05_00',
    credits: 5,
    priceUSD: '$0.99',
    label: '5 Credits',
    icon: '💎',
    color: '#4ECDC4',
    badge: null,
  },
  {
    id: 'crd_10_00',
    credits: 10,
    priceUSD: '$1.99',
    label: '10 Credits',
    icon: '💎',
    color: '#6C63FF',
    badge: null,
  },
  {
    id: 'crd_25_00',
    credits: 25,
    priceUSD: '$4.99',
    label: '25 Credits',
    icon: '💎',
    color: '#FF6B35',
    badge: 'POPULAR',
  },
  {
    id: 'crd_50_00',
    credits: 50,
    priceUSD: '$9.99',
    label: '50 Credits',
    icon: '💎',
    color: '#6C63FF',
    badge: 'BEST VALUE',
  },
];

// Credit cost to unlock each feature
export const CREDIT_COSTS = {
  PARENTING_RESULT: 1,    // 1 credit to view parenting style result
  PERSONALITY_RESULT: 1,  // 1 credit to view child personality result
  EQ_RESULT: 1,           // 1 credit to view EQ result
  FAMILY_REPORT: 2,       // 2 credits to view family report
  EXPORT_PDF: 0.5,        // 0.5 credit to export PDF
};
