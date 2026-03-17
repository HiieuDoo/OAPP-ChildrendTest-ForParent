import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const generatePDFContent = (reportData) => {
  const { type, result, childName, childAge } = reportData;
  const date = new Date().toLocaleDateString('vi-VN');

  let content = `
BÁO CÁO PHÁT TRIỂN TRẺ EM
KidsParent - Hiểu Con Hơn
Ngày: ${date}
${childName ? `Tên bé: ${childName}` : ''}
${childAge ? `Tuổi: ${childAge}` : ''}

`;

  if (type === 'parenting') {
    content += `
PHONG CÁCH NUÔI DẠY CON
========================
Phong cách chính: ${result.primaryStyle?.name || 'Chưa xác định'}
Mô tả: ${result.primaryStyle?.description || ''}

ĐIỂM MẠNH:
${result.primaryStyle?.strengths?.map((s) => `• ${s}`).join('\n') || ''}

LỜI KHUYÊN:
${result.primaryStyle?.advice?.map((a) => `• ${a}`).join('\n') || ''}
`;
  } else if (type === 'personality') {
    content += `
TÍNH CÁCH CON
=============
Loại tính cách: ${result.primaryType?.name || 'Chưa xác định'} ${result.primaryType?.emoji || ''}
Mô tả: ${result.primaryType?.description || ''}

ĐẶC ĐIỂM NỔI BẬT:
${result.primaryType?.traits?.map((t) => `• ${t}`).join('\n') || ''}
`;
  } else if (type === 'eq') {
    content += `
CHỈ SỐ EQ (TRÍ TUỆ CẢM XÚC)
==============================
Điểm tổng: ${result.totalScore || 0}/60
Mức độ: ${result.level?.level || 'Chưa xác định'}

ĐIỂM THEO TỪNG CHIỀU:
${
  result.dimensionScores
    ? Object.entries(result.dimensionScores)
        .map(([key, val]) => `• ${val.name}: ${val.score}/${val.maxScore}`)
        .join('\n')
    : ''
}
`;
  } else if (type === 'family') {
    content += `
BÁO CÁO GIA ĐÌNH TOÀN DIỆN
===========================
Bao gồm phân tích:
• Phong cách nuôi dạy con
• Tính cách bé theo độ tuổi
• Chỉ số EQ của bé

Cảm ơn bạn đã sử dụng KidsParent!
Tiếp tục đồng hành cùng sự phát triển của con.
`;
  }

  content += `

---
Được tạo bởi KidsParent - Hiểu Con Hơn
© ${new Date().getFullYear()} KidsParent
`;

  return content;
};

export const exportReport = async (reportData) => {
  try {
    const content = generatePDFContent(reportData);
    const fileName = `KidsParent_Report_${Date.now()}.txt`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Chia sẻ Báo Cáo KidsParent',
      });
      return { success: true, fileUri };
    } else {
      return { success: false, error: 'Sharing not available' };
    }
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error };
  }
};
