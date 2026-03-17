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
import { IAP_PRODUCTS } from '../../data/iapProducts';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { hasAccessToResult } from '../../utils/iapService';
import { exportReport } from '../../utils/pdfExport';

export default function ParentingResultScreen({ route, navigation }) {
  const { result } = route.params;
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const access = await hasAccessToResult('parenting');
    setHasAccess(access);
    setCheckingAccess(false);
  };

  const handleUnlock = () => {
    navigation.navigate('IAPScreen', {
      product: IAP_PRODUCTS.PARENTING_RESULT,
      onSuccess: () => {
        setHasAccess(true);
      },
    });
  };

  const handleExport = async () => {
    const exported = await exportReport({
      type: 'parenting',
      result,
    });
    if (!exported.success) {
      Alert.alert('Lỗi', 'Không thể xuất báo cáo. Vui lòng thử lại.');
    }
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
              <View style={styles.lockOverlay} />
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
                <View style={styles.unlockFeatures}>
                  {IAP_PRODUCTS.PARENTING_RESULT.features.map((f, i) => (
                    <Text key={i} style={styles.unlockFeature}>
                      ✓ {f}
                    </Text>
                  ))}
                </View>
                <Button
                  title={`Mở Khóa - ${IAP_PRODUCTS.PARENTING_RESULT.price}`}
                  onPress={handleUnlock}
                  style={styles.unlockBtn}
                />
                <TouchableOpacity onPress={() => navigation.navigate('IAPScreen', { product: IAP_PRODUCTS.FAMILY_REPORT })}>
                  <Text style={styles.bundleLink}>Hoặc mua Gói Family Report - tiết kiệm hơn ›</Text>
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
                title="📄 Xuất Báo Cáo PDF"
                onPress={handleExport}
                variant="outline"
                style={styles.exportBtn}
              />
            </>
          )}

          {/* Redo */}
          <Button
            title="Làm lại bài test"
            onPress={() => {
              navigation.replace('ParentingTest');
            }}
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
  resultEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  resultLabel: { ...TYPOGRAPHY.bodySmall, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  resultTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textInverse, marginBottom: 4 },
  resultSubtitle: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.7)' },
  content: { padding: SPACING.lg },
  card: { marginBottom: SPACING.md },
  cardTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  styleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  styleEmoji: { fontSize: 20, width: 28 },
  styleInfo: { flex: 1 },
  styleLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  styleName: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, fontWeight: '500' },
  stylePct: { ...TYPOGRAPHY.bodySmall, fontWeight: '700' },
  styleBarTrack: {
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
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
  unlockDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.md },
  unlockFeatures: { alignSelf: 'stretch', marginBottom: SPACING.md },
  unlockFeature: { ...TYPOGRAPHY.bodySmall, color: COLORS.primary, marginBottom: 4, fontWeight: '500' },
  unlockBtn: { alignSelf: 'stretch', marginBottom: SPACING.sm },
  bundleLink: { ...TYPOGRAPHY.bodySmall, color: COLORS.primary, textDecorationLine: 'underline' },
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
  lockOverlay: {},
});
