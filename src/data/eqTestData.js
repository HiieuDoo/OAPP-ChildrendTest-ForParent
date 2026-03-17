export const EQ_DIMENSIONS = {
  selfAwareness: {
    id: 'selfAwareness',
    name: 'Tự Nhận Thức',
    emoji: '🪞',
    color: '#6C63FF',
    description: 'Khả năng nhận biết và hiểu cảm xúc của bản thân',
  },
  selfRegulation: {
    id: 'selfRegulation',
    name: 'Tự Điều Chỉnh',
    emoji: '⚖️',
    color: '#FF6B6B',
    description: 'Khả năng kiểm soát cảm xúc và hành vi',
  },
  empathy: {
    id: 'empathy',
    name: 'Đồng Cảm',
    emoji: '💝',
    color: '#FF69B4',
    description: 'Khả năng hiểu và chia sẻ cảm xúc với người khác',
  },
  socialSkills: {
    id: 'socialSkills',
    name: 'Kỹ Năng Xã Hội',
    emoji: '🤝',
    color: '#4ECDC4',
    description: 'Khả năng giao tiếp và xây dựng mối quan hệ',
  },
  motivation: {
    id: 'motivation',
    name: 'Động Lực Nội Tại',
    emoji: '🚀',
    color: '#FFD700',
    description: 'Khả năng tự thúc đẩy bản thân và duy trì nỗ lực',
  },
};

