export const PARENTING_STYLES = {
  authoritative: {
    id: 'authoritative',
    name: 'Dân Chủ',
    nameEn: 'Authoritative',
    color: '#6C63FF',
    emoji: '🌟',
    description:
      'Bạn đặt ra các quy tắc rõ ràng nhưng linh hoạt, lắng nghe con và giải thích lý do. Bạn vừa ấm áp vừa có kỷ luật.',
    strengths: [
      'Con phát triển sự tự tin và độc lập',
      'Kỹ năng xã hội tốt',
      'Học tập hiệu quả hơn',
      'Ít vấn đề tâm lý hơn',
    ],
    improvements: [
      'Đảm bảo nhất quán trong việc thực thi quy tắc',
      'Tránh quá nhiều thương lượng',
    ],
    advice: [
      'Tiếp tục duy trì sự cân bằng giữa ấm áp và kỷ luật',
      'Tham gia vào các hoạt động học tập cùng con',
      'Khuyến khích con đặt câu hỏi và tư duy phản biện',
    ],
  },
  authoritarian: {
    id: 'authoritarian',
    name: 'Độc Đoán',
    nameEn: 'Authoritarian',
    color: '#FF6B6B',
    emoji: '⚡',
    description:
      'Bạn có kỳ vọng cao và quy tắc nghiêm ngặt. Sự vâng lời và kỷ luật là ưu tiên hàng đầu.',
    strengths: [
      'Con có kỷ luật tốt',
      'Hiểu rõ ranh giới và quy tắc',
      'Có cấu trúc và tổ chức trong cuộc sống',
    ],
    improvements: [
      'Lắng nghe cảm xúc và ý kiến của con nhiều hơn',
      'Giải thích lý do đằng sau các quy tắc',
      'Tạo không gian cho con thể hiện bản thân',
    ],
    advice: [
      'Thực hành lắng nghe tích cực mỗi ngày',
      'Thêm yếu tố vui vẻ vào các hoạt động gia đình',
      'Khen ngợi nỗ lực hơn là kết quả',
    ],
  },
  permissive: {
    id: 'permissive',
    name: 'Chiều Chuộng',
    nameEn: 'Permissive',
    color: '#FFB347',
    emoji: '🌈',
    description:
      'Bạn rất ấm áp và nuôi dưỡng, ít đặt ra các giới hạn. Bạn muốn con hạnh phúc và tự do.',
    strengths: [
      'Con cảm thấy được yêu thương và chấp nhận',
      'Sáng tạo và tự do trong biểu đạt',
      'Mối quan hệ thân thiết với cha mẹ',
    ],
    improvements: [
      'Thiết lập giới hạn và quy tắc nhất quán hơn',
      'Học cách nói "không" một cách yêu thương',
      'Giúp con phát triển sự tự kiểm soát',
    ],
    advice: [
      'Bắt đầu với một số quy tắc đơn giản và nhất quán',
      'Giải thích hậu quả của hành vi',
      'Khen ngợi khi con tuân thủ giới hạn',
    ],
  },
  uninvolved: {
    id: 'uninvolved',
    name: 'Thụ Động',
    nameEn: 'Uninvolved',
    color: '#A8A8A8',
    emoji: '🔄',
    description:
      'Bạn cung cấp nhu cầu cơ bản cho con nhưng ít tham gia về mặt cảm xúc và định hướng.',
    strengths: ['Con có thể phát triển tính độc lập', 'Kỹ năng tự giải quyết vấn đề'],
    improvements: [
      'Dành nhiều thời gian chất lượng với con hơn',
      'Quan tâm đến cảm xúc và trải nghiệm của con',
      'Tham gia vào hoạt động học tập và vui chơi của con',
    ],
    advice: [
      'Đặt lịch cố định để dành thời gian với con',
      'Hỏi về ngày của con mỗi tối',
      'Tham dự các sự kiện quan trọng của con',
    ],
  },
};

