import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { IAP_PRODUCTS } from '../../data/iapProducts';
import Button from '../../components/Button';
import { checkPurchase, purchaseProduct } from '../../utils/iapService';
import { getTestResult } from '../../utils/storage';
import { exportReport } from '../../utils/pdfExport';

export default function FamilyReportScreen({ navigation }) {
  const [purchased, setPurchased] = useState(false);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const [hasPurchase, parentingResult, personalityResult, eqResult] = await Promise.all([
      checkPurchase('family_report_bundle'),
      getTestResult('parenting'),
      getTestResult('personality'),
      getTestResult('eq'),
    ]);

    setPurchased(hasPurchase);
    setResults({
      parenting: parentingResult,
      personality: personalityResult,
      eq: eqResult,
    });
    setLoading(false);
  };

  const handlePurchase = async () => {
    const result = await purchaseProduct(
      'family_report_bundle',
      () => {
        Alert.alert('Thành công! 🎉', 'Gói Family Report đã được kích hoạt!', [
          { text: 'OK', onPress: () => loadData() },
        ]);
      },
      () => Alert.alert('Lỗi', 'Giao dịch không thành công.')
    );
  };

  const handleExportFamily = async () => {
    const exported = await exportReport({ type: 'family', result: results });
    if (!exported.success) Alert.alert('Lỗi', 'Không thể xuất báo cáo.');
  };

  const completedCount = Object.values(results).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.bannerTitle}>Báo Cáo Gia Đình Toàn Diện</Text>
          <Text style={styles.bannerDesc}>
            Tổng hợp phân tích từ cả 3 bài test để hiểu sâu hơn về gia đình bạn
          </Text>
          {purchased && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>✓ Đã kích hoạt</Text>
            </View>
          )}
        </View>

        {/* Test Status */}
        <Text style={styles.sectionTitle}>Tiến Trình Bài Test ({completedCount}/3)</Text>

        {[
          {
            key: 'parenting',
            name: 'Phong Cách Nuôi Dạy',
            emoji: '🧠',
            color: COLORS.primary,
            screen: 'ParentingTest',
          },
          {
            key: 'personality',
            name: 'Tính Cách Con',
            emoji: '🌟',
            color: '#FF6B35',
            screen: 'PersonalityTest',
          },
          {
            key: 'eq',
            name: 'Chỉ Số EQ',
            emoji: '💝',
            color: '#FF69B4',
            screen: 'EQTest',
          },
        ].map((test) => {
          const hasResult = !!results[test.key];
          return (
            <TouchableOpacity
              key={test.key}
              style={styles.testStatus}
              onPress={() => !hasResult && navigation.navigate(test.screen)}
              activeOpacity={hasResult ? 1 : 0.8}
            >
              <View style={[styles.testStatusIcon, { backgroundColor: test.color + '22' }]}>
                <Text style={styles.testStatusEmoji}>{test.emoji}</Text>
              </View>
              <View style={styles.testStatusInfo}>
                <Text style={styles.testStatusName}>{test.name}</Text>
                <Text style={[styles.testStatusState, { color: hasResult ? COLORS.success : COLORS.textSecondary }]}>
                  {hasResult ? '✓ Đã hoàn thành' : '○ Chưa làm'}
                </Text>
              </View>
              {!hasResult && (
                <View style={[styles.doBtn, { backgroundColor: test.color }]}>
                  <Text style={styles.doBtnText}>Làm</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Family Report Content */}
        {purchased ? (
          <>
            <Text style={styles.sectionTitle}>Báo Cáo Gia Đình</Text>

            {results.parenting && (
              <View style={[styles.resultCard, { borderLeftColor: COLORS.primary }]}>
                <Text style={styles.resultCardTitle}>
                  🧠 Phong cách: {results.parenting.result?.primaryStyle?.name}
                </Text>
                <Text style={styles.resultCardDesc}>
                  {results.parenting.result?.primaryStyle?.description}
                </Text>
              </View>
            )}

            {results.personality && (
              <View style={[styles.resultCard, { borderLeftColor: '#FF6B35' }]}>
                <Text style={styles.resultCardTitle}>
                  🌟 Tính cách bé: {results.personality.result?.primaryType?.name}
                </Text>
                <Text style={styles.resultCardDesc}>
                  {results.personality.result?.primaryType?.description}
                </Text>
              </View>
            )}

            {results.eq && (
              <View style={[styles.resultCard, { borderLeftColor: '#FF69B4' }]}>
                <Text style={styles.resultCardTitle}>
                  💝 EQ: {results.eq.result?.level?.level} ({results.eq.result?.totalScore}/{results.eq.result?.maxTotal})
                </Text>
                <Text style={styles.resultCardDesc}>
                  Mức độ trí tuệ cảm xúc: {results.eq.result?.percentage}% điểm tối đa
                </Text>
              </View>
            )}

            {completedCount === 3 && (
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>🔍 Phân Tích Gia Đình</Text>
                <Text style={styles.insightText}>
                  Dựa trên kết quả 3 bài test, bạn có phong cách nuôi dạy{' '}
                  <Text style={styles.bold}>{results.parenting?.result?.primaryStyle?.name}</Text> - phù hợp
                  với tính cách{' '}
                  <Text style={styles.bold}>{results.personality?.result?.primaryType?.name}</Text> của bé.
                  Chỉ số EQ ở mức{' '}
                  <Text style={styles.bold}>{results.eq?.result?.level?.level}</Text> cho thấy bé đang
                  phát triển trí tuệ cảm xúc tốt.
                </Text>
              </View>
            )}

            <Button
              title="📄 Xuất PDF Gia Đình"
              onPress={handleExportFamily}
              style={styles.exportBtn}
            />
          </>
        ) : (
          <View style={styles.purchaseCard}>
            <Text style={styles.purchaseTitle}>Mua Gói Family Report</Text>
            <Text style={styles.purchaseDesc}>
              Nhận toàn bộ phân tích cho cả gia đình với giá ưu đãi
            </Text>
            <View style={styles.purchaseFeatures}>
              {IAP_PRODUCTS.FAMILY_REPORT.features.map((f, i) => (
                <View key={i} style={styles.purchaseFeatureItem}>
                  <Text style={[styles.purchaseFeatureCheck, { color: '#4ECDC4' }]}>✓</Text>
                  <Text style={styles.purchaseFeatureText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.oldPrice}>77.000đ</Text>
              <Text style={styles.newPrice}>{IAP_PRODUCTS.FAMILY_REPORT.price}</Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Tiết kiệm 37%</Text>
              </View>
            </View>
            <Button
              title={`Mua Gói Family - ${IAP_PRODUCTS.FAMILY_REPORT.price}`}
              onPress={handlePurchase}
              style={{ backgroundColor: '#4ECDC4' }}
            />
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  backBtnText: { fontSize: 28, color: COLORS.text, lineHeight: 32 },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, flex: 1, textAlign: 'center' },
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  banner: {
    backgroundColor: '#1A1A2E',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  bannerEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse, textAlign: 'center', marginBottom: 8 },
  bannerDesc: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 22 },
  activeBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  activeBadgeText: { ...TYPOGRAPHY.bodySmall, color: COLORS.textInverse, fontWeight: '700' },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  testStatus: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  testStatusIcon: { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  testStatusEmoji: { fontSize: 22 },
  testStatusInfo: { flex: 1 },
  testStatusName: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, fontWeight: '600' },
  testStatusState: { ...TYPOGRAPHY.caption, marginTop: 2 },
  doBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full },
  doBtnText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '600' },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
  },
  resultCardTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: 4 },
  resultCardDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textSecondary },
  insightCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '44',
  },
  insightTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary, marginBottom: 8 },
  insightText: { ...TYPOGRAPHY.body, color: COLORS.text, lineHeight: 24 },
  bold: { fontWeight: '700', color: COLORS.primary },
  exportBtn: { marginBottom: SPACING.md },
  purchaseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    ...SHADOWS.lg,
    marginBottom: SPACING.md,
  },
  purchaseTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  purchaseDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.md },
  purchaseFeatures: { marginBottom: SPACING.md },
  purchaseFeatureItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  purchaseFeatureCheck: { fontWeight: '700', fontSize: 16 },
  purchaseFeatureText: { ...TYPOGRAPHY.body, color: COLORS.text, flex: 1, lineHeight: 22 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md, justifyContent: 'center' },
  oldPrice: { ...TYPOGRAPHY.body, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  newPrice: { fontSize: 24, fontWeight: '800', color: '#4ECDC4' },
  saveBadge: { backgroundColor: COLORS.secondary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  saveText: { fontSize: 11, fontWeight: '800', color: COLORS.textInverse },
  bottomPad: { height: SPACING.xl },
});
