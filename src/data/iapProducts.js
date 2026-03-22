// Credit packages — $0.10 USD per credit
export const CREDIT_PACKAGES = [
  {
    id: 'crd_00_20',
    credits: 2,
    priceUSD: '$0.20',
    label: '2 Credits',
    icon: '💎',
    color: '#9CA3AF',
    badge: null,
  },
  {
    id: 'crd_00_50',
    credits: 5,
    priceUSD: '$0.50',
    label: '5 Credits',
    icon: '💎',
    color: '#4ECDC4',
    badge: null,
  },
  {
    id: 'crd_01_00',
    credits: 10,
    priceUSD: '$1.00',
    label: '10 Credits',
    icon: '💎',
    color: '#6C63FF',
    badge: null,
  },
  {
    id: 'crd_02_00',
    credits: 20,
    priceUSD: '$2.00',
    label: '20 Credits',
    icon: '💎',
    color: '#FF6B35',
    badge: null,
  },
  {
    id: 'crd_04_00',
    credits: 40,
    priceUSD: '$4.00',
    label: '40 Credits',
    icon: '💎',
    color: '#4ECDC4',
    badge: null,
  },
  {
    id: 'crd_05_00',
    credits: 50,
    priceUSD: '$5.00',
    label: '50 Credits',
    icon: '💎',
    color: '#6C63FF',
    badge: 'POPULAR',
  },
  {
    id: 'crd_06_00',
    credits: 60,
    priceUSD: '$6.00',
    label: '60 Credits',
    icon: '💎',
    color: '#FF6B35',
    badge: null,
  },
  {
    id: 'crd_08_00',
    credits: 80,
    priceUSD: '$8.00',
    label: '80 Credits',
    icon: '💎',
    color: '#FFD700',
    badge: null,
  },
  {
    id: 'crd_10_00',
    credits: 100,
    priceUSD: '$10.00',
    label: '100 Credits',
    icon: '💎',
    color: '#6C63FF',
    badge: 'BEST VALUE',
  },
];

// Credit cost to unlock each feature
export const CREDIT_COSTS = {
  PARENTING_RESULT: 5,    // 5 credits to view parenting style result
  PERSONALITY_RESULT: 5,  // 5 credits to view child personality result
  EQ_RESULT: 5,           // 5 credits to view EQ result
  FAMILY_REPORT: 10,      // 10 credits to view family report
  EXPORT_PDF: 3,          // 3 credits to export PDF
};