export const EQ_QUESTIONS = [
  // Tự Nhận Thức
  {
    id: 1,
    dimension: 'selfAwareness',
    question: 'Khi con cảm thấy buồn hoặc tức giận, con có biết tại sao không?',
    options: [
      { text: 'Luôn luôn biết và có thể giải thích rõ ràng', score: 4 },
      { text: 'Thường biết nhưng đôi khi khó giải thích', score: 3 },
      { text: 'Đôi khi biết, đôi khi không', score: 2 },
      { text: 'Hiếm khi biết tại sao con cảm thấy vậy', score: 1 },
    ],
  },
  {
    id: 2,
    dimension: 'selfAwareness',
    question: 'Con nhận ra khi nào mình đang căng thẳng hoặc lo lắng như thế nào?',
    options: [
      { text: 'Nhận ra ngay qua cơ thể (tim đập nhanh, bụng khó chịu)', score: 4 },
      { text: 'Nhận ra khi ai đó hỏi hoặc chú ý', score: 3 },
      { text: 'Thỉnh thoảng nhận ra sau đó', score: 2 },
      { text: 'Thường không nhận ra', score: 1 },
    ],
  },
  {
    id: 3,
    dimension: 'selfAwareness',
    question: 'Con có thể mô tả điểm mạnh và điểm yếu của mình không?',
    options: [
      { text: 'Có thể mô tả chi tiết cả hai', score: 4 },
      { text: 'Biết điểm mạnh rõ hơn điểm yếu', score: 3 },
      { text: 'Chỉ biết chung chung', score: 2 },
      { text: 'Khó nhận ra điểm mạnh/yếu của bản thân', score: 1 },
    ],
  },
  // Tự Điều Chỉnh
  {
    id: 4,
    dimension: 'selfRegulation',
    question: 'Khi tức giận, con thường làm gì?',
    options: [
      { text: 'Dừng lại, hít thở và suy nghĩ trước khi phản ứng', score: 4 },
      { text: 'Đi ra chỗ khác để bình tĩnh rồi quay lại', score: 3 },
      { text: 'Đôi khi kiểm soát được, đôi khi không', score: 2 },
      { text: 'Thường phản ứng ngay khi tức (khóc, la hét, đập phá)', score: 1 },
    ],
  },
  {
    id: 5,
    dimension: 'selfRegulation',
    question: 'Khi muốn điều gì đó ngay lập tức nhưng phải chờ, con xử lý thế nào?',
    options: [
      { text: 'Kiên nhẫn chờ và tự tìm cách giải trí', score: 4 },
      { text: 'Chờ được nhưng khó chịu', score: 3 },
      { text: 'Nhắc đi nhắc lại cho đến khi được', score: 2 },
      { text: 'Khó chấp nhận việc chờ đợi', score: 1 },
    ],
  },
  {
    id: 6,
    dimension: 'selfRegulation',
    question: 'Khi mắc lỗi, con phản ứng như thế nào?',
    options: [
      { text: 'Nhận lỗi, học từ sai lầm và tiếp tục', score: 4 },
      { text: 'Buồn một lúc rồi cố gắng làm tốt hơn', score: 3 },
      { text: 'Thường đổ lỗi cho hoàn cảnh hoặc người khác', score: 2 },
      { text: 'Rất khó chịu với bản thân, tự phê bình quá mức', score: 1 },
    ],
  },
  // Đồng Cảm
  {
    id: 7,
    dimension: 'empathy',
    question: 'Khi bạn bè buồn, con thường làm gì?',
    options: [
      { text: 'Ngồi cạnh, lắng nghe và hỏi bạn cần gì', score: 4 },
      { text: 'Cố gắng làm bạn vui bằng trò chuyện', score: 3 },
      { text: 'Nhận ra bạn buồn nhưng không biết làm gì', score: 2 },
      { text: 'Thường không để ý đến cảm xúc của người khác', score: 1 },
    ],
  },
  {
    id: 8,
    dimension: 'empathy',
    question: 'Con có thể đoán được cảm xúc của người khác qua nét mặt/cử chỉ không?',
    options: [
      { text: 'Rất dễ nhận ra, ngay cả khi người đó cố giấu', score: 4 },
      { text: 'Thường đoán đúng với người quen', score: 3 },
      { text: 'Thỉnh thoảng đúng, thỉnh thoảng sai', score: 2 },
      { text: 'Khó nhận ra cảm xúc qua biểu hiện bên ngoài', score: 1 },
    ],
  },
  {
    id: 9,
    dimension: 'empathy',
    question: 'Khi xem phim hoặc đọc sách, con có cảm thấy cùng cảm xúc với nhân vật không?',
    options: [
      { text: 'Thường xuyên - có thể khóc hoặc vui mừng cùng nhân vật', score: 4 },
      { text: 'Đôi khi, với những câu chuyện cảm động', score: 3 },
      { text: 'Hiếm khi bị ảnh hưởng cảm xúc bởi nhân vật', score: 2 },
      { text: 'Hầu như không', score: 1 },
    ],
  },
  // Kỹ Năng Xã Hội
  {
    id: 10,
    dimension: 'socialSkills',
    question: 'Con làm quen với bạn mới như thế nào?',
    options: [
      { text: 'Tự nhiên tiếp cận, bắt chuyện và kết bạn dễ dàng', score: 4 },
      { text: 'Cần một ít thời gian nhưng kết bạn được', score: 3 },
      { text: 'Chờ người khác tiếp cận trước', score: 2 },
      { text: 'Rất khó kết bạn mới, hay lo lắng về điều này', score: 1 },
    ],
  },
  {
    id: 11,
    dimension: 'socialSkills',
    question: 'Khi có mâu thuẫn với bạn bè, con xử lý thế nào?',
    options: [
      { text: 'Nói chuyện thẳng thắn, tìm giải pháp đôi bên đều hài lòng', score: 4 },
      { text: 'Cố gắng thỏa hiệp dù đôi khi nhường nhiều', score: 3 },
      { text: 'Tránh né mâu thuẫn, đôi khi để dành trong lòng', score: 2 },
      { text: 'Thường không biết xử lý, nhờ người lớn can thiệp', score: 1 },
    ],
  },
  {
    id: 12,
    dimension: 'socialSkills',
    question: 'Khi cần từ chối yêu cầu của bạn bè, con làm thế nào?',
    options: [
      { text: 'Từ chối rõ ràng nhưng tử tế, giải thích lý do', score: 4 },
      { text: 'Từ chối nhưng hay cảm thấy tội lỗi', score: 3 },
      { text: 'Khó từ chối, thường đồng ý dù không muốn', score: 2 },
      { text: 'Nói không một cách trực tiếp mà không suy nghĩ đến cảm xúc người kia', score: 1 },
    ],
  },
  // Động Lực Nội Tại
  {
    id: 13,
    dimension: 'motivation',
    question: 'Con học/làm việc vì lý do nào chính yếu?',
    options: [
      { text: 'Vì thấy thú vị và muốn phát triển bản thân', score: 4 },
      { text: 'Cả vì sở thích lẫn được khen thưởng', score: 3 },
      { text: 'Chủ yếu để được điểm tốt hoặc phần thưởng', score: 2 },
      { text: 'Vì bị bắt buộc phải làm', score: 1 },
    ],
  },
  {
    id: 14,
    dimension: 'motivation',
    question: 'Khi gặp khó khăn trong việc học hoặc hoạt động, con thường?',
    options: [
      { text: 'Xem như thử thách và kiên trì tìm cách vượt qua', score: 4 },
      { text: 'Cố gắng thêm một lúc rồi mới nhờ giúp đỡ', score: 3 },
      { text: 'Nhanh chóng nản lòng và bỏ cuộc', score: 2 },
      { text: 'Tránh né các thứ khó khăn từ đầu', score: 1 },
    ],
  },
  {
    id: 15,
    dimension: 'motivation',
    question: 'Con đặt mục tiêu cho bản thân như thế nào?',
    options: [
      { text: 'Tự đặt mục tiêu cụ thể và theo dõi tiến độ', score: 4 },
      { text: 'Có mục tiêu chung chung và cố gắng đạt', score: 3 },
      { text: 'Chỉ làm theo chỉ dẫn của người lớn', score: 2 },
      { text: 'Không thường đặt mục tiêu', score: 1 },
    ],
  },
];

