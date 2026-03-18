import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const APP_NAME = 'Mindful Guardian';

export const generateReportContent = (reportData) => {
  const { type, result, childName, childAge } = reportData;
  const date = new Date().toLocaleDateString('vi-VN');

  let content = `BÁO CÁO PHÁT TRIỂN TÂM LÝ GIA ĐÌNH
${APP_NAME}
Ngày: ${date}
${childName ? `Tên bé: ${childName}` : ''}
${childAge ? `Tuổi: ${childAge}` : ''}

`;

  if (type === 'parenting') {
    content += `PHONG CÁCH NUÔI DẠY CON
========================
Phong cách chính: ${result.primaryStyle?.name || 'Chưa xác định'}
Mô tả: ${result.primaryStyle?.description || ''}

ĐIỂM MẠNH:
${result.primaryStyle?.strengths?.map((s) => `• ${s}`).join('\n') || 'Không có dữ liệu'}

CẦN CẢI THIỆN:
${result.primaryStyle?.improvements?.map((s) => `• ${s}`).join('\n') || 'Không có dữ liệu'}

LỜI KHUYÊN:
${result.primaryStyle?.advice?.map((a, i) => `${i + 1}. ${a}`).join('\n') || 'Không có dữ liệu'}
`;
  } else if (type === 'personality') {
    content += `TÍNH CÁCH CON
=============
Loại tính cách: ${result.primaryType?.name || 'Chưa xác định'} ${result.primaryType?.emoji || ''}
Mô tả: ${result.primaryType?.description || ''}

ĐẶC ĐIỂM NỔI BẬT:
${result.primaryType?.traits?.map((t) => `• ${t}`).join('\n') || 'Không có dữ liệu'}
`;
  } else if (type === 'eq') {
    content += `CHỈ SỐ EQ (TRÍ TUỆ CẢM XÚC)
==============================
Điểm tổng: ${result.totalScore || 0}/${result.maxTotal || 60}
Mức độ: ${result.level?.level || 'Chưa xác định'}
Tỷ lệ: ${result.percentage || 0}%

ĐIỂM THEO TỪNG CHIỀU:
${
  result.dimensionScores
    ? Object.values(result.dimensionScores)
        .map((d) => `• ${d.name}: ${d.score}/${d.maxScore} (${d.percentage}%)`)
        .join('\n')
    : 'Không có dữ liệu'
}
`;
  } else if (type === 'family') {
    content += `BÁO CÁO GIA ĐÌNH TOÀN DIỆN
===========================
`;
    if (result.parenting?.result) {
      content += `\nPhong cách nuôi dạy: ${result.parenting.result.primaryStyle?.name || 'Chưa xác định'}\n`;
    }
    if (result.personality?.result) {
      content += `Tính cách bé: ${result.personality.result.primaryType?.name || 'Chưa xác định'}\n`;
    }
    if (result.eq?.result) {
      content += `Chỉ số EQ: ${result.eq.result.level?.level || 'Chưa xác định'} (${result.eq.result.percentage || 0}%)\n`;
    }
    content += `\nCảm ơn bạn đã sử dụng ${APP_NAME}!\nTiếp tục đồng hành cùng sự phát triển của gia đình.\n`;
  }

  content += `

---
Được tạo bởi ${APP_NAME}
© ${new Date().getFullYear()} ${APP_NAME}
`;

  return content;
};

export const exportReport = async (reportData) => {
  try {
    const content = generateReportContent(reportData);
    const timestamp = Date.now();
    const fileName = `MindfulGuardian_Report_${timestamp}.txt`;

    // Ensure documentDirectory exists
    const dir = FileSystem.documentDirectory;
    if (!dir) {
      return { success: false, error: 'Không thể truy cập bộ nhớ thiết bị' };
    }

    const fileUri = dir + fileName;

    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Verify file was written
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      return { success: false, error: 'Không thể tạo file báo cáo' };
    }

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      return { success: false, error: 'Thiết bị không hỗ trợ chia sẻ file' };
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/plain',
      dialogTitle: `Chia sẻ Báo Cáo - ${APP_NAME}`,
      UTI: 'public.plain-text',
    });

    return { success: true, fileUri };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.message || 'Lỗi không xác định' };
  }
};
