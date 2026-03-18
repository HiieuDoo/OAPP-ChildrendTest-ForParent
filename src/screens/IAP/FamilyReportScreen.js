import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { CREDIT_COSTS } from '../../data/iapProducts';
import Button from '../../components/Button';
import { hasAccessToResult, unlockWithCredits, getBalance } from '../../utils/iapService';
import { getTestResult } from '../../utils/storage';
import { exportReport } from '../../utils/pdfExport';

const FAMILY_COST = CREDIT_COSTS.FAMILY_REPORT; // 2 credits

export default function FamilyReportScreen({ navigation }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const [access, parentingResult, personalityResult, eqResult, bal] = await Promise.all([
      hasAccessToResult('family'),
      getTestResult('parenting'),
      getTestResult('personality'),
      getTestResult('eq'),
      getBalance(),
    ]);

    setHasAccess(access);
    setResults({
      parenting: parentingResult,
      personality: personalityResult,
      eq: eqResult,
    });
    setBalance(bal);
    setLoading(false);
  };

  const handleUnlock = async () => {
    if (balance < FAMILY_COST) {
      Alert.alert(
        'Không đủ credit 💎',
        `Bạn cần ${FAMILY_COST} credit để xem báo cáo gia đình.\nSố dư: ${balance.toFixed(1)} credit`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Nạp credit',
            onPress: () =>
              navigation.navigate('IAPScreen', {
                requiredCredits: FAMILY_COST,
                onSuccess: () => loadData(),
              }),
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Xác nhận mở khóa',
      `Sử dụng ${FAMILY_COST} credit để xem Báo Cáo Gia Đình?\nSố dư: ${balance.toFixed(1)} credit`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            setUnlocking(true);
            const success = await unlockWithCredits('family', FAMILY_COST);
            if (success) {
              await loadData();
              Alert.alert('Đã mở khóa! 🎉', 'Báo cáo gia đình đã được kích hoạt!');
            } else {
              Alert.alert('Lỗi', 'Không thể mở khóa. Vui lòng thử lại.');
            }
            setUnlocking(false);
          },
        },
      ]
    );
  };

  const handleExportFamily = async () => {
    if (balance < CREDIT_COSTS.EXPORT_PDF) {
      Alert.alert(
        'Không đủ credit',
        `Cần ${CREDIT_COSTS.EXPORT_PDF} credit để xuất PDF.`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Nạp credit',
            onPress: () => navigation.navigate('IAPScreen', { requiredCredits: CREDIT_COSTS.EXPORT_PDF }),
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Xác nhận xuất báo cáo',
      `Sử dụng ${CREDIT_COSTS.EXPORT_PDF} credit để xuất PDF?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xuất',
          onPress: async () => {
            setExporting(true);
            const { spendCredits } = await import('../../utils/storage');
            const spent = await spendCredits(CREDIT_COSTS.EXPORT_PDF);
            if (!spent) {
              Alert.alert('Lỗi', 'Không thể trừ credit.');
              setExporting(false);
              return;
            }
            const exported = await exportReport({ type: 'family', result: results });
            setExporting(false);
            await loadData();
            if (!exported.success) {
              Alert.alert('Lỗi xuất báo cáo', exported.error || 'Không thể xuất báo cáo.');
            }
          },
        },
      ]
    );
  };

  const completedCount = Object.values(results).filter(Boolean).length;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Báo Cáo Gia Đình</Text>
        <TouchableOpacity
          style={styles.creditBadge}
          onPress={() => navigation.navigate('IAPScreen', {})}
        >
          <Text style={styles.creditText}>💎 {balance.toFixed(1)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.bannerTitle}>Báo Cáo Gia Đình Toàn Diện</Text>
          <Text style={styles.bannerDesc}>
            Tổng hợp phân tích từ cả 3 bài test để hiểu sâu hơn về gia đình bạn
          </Text>
          {hasAccess ? (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>✓ Đã kích hoạt</Text>
            </View>
          ) : (
            <View style={styles.costBadge}>
              <Text style={styles.costBadgeText}>💎 {FAMILY_COST} credit</Text>
            </View>
          )}
        </View>

        {/* Test Progress */}
        <Text style={styles.sectionTitle}>Tiến Trình Bài Test ({completedCount}/3)</Text>

        {[
          { key: 'parenting', name: 'Phong Cách Nuôi Dạy', emoji: '🧠', color: COLORS.primary, screen: 'ParentingTest' },
          { key: 'personality', name: 'Tính Cách Con', emoji: '🌟', color: '#FF6B35', screen: 'PersonalityTest' },
          { key: 'eq', name: 'Chỉ Số EQ', emoji: '💝', color: '#FF69B4', screen: 'EQTest' },
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

        {/* Content */}
        {hasAccess ? (
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
              title={exporting ? 'Đang xuất...' : `📄 Xuất PDF (${CREDIT_COSTS.EXPORT_PDF} credit)`}
              onPress={handleExportFamily}
              style={styles.exportBtn}
              disabled={exporting}
            />
          </>
        ) : (
          <View style={styles.lockedCard}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.lockTitle}>Mở Khóa Báo Cáo Gia Đình</Text>
            <Text style={styles.lockDesc}>
              Tốn {FAMILY_COST} credit để xem toàn bộ phân tích gia đình kết hợp từ 3 bài test
            </Text>
            <View style={styles.lockFeatures}>
              {[
                'Tất cả kết quả 3 bài test',
                'Phân tích tương hợp phụ huynh - con',
                'Lời khuyên giao tiếp gia đình',
                'Xuất PDF báo cáo đầy đủ',
              ].map((f, i) => (
                <View key={i} style={styles.lockFeatureItem}>
                  <Text style={styles.lockFeatureCheck}>✓</Text>
                  <Text style={styles.lockFeatureText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Chi phí:</Text>
              <Text style={styles.costValue}>💎 {FAMILY_COST} credit</Text>
              {balance < FAMILY_COST && (
                <Text style={styles.costShort}>
                  (Thiếu {(FAMILY_COST - balance).toFixed(1)} credit)
                </Text>
              )}
            </View>
            <Button
              title={unlocking ? 'Đang mở khóa...' : `Mở Khóa Ngay - ${FAMILY_COST} Credit`}
              onPress={handleUnlock}
              disabled={unlocking}
              style={{ backgroundColor: '#4ECDC4' }}
            />
            {balance < FAMILY_COST && (
              <TouchableOpacity
                onPress={() => navigation.navigate('IAPScreen', { requiredCredits: FAMILY_COST })}
              >
                <Text style={styles.buyCreditsLink}>Nạp thêm credit ›</Text>
              </TouchableOpacity>
            )}
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
    paddingTop: 52,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.text },
  creditBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    ...SHADOWS.sm,
  },
  creditText: { ...TYPOGRAPHY.bodySmall, color: COLORS.textInverse, fontWeight: '700' },
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
  costBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  costBadgeText: { ...TYPOGRAPHY.bodySmall, color: COLORS.textInverse, fontWeight: '700' },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.sm },
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
  lockedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    ...SHADOWS.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  lockEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  lockTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  lockDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.md, lineHeight: 22 },
  lockFeatures: { alignSelf: 'stretch', marginBottom: SPACING.md },
  lockFeatureItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  lockFeatureCheck: { color: '#4ECDC4', fontWeight: '700', fontSize: 16 },
  lockFeatureText: { ...TYPOGRAPHY.body, color: COLORS.text, flex: 1, lineHeight: 22 },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  costLabel: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  costValue: { fontSize: 18, fontWeight: '800', color: '#4ECDC4' },
  costShort: { ...TYPOGRAPHY.caption, color: COLORS.secondary, width: '100%', textAlign: 'center' },
  buyCreditsLink: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    textDecorationLine: 'underline',
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  bottomPad: { height: SPACING.xl },
});