export const EQ_LEVELS = [
  { min: 0, max: 25, level: 'Cần Phát Triển', color: '#FF6B6B', emoji: '🌱' },
  { min: 26, max: 35, level: 'Đang Phát Triển', color: '#FFB347', emoji: '🌿' },
  { min: 36, max: 45, level: 'Tốt', color: '#4ECDC4', emoji: '🌳' },
  { min: 46, max: 60, level: 'Xuất Sắc', color: '#6C63FF', emoji: '⭐' },
];

export const EQ_ADVICE = {
  selfAwareness: {
    low: [
      'Thực hành nhật ký cảm xúc hàng ngày cùng con',
      'Đặt câu hỏi "Con đang cảm thấy thế nào?" sau các sự kiện',
      'Dạy con các từ để mô tả cảm xúc',
    ],
    high: [
      'Khuyến khích con chia sẻ cảm xúc với người khác',
      'Sử dụng khả năng tự nhận thức để giúp con đưa ra quyết định tốt hơn',
    ],
  },
  selfRegulation: {
    low: [
      'Dạy kỹ thuật hít thở sâu khi tức giận',
      'Tạo "góc bình tĩnh" tại nhà',
      'Thực hành trì hoãn sự hài lòng qua trò chơi',
    ],
    high: [
      'Tiếp tục mô hình hóa sự tự kiểm soát',
      'Dạy con áp dụng kỹ năng này trong tình huống áp lực cao hơn',
    ],
  },
  empathy: {
    low: [
      'Đọc sách có nhân vật đa dạng cảm xúc',
      'Chơi trò nhập vai tình huống xã hội',
      'Thảo luận về cảm xúc nhân vật trong phim',
    ],
    high: [
      'Hướng con vào các hoạt động tình nguyện',
      'Dạy cân bằng giữa đồng cảm và ranh giới cá nhân',
    ],
  },
  socialSkills: {
    low: [
      'Tổ chức playdates có cấu trúc với số lượng nhỏ',
      'Nhập vai các tình huống xã hội tại nhà',
      'Tham gia câu lạc bộ hoặc hoạt động nhóm',
    ],
    high: [
      'Khuyến khích vai trò lãnh đạo trong nhóm',
      'Dạy con giúp bạn bè nhút nhát hòa nhập',
    ],
  },
  motivation: {
    low: [
      'Kết nối việc học với sở thích của con',
      'Chia nhỏ mục tiêu lớn thành các bước nhỏ',
      'Tập trung khen ngợi nỗ lực hơn kết quả',
    ],
    high: [
      'Giới thiệu các thử thách mới và phức tạp hơn',
      'Dạy con chia sẻ đam mê để truyền cảm hứng cho người khác',
    ],
  },
};
