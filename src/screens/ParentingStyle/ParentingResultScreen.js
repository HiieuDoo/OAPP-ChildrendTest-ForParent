import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { PARENTING_STYLES } from '../../data/parentingStyleData';
import { CREDIT_COSTS } from '../../data/iapProducts';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { hasAccessToResult, unlockWithCredits, getBalance } from '../../utils/iapService';
import { exportReport } from '../../utils/pdfExport';
import { spendCredits } from '../../utils/storage';

const COST = CREDIT_COSTS.PARENTING_RESULT;
const PDF_COST = CREDIT_COSTS.EXPORT_PDF;

export default function ParentingResultScreen({ route, navigation }) {
  const { result } = route.params;
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const [access, bal] = await Promise.all([hasAccessToResult('parenting'), getBalance()]);
    setHasAccess(access);
    setBalance(bal);
    setCheckingAccess(false);
  };

  const handleUnlock = async () => {
    if (balance < COST) {
      Alert.alert(
        'Không đủ credit 💎',
        `Cần ${COST} credit để xem kết quả.\nSố dư: ${balance.toFixed(1)} credit`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Nạp credit',
            onPress: () =>
              navigation.navigate('IAPScreen', {
                requiredCredits: COST,
                onSuccess: () => checkAccess(),
              }),
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Xác nhận mở khóa',
      `Dùng ${COST} credit để xem kết quả Phong Cách Nuôi Dạy?\nSố dư: ${balance.toFixed(1)} credit`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            const success = await unlockWithCredits('parenting', COST);
            if (success) {
              await checkAccess();
            } else {
              Alert.alert('Lỗi', 'Không thể mở khóa. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  const handleExport = async () => {
    const currentBalance = await getBalance();
    if (currentBalance < PDF_COST) {
      Alert.alert(
        'Không đủ credit',
        `Cần ${PDF_COST} credit để xuất PDF.`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Nạp credit',
            onPress: () => navigation.navigate('IAPScreen', { requiredCredits: PDF_COST }),
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Xác nhận xuất báo cáo',
      `Dùng ${PDF_COST} credit để xuất PDF?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xuất',
          onPress: async () => {
            const spent = await spendCredits(PDF_COST);
            if (!spent) { Alert.alert('Lỗi', 'Không đủ credit.'); return; }
            const exported = await exportReport({ type: 'parenting', result });
            await checkAccess();
            if (!exported.success) {
              Alert.alert('Lỗi xuất báo cáo', exported.error || 'Không thể xuất báo cáo. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  const { primaryStyle, percentages } = result;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={primaryStyle?.color || COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Result Header */}
        <View style={[styles.resultHeader, { backgroundColor: primaryStyle?.color || COLORS.primary }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.balanceBadge}
            onPress={() => navigation.navigate('IAPScreen', {})}
          >
            <Text style={styles.balanceBadgeText}>💎 {balance.toFixed(1)}</Text>
          </TouchableOpacity>
          <Text style={styles.resultEmoji}>{primaryStyle?.emoji || '🌟'}</Text>
          <Text style={styles.resultLabel}>Phong cách của bạn</Text>
          <Text style={styles.resultTitle}>{primaryStyle?.name || 'Kết Quả'}</Text>
          <Text style={styles.resultSubtitle}>{primaryStyle?.nameEn}</Text>
        </View>

        <View style={styles.content}>
          {/* Style Distribution */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Phân Tích Phong Cách</Text>
            {Object.entries(percentages || {}).map(([styleId, pct]) => {
              const style = PARENTING_STYLES[styleId];
              return (
                <View key={styleId} style={styles.styleRow}>
                  <Text style={styles.styleEmoji}>{style?.emoji}</Text>
                  <View style={styles.styleInfo}>
                    <View style={styles.styleLabelRow}>
                      <Text style={styles.styleName}>{style?.name}</Text>
                      <Text style={[styles.stylePct, { color: style?.color }]}>{pct}%</Text>
                    </View>
                    <View style={styles.styleBarTrack}>
                      <View
                        style={[
                          styles.styleBarFill,
                          { width: `${pct}%`, backgroundColor: style?.color },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>

          {/* Description */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Bạn Là Ai?</Text>
            <Text style={styles.descText}>{primaryStyle?.description}</Text>
          </Card>

          {/* Locked Content */}
          {!hasAccess ? (
            <View style={styles.lockedContainer}>
              <View style={styles.blurredContent}>
                <Card style={[styles.card, styles.blurred]}>
                  <Text style={styles.cardTitle}>💪 Điểm Mạnh</Text>
                  <Text style={styles.blurredText}>
                    ██████████ ███████ ████████████████ ███████████████████████████████
                    ████████████ ███████████████████████████████████████
                  </Text>
                </Card>
                <Card style={[styles.card, styles.blurred]}>
                  <Text style={styles.cardTitle}>🎯 Lời Khuyên</Text>
                  <Text style={styles.blurredText}>
                    ████████████████████████ ███████████████████████ ████████████████
                  </Text>
                </Card>
              </View>
              <View style={styles.unlockCard}>
                <Text style={styles.unlockEmoji}>🔒</Text>
                <Text style={styles.unlockTitle}>Mở Khóa Phân Tích Đầy Đủ</Text>
                <Text style={styles.unlockDesc}>
                  Xem điểm mạnh, điểm cần cải thiện và kế hoạch phát triển 30 ngày
                </Text>
                <View style={styles.creditCostRow}>
                  <Text style={styles.creditCostLabel}>Chi phí:</Text>
                  <Text style={styles.creditCostValue}>💎 {COST} credit</Text>
                  {balance < COST && (
                    <Text style={styles.creditShort}>
                      (Cần thêm {(COST - balance).toFixed(1)} credit)
                    </Text>
                  )}
                </View>
                <Button
                  title={`Mở Khóa Ngay - ${COST} Credit`}
                  onPress={handleUnlock}
                  style={styles.unlockBtn}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('IAPScreen', { requiredCredits: COST })}
                >
                  <Text style={styles.buyCreditsLink}>Nạp credit ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* Strengths */}
              <Card style={styles.card}>
                <Text style={styles.cardTitle}>💪 Điểm Mạnh</Text>
                {primaryStyle?.strengths?.map((s, i) => (
                  <View key={i} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>{s}</Text>
                  </View>
                ))}
              </Card>

              {/* Improvements */}
              <Card style={styles.card}>
                <Text style={styles.cardTitle}>📈 Cần Cải Thiện</Text>
                {primaryStyle?.improvements?.map((s, i) => (
                  <View key={i} style={styles.listItem}>
                    <Text style={[styles.listDot, { color: COLORS.warning }]}>•</Text>
                    <Text style={styles.listText}>{s}</Text>
                  </View>
                ))}
              </Card>

              {/* Advice */}
              <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: COLORS.primary }]}>
                <Text style={styles.cardTitle}>🎯 Lời Khuyên Cho Bạn</Text>
                {primaryStyle?.advice?.map((a, i) => (
                  <View key={i} style={[styles.listItem, styles.adviceItem]}>
                    <Text style={styles.adviceNum}>{i + 1}</Text>
                    <Text style={styles.listText}>{a}</Text>
                  </View>
                ))}
              </Card>

              {/* Export */}
              <Button
                title={`📄 Xuất Báo Cáo PDF (${PDF_COST} credit)`}
                onPress={handleExport}
                variant="outline"
                style={styles.exportBtn}
              />
            </>
          )}

          <Button
            title="Làm lại bài test"
            onPress={() => navigation.replace('ParentingTest')}
            variant="ghost"
            style={styles.redoBtn}
          />

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  resultHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: SPACING.md,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.md,
  },
  backBtnText: { fontSize: 28, color: COLORS.textInverse, lineHeight: 32 },
  balanceBadge: {
    position: 'absolute',
    top: 52,
    right: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  balanceBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '700' },
  resultEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  resultLabel: { ...TYPOGRAPHY.bodySmall, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  resultTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textInverse, marginBottom: 4 },
  resultSubtitle: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.7)' },
  content: { padding: SPACING.lg },
  card: { marginBottom: SPACING.md },
  cardTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  styleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  styleEmoji: { fontSize: 20, width: 28 },
  styleInfo: { flex: 1 },
  styleLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  styleName: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, fontWeight: '500' },
  stylePct: { ...TYPOGRAPHY.bodySmall, fontWeight: '700' },
  styleBarTrack: { height: 8, backgroundColor: COLORS.borderLight, borderRadius: RADIUS.full, overflow: 'hidden' },
  styleBarFill: { height: '100%', borderRadius: RADIUS.full },
  descText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, lineHeight: 24 },
  lockedContainer: { marginBottom: SPACING.md },
  blurredContent: { opacity: 0.2 },
  blurred: {},
  blurredText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  unlockCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: -SPACING.md,
  },
  unlockEmoji: { fontSize: 40, marginBottom: SPACING.sm },
  unlockTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  unlockDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  creditCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  creditCostLabel: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  creditCostValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  creditShort: { ...TYPOGRAPHY.caption, color: COLORS.secondary, width: '100%', textAlign: 'center' },
  unlockBtn: { alignSelf: 'stretch', marginBottom: SPACING.sm },
  buyCreditsLink: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  listDot: { fontSize: 16, color: COLORS.primary, marginTop: 2 },
  listText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
  adviceItem: { alignItems: 'flex-start' },
  adviceNum: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    color: COLORS.textInverse,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '700',
    fontSize: 12,
  },
  exportBtn: { marginBottom: SPACING.md },
  redoBtn: { marginBottom: SPACING.sm },
  bottomPad: { height: SPACING.xl },
});
