export const AGE_GROUPS = [
  { id: '0-2', label: '0-2 tuổi', emoji: '👶', color: '#FFB3BA' },
  { id: '3-5', label: '3-5 tuổi', emoji: '🧒', color: '#FFDFBA' },
  { id: '6-8', label: '6-8 tuổi', emoji: '👦', color: '#FFFFBA' },
  { id: '9-11', label: '9-11 tuổi', emoji: '🧑', color: '#BAFFC9' },
  { id: '12-14', label: '12-14 tuổi', emoji: '👧', color: '#BAE1FF' },
  { id: '15-17', label: '15-17 tuổi', emoji: '🧑‍🎓', color: '#D4BAFF' },
];

export const PERSONALITY_TYPES = {
  explorer: {
    id: 'explorer',
    name: 'Nhà Khám Phá',
    emoji: '🔭',
    color: '#FF6B35',
    description: 'Tò mò, năng động, thích thử nghiệm điều mới',
    traits: ['Sáng tạo', 'Tò mò', 'Năng động', 'Thích m冒険'],
  },
  caretaker: {
    id: 'caretaker',
    name: 'Người Chăm Sóc',
    emoji: '💝',
    color: '#FF69B4',
    description: 'Quan tâm, đồng cảm, thích giúp đỡ người khác',
    traits: ['Đồng cảm', 'Quan tâm', 'Kiên nhẫn', 'Hợp tác'],
  },
  leader: {
    id: 'leader',
    name: 'Nhà Lãnh Đạo',
    emoji: '👑',
    color: '#FFD700',
    description: 'Tự tin, quyết đoán, thích chủ động và dẫn dắt',
    traits: ['Tự tin', 'Quyết đoán', 'Chủ động', 'Trách nhiệm'],
  },
  dreamer: {
    id: 'dreamer',
    name: 'Người Mơ Mộng',
    emoji: '🌙',
    color: '#9B59B6',
    description: 'Giàu trí tưởng tượng, nhạy cảm, sâu sắc và nghệ thuật',
    traits: ['Sáng tạo', 'Nhạy cảm', 'Nghệ thuật', 'Sâu sắc'],
  },
  analyst: {
    id: 'analyst',
    name: 'Nhà Phân Tích',
    emoji: '🔬',
    color: '#3498DB',
    description: 'Logic, có hệ thống, thích giải quyết vấn đề phức tạp',
    traits: ['Logic', 'Kiên trì', 'Chính xác', 'Độc lập'],
  },
};