export const PARENTING_QUESTIONS = [
  {
    id: 1,
    question: 'Khi con không muốn ăn rau, bạn thường làm gì?',
    options: [
      {
        text: 'Giải thích tại sao rau tốt và đề nghị con thử một miếng nhỏ',
        style: 'authoritative',
        score: 3,
      },
      { text: 'Bắt con phải ăn hết đĩa rau trước khi được rời bàn', style: 'authoritarian', score: 3 },
      { text: 'Làm món khác cho con vì không muốn con buồn', style: 'permissive', score: 3 },
      {
        text: 'Không can thiệp, để con tự quyết định có ăn hay không',
        style: 'uninvolved',
        score: 3,
      },
    ],
  },
  {
    id: 2,
    question: 'Con về nhà với điểm kiểm tra kém. Phản ứng đầu tiên của bạn là?',
    options: [
      {
        text: 'Hỏi con chuyện gì đã xảy ra và cùng tìm cách cải thiện',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Nghiêm khắc phê bình và yêu cầu con học thêm ngay lập tức',
        style: 'authoritarian',
        score: 3,
      },
      {
        text: 'An ủi con và nói điểm không quan trọng, miễn con vui',
        style: 'permissive',
        score: 3,
      },
      { text: 'Xem qua rồi để đó, bận việc khác', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 3,
    question: 'Con muốn tham gia một hoạt động ngoại khóa mới. Bạn sẽ?',
    options: [
      {
        text: 'Thảo luận về lợi ích, chi phí và cam kết thời gian, rồi hỗ trợ quyết định của con',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Tự quyết định hoạt động nào phù hợp nhất cho tương lai của con',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Đăng ký ngay vì muốn con được trải nghiệm mọi thứ', style: 'permissive', score: 3 },
      { text: 'Để con tự lo vì không có thời gian theo dõi', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 4,
    question: 'Con cãi nhau với bạn bè. Bạn thường xử lý thế nào?',
    options: [
      {
        text: 'Lắng nghe quan điểm của con, giúp con hiểu cảm xúc và tìm giải pháp',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Nói với con cách cư xử đúng đắn và ra lệnh xin lỗi nếu cần',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Bênh vực con hoàn toàn và có thể đối đầu với phụ huynh kia', style: 'permissive', score: 3 },
      { text: 'Khuyến khích con tự giải quyết vì đó là việc của trẻ em', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 5,
    question: 'Quy tắc về thời gian dùng màn hình trong nhà bạn như thế nào?',
    options: [
      {
        text: 'Có giới hạn rõ ràng nhưng linh hoạt, được thảo luận và đồng ý với con',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Quy định nghiêm ngặt: số giờ cụ thể, loại nội dung được phép',
        style: 'authoritarian',
        score: 3,
      },
      {
        text: 'Không giới hạn nhiều, miễn là con không bị ảnh hưởng sức khỏe',
        style: 'permissive',
        score: 3,
      },
      { text: 'Không có quy tắc cụ thể, con muốn dùng bao nhiêu thì dùng', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 6,
    question: 'Khi con mắc lỗi nghiêm trọng, hình thức kỷ luật bạn thường dùng là?',
    options: [
      {
        text: 'Nói chuyện về hậu quả, cùng con tìm cách khắc phục và rút kinh nghiệm',
        style: 'authoritative',
        score: 3,
      },
      { text: 'Phạt ngay lập tức với hậu quả rõ ràng và nghiêm khắc', style: 'authoritarian', score: 3 },
      {
        text: 'Ít khi phạt, chủ yếu nhắc nhở nhẹ nhàng và dễ tha thứ',
        style: 'permissive',
        score: 3,
      },
      { text: 'Thường bỏ qua hoặc không chú ý nhiều đến lỗi của con', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 7,
    question: 'Mỗi ngày bạn dành bao nhiêu thời gian chất lượng với con?',
    options: [
      {
        text: 'Ít nhất 1-2 giờ tập trung hoàn toàn vào con, có hoạt động có ý nghĩa',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Thời gian dành cho việc học và phát triển kỹ năng cụ thể',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Càng nhiều càng tốt, con muốn gì thì làm đó cùng con', style: 'permissive', score: 3 },
      { text: 'Ít hơn 30 phút hoặc không đều đặn do công việc bận rộn', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 8,
    question: 'Con muốn làm điều gì đó khác với mong muốn của bạn. Bạn thường?',
    options: [
      {
        text: 'Lắng nghe lý do của con, thỏa hiệp khi hợp lý hoặc giải thích khi không đồng ý',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Kiên quyết theo ý mình vì bạn biết điều gì tốt nhất cho con',
        style: 'authoritarian',
        score: 3,
      },
      {
        text: 'Thường đồng ý với con vì muốn con hạnh phúc',
        style: 'permissive',
        score: 3,
      },
      { text: 'Để con tự quyết định vì không muốn tranh luận', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 9,
    question: 'Cách bạn khen ngợi con thường là?',
    options: [
      {
        text: 'Khen cụ thể về nỗ lực và quá trình: "Con đã cố gắng rất nhiều để làm điều này!"',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Khen khi đạt kết quả tốt: "Con giỏi lắm! Điểm số rất tốt!"',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Khen ngợi nhiều và thường xuyên về mọi thứ con làm', style: 'permissive', score: 3 },
      { text: 'Ít khen ngợi, hoặc chỉ khi con làm điều gì đó thực sự nổi bật', style: 'uninvolved', score: 3 },
    ],
  },
  {
    id: 10,
    question: 'Khi con gặp vấn đề khó khăn ở trường, bạn thường?',
    options: [
      {
        text: 'Hướng dẫn con cách giải quyết nhưng để con tự làm, sẵn sàng hỗ trợ khi cần',
        style: 'authoritative',
        score: 3,
      },
      {
        text: 'Giám sát chặt chẽ và đảm bảo con giải quyết đúng cách',
        style: 'authoritarian',
        score: 3,
      },
      { text: 'Giải quyết thay cho con để con không phải lo lắng', style: 'permissive', score: 3 },
      { text: 'Để con tự xử lý vì đó là cơ hội học hỏi của con', style: 'uninvolved', score: 3 },
    ],
  },
];
