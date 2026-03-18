// Credit packages - IAP only sells credits
export const CREDIT_PACKAGES = [
  {
    id: 'crd_00_20',
    credits: 0.2,
    price: '4.900đ',
    priceUSD: '$0.25',
    label: '0.2 Credit',
    icon: '💎',
    color: '#9CA3AF',
    badge: null,
  },
  {
    id: 'crd_00_50',
    credits: 0.5,
    price: '9.900đ',
    priceUSD: '$0.49',
    label: '0.5 Credit',
    icon: '💎',
    color: '#6B7280',
    badge: null,
  },
  {
    id: 'crd_01_00',
    credits: 1,
    price: '19.900đ',
    priceUSD: '$0.99',
    label: '1 Credit',
    icon: '💎',
    color: '#4ECDC4',
    badge: null,
  },
  {
    id: 'crd_02_00',
    credits: 2,
    price: '39.000đ',
    priceUSD: '$1.99',
    label: '2 Credits',
    icon: '💎',
    color: '#6C63FF',
    badge: null,
  },
  {
    id: 'crd_04_00',
    credits: 4,
    price: '75.000đ',
    priceUSD: '$3.99',
    label: '4 Credits',
    icon: '💎',
    color: '#FF6B35',
    badge: 'PHỔ BIẾN',
  },
  {
    id: 'crd_05_00',
    credits: 5,
    price: '90.000đ',
    priceUSD: '$4.99',
    label: '5 Credits',
    icon: '💎',
    color: '#FF6B6B',
    badge: null,
  },
  {
    id: 'crd_06_00',
    credits: 6,
    price: '109.000đ',
    priceUSD: '$5.99',
    label: '6 Credits',
    icon: '💎',
    color: '#6BCB77',
    badge: null,
  },
  {
    id: 'crd_08_00',
    credits: 8,
    price: '139.000đ',
    priceUSD: '$6.99',
    label: '8 Credits',
    icon: '💎',
    color: '#FFB347',
    badge: null,
  },
  {
    id: 'crd_10_00',
    credits: 10,
    price: '169.000đ',
    priceUSD: '$8.99',
    label: '10 Credits',
    icon: '💎',
    color: '#6C63FF',
    badge: 'GIÁ TỐT NHẤT',
  },
];

// Credit cost to unlock each feature
export const CREDIT_COSTS = {
  PARENTING_RESULT: 1,    // 1 credit để xem kết quả phong cách nuôi dạy
  PERSONALITY_RESULT: 1,  // 1 credit để xem kết quả tính cách con
  EQ_RESULT: 1,           // 1 credit để xem kết quả EQ
  FAMILY_REPORT: 2,       // 2 credits để xem báo cáo gia đình (tốn nhiều hơn)
  EXPORT_PDF: 0.5,        // 0.5 credit để xuất PDF
};