export const PERSONALITY_QUESTIONS_BY_AGE = {
  '0-2': [
    {
      id: 1,
      question: 'Khi thấy đồ chơi mới, bé thường phản ứng thế nào?',
      options: [
        { text: 'Ngay lập tức với tay lấy và khám phá', type: 'explorer', score: 3 },
        { text: 'Nhìn từ xa, chờ người lớn giới thiệu mới tiếp cận', type: 'dreamer', score: 3 },
        { text: 'Đưa cho người khác xem trước', type: 'caretaker', score: 3 },
        { text: 'Cầm lên, lắc, đập để tìm hiểu', type: 'analyst', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'Bé ứng xử thế nào với người lạ?',
      options: [
        { text: 'Cười và tiến lại gần ngay', type: 'leader', score: 3 },
        { text: 'Nhút nhát, bám chặt vào mẹ', type: 'dreamer', score: 3 },
        { text: 'Quan sát lâu rồi mới tiếp cận', type: 'analyst', score: 3 },
        { text: 'Khóc và sợ hãi', type: 'caretaker', score: 1 },
      ],
    },
    {
      id: 3,
      question: 'Khi bé muốn điều gì đó, bé thường?',
      options: [
        { text: 'Chỉ tay, kêu to và kiên trì cho đến khi được', type: 'leader', score: 3 },
        { text: 'Nhìn vào mắt mẹ và phát ra âm thanh nhỏ', type: 'caretaker', score: 3 },
        { text: 'Tự tìm cách đến lấy', type: 'explorer', score: 3 },
        { text: 'Quan sát và chờ đợi', type: 'analyst', score: 3 },
      ],
    },
  ],
  '3-5': [
    {
      id: 1,
      question: 'Trong lúc chơi với bạn bè, con thường?',
      options: [
        { text: 'Đề xuất trò chơi và phân vai cho các bạn', type: 'leader', score: 3 },
        { text: 'Vui vẻ chơi bất kỳ trò gì bạn đề nghị', type: 'caretaker', score: 3 },
        { text: 'Tạo ra cách chơi mới, sáng tạo từ đồ vật xung quanh', type: 'explorer', score: 3 },
        { text: 'Thích chơi một mình hoặc tưởng tượng câu chuyện riêng', type: 'dreamer', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'Con xử lý cơn giận dữ như thế nào?',
      options: [
        { text: 'Khóc to và cần được ôm ấp', type: 'caretaker', score: 2 },
        { text: 'Ăn vạ, nằm lăn hoặc đập đồ vật', type: 'leader', score: 1 },
        { text: 'Tự rút vào góc riêng để bình tĩnh', type: 'dreamer', score: 3 },
        { text: 'Cố giải thích tại sao con tức giận', type: 'analyst', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'Khi gặp bài toán/câu đố khó, con thường?',
      options: [
        { text: 'Thử nhiều cách khác nhau cho đến khi giải được', type: 'explorer', score: 3 },
        { text: 'Yêu cầu người lớn giúp đỡ ngay', type: 'caretaker', score: 2 },
        { text: 'Kiên trì suy nghĩ một mình', type: 'analyst', score: 3 },
        { text: 'Tưởng tượng câu chuyện về bài toán đó', type: 'dreamer', score: 3 },
      ],
    },
  ],
  '6-8': [
    {
      id: 1,
      question: 'Giờ ra chơi ở trường, con thích làm gì nhất?',
      options: [
        { text: 'Chơi thể thao hoặc vận động mạnh với bạn bè', type: 'leader', score: 3 },
        { text: 'Ngồi vẽ hoặc tưởng tượng truyện riêng', type: 'dreamer', score: 3 },
        { text: 'Chăm sóc bạn bị ngã hoặc buồn', type: 'caretaker', score: 3 },
        { text: 'Tìm hiểu, thu thập côn trùng hoặc đá sỏi', type: 'explorer', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'Con học tốt nhất khi nào?',
      options: [
        { text: 'Được giải thích lý do tại sao cần học điều đó', type: 'analyst', score: 3 },
        { text: 'Được làm thực hành và thử nghiệm', type: 'explorer', score: 3 },
        { text: 'Được học cùng bạn bè', type: 'caretaker', score: 3 },
        { text: 'Được tự học theo tốc độ riêng', type: 'dreamer', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'Khi làm nhóm ở lớp, con thường đảm nhận vai trò?',
      options: [
        { text: 'Người tổ chức và phân chia nhiệm vụ', type: 'leader', score: 3 },
        { text: 'Người đề xuất ý tưởng sáng tạo', type: 'explorer', score: 3 },
        { text: 'Người giải quyết mâu thuẫn trong nhóm', type: 'caretaker', score: 3 },
        { text: 'Người thực hiện nhiệm vụ được giao cẩn thận', type: 'analyst', score: 3 },
      ],
    },
  ],
  '9-11': [
    {
      id: 1,
      question: 'Con cảm thấy thế nào khi phải làm điều gì đó không công bằng?',
      options: [
        { text: 'Lên tiếng phản đối ngay lập tức', type: 'leader', score: 3 },
        { text: 'Tìm cách để mọi người cùng thỏa thuận', type: 'caretaker', score: 3 },
        { text: 'Phân tích xem thực sự có bất công không', type: 'analyst', score: 3 },
        { text: 'Tức giận nhưng giữ trong lòng', type: 'dreamer', score: 2 },
      ],
    },
    {
      id: 2,
      question: 'Sau giờ học, con thường muốn?',
      options: [
        { text: 'Chơi thể thao hoặc hoạt động ngoài trời', type: 'explorer', score: 3 },
        { text: 'Đọc sách, vẽ hoặc làm gì đó một mình', type: 'dreamer', score: 3 },
        { text: 'Gặp bạn bè hoặc gọi điện nói chuyện', type: 'caretaker', score: 3 },
        { text: 'Làm bài tập ngay để hoàn thành trách nhiệm', type: 'analyst', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'Con thường giải quyết xung đột với bạn bè bằng cách?',
      options: [
        { text: 'Thẳng thắn nói chuyện để giải quyết', type: 'leader', score: 3 },
        { text: 'Nhường nhịn để giữ tình bạn', type: 'caretaker', score: 3 },
        { text: 'Tránh né cho đến khi bình tĩnh lại', type: 'dreamer', score: 2 },
        { text: 'Phân tích ai đúng ai sai rõ ràng', type: 'analyst', score: 3 },
      ],
    },
  ],
  '12-14': [
    {
      id: 1,
      question: 'Khi phải đưa ra quyết định quan trọng, con thường?',
      options: [
        { text: 'Quyết định nhanh dựa trên trực giác', type: 'leader', score: 3 },
        { text: 'Suy nghĩ rất lâu và lo lắng về mọi khả năng', type: 'dreamer', score: 2 },
        { text: 'Thu thập thông tin và phân tích kỹ lưỡng', type: 'analyst', score: 3 },
        { text: 'Hỏi ý kiến bạn bè và người thân', type: 'caretaker', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'Con cảm thấy thế nào về việc thay đổi kế hoạch đột ngột?',
      options: [
        { text: 'Thích nghi nhanh, xem đó là cơ hội mới', type: 'explorer', score: 3 },
        { text: 'Cần thời gian để điều chỉnh', type: 'dreamer', score: 2 },
        { text: 'Khó chịu nếu không được giải thích lý do', type: 'analyst', score: 3 },
        { text: 'Miễn là mọi người khác ổn thì con cũng ổn', type: 'caretaker', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'Sở thích lớn nhất của con là?',
      options: [
        { text: 'Thể thao, phiêu lưu, trải nghiệm mới', type: 'explorer', score: 3 },
        { text: 'Nghệ thuật, âm nhạc, viết lách', type: 'dreamer', score: 3 },
        { text: 'Tình nguyện, giúp đỡ cộng đồng', type: 'caretaker', score: 3 },
        { text: 'Công nghệ, khoa học, giải câu đố', type: 'analyst', score: 3 },
      ],
    },
  ],
  '15-17': [
    {
      id: 1,
      question: 'Con hình dung tương lai của mình như thế nào?',
      options: [
        { text: 'Lãnh đạo một tổ chức hoặc kinh doanh riêng', type: 'leader', score: 3 },
        { text: 'Làm nghề sáng tạo - nghệ thuật, thiết kế, viết', type: 'dreamer', score: 3 },
        { text: 'Làm việc trong lĩnh vực giúp đỡ người khác', type: 'caretaker', score: 3 },
        { text: 'Nghiên cứu khoa học hoặc công nghệ', type: 'analyst', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'Khi có áp lực học tập, con thường?',
      options: [
        { text: 'Lên kế hoạch cụ thể và thực hiện nghiêm túc', type: 'analyst', score: 3 },
        { text: 'Tìm cách học sáng tạo hoặc thú vị hơn', type: 'explorer', score: 3 },
        { text: 'Học nhóm với bạn bè', type: 'caretaker', score: 3 },
        { text: 'Cần không gian yên tĩnh để tập trung', type: 'dreamer', score: 3 },
      ],
    },
    {
      id: 3,
      question: 'Con quan tâm nhất đến điều gì trong cuộc sống?',
      options: [
        { text: 'Đạt được thành công và được công nhận', type: 'leader', score: 3 },
        { text: 'Hiểu ý nghĩa sâu xa của cuộc sống', type: 'dreamer', score: 3 },
        { text: 'Có gia đình và bạn bè hạnh phúc', type: 'caretaker', score: 3 },
        { text: 'Giải quyết các vấn đề phức tạp của thế giới', type: 'analyst', score: 3 },
      ],
    },
  ],
};

export const PERSONALITY_ADVICE_BY_AGE = {
  '0-2': {
    explorer: {
      tips: [
        'Tạo môi trường an toàn để bé khám phá tự do',
        'Cung cấp nhiều loại đồ chơi kích thích giác quan',
        'Cho bé tiếp xúc với thiên nhiên và môi trường đa dạng',
      ],
      activities: ['Nghịch cát/nước', 'Đi dạo ngoài trời', 'Khám phá hộp âm thanh'],
    },
    caretaker: {
      tips: [
        'Phản hồi tích cực với biểu hiện cảm xúc của bé',
        'Cho bé tiếp xúc với em bé khác hoặc thú cưng',
        'Đọc sách có nhân vật thể hiện sự quan tâm',
      ],
      activities: ['Búp bê/thú bông', 'Trò chơi bắt chước', 'Xem sách hình về cảm xúc'],
    },
    leader: {
      tips: [
        'Cho bé có cơ hội "dẫn dắt" trong các hoạt động đơn giản',
        'Hỏi ý kiến bé về các lựa chọn nhỏ',
        'Khuyến khích bé giao tiếp rõ ràng',
      ],
      activities: ['Chọn đồ chơi muốn chơi', 'Trò chơi âm nhạc nhịp điệu', 'Chơi cùng nhóm bạn nhỏ'],
    },
    dreamer: {
      tips: [
        'Đọc sách truyện tranh mỗi ngày',
        'Cho bé không gian yên tĩnh để quan sát',
        'Chấp nhận bé cần thời gian làm quen với điều mới',
      ],
      activities: ['Sách tranh', 'Nhạc nhẹ', 'Quan sát bầu trời/thiên nhiên'],
    },
    analyst: {
      tips: [
        'Cho bé tiếp xúc với các đồ vật có cơ chế đơn giản',
        'Đặt câu hỏi "tại sao" và "như thế nào"',
        'Kiên nhẫn để bé tự khám phá',
      ],
      activities: ['Xếp hình', 'Đồ chơi cơ học đơn giản', 'Quan sát thí nghiệm nhỏ'],
    },
  },
  '3-5': {
    explorer: {
      tips: [
        'Đăng ký các lớp năng khiếu thể thao, nghệ thuật',
        'Tổ chức các chuyến đi tham quan, khám phá thiên nhiên',
        'Khuyến khích con đặt câu hỏi về mọi thứ',
      ],
      activities: ['Leo núi/dã ngoại', 'Làm thí nghiệm đơn giản', 'Trồng cây/chăm sóc vật nuôi'],
    },
    caretaker: {
      tips: [
        'Dạy con nhận biết và đặt tên cho cảm xúc',
        'Khen ngợi khi con giúp đỡ anh/chị/em hoặc bạn bè',
        'Đọc sách về tình bạn và sự quan tâm',
      ],
      activities: ['Trò chơi nhập vai', 'Chăm sóc cây/vật nuôi nhỏ', 'Làm quà tặng cho người thân'],
    },
    leader: {
      tips: [
        'Cho con cơ hội đưa ra quyết định trong phạm vi an toàn',
        'Dạy con cách lắng nghe ý kiến người khác',
        'Khen ngợi khi con dẫn dắt bằng sự tôn trọng',
      ],
      activities: ['Trò chơi nhóm', 'Kể chuyện sáng tạo', 'Hoạt động thể thao đồng đội'],
    },
    dreamer: {
      tips: [
        'Tạo góc sáng tạo riêng với vật liệu nghệ thuật',
        'Tôn trọng không gian riêng tư của con',
        'Khuyến khích con kể về thế giới tưởng tượng của mình',
      ],
      activities: ['Vẽ tranh/tô màu', 'Xem phim hoạt hình', 'Kể chuyện trước khi ngủ'],
    },
    analyst: {
      tips: [
        'Cho con tiếp cận sách khoa học dành cho trẻ em',
        'Trả lời câu hỏi "tại sao" kiên nhẫn và đầy đủ',
        'Cho con thời gian hoàn thành trò chơi/câu đố',
      ],
      activities: ['Xếp lego', 'Trò chơi toán học', 'Thí nghiệm khoa học đơn giản'],
    },
  },
};
