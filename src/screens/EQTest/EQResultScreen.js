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
import { EQ_DIMENSIONS, EQ_ADVICE } from '../../data/eqTestData';
import { IAP_PRODUCTS } from '../../data/iapProducts';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ScoreRadar from '../../components/ScoreRadar';
import { hasAccessToResult } from '../../utils/iapService';
import { exportReport } from '../../utils/pdfExport';

export default function EQResultScreen({ route, navigation }) {
  const { result } = route.params;
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const access = await hasAccessToResult('eq');
    setHasAccess(access);
  };

  const handleUnlock = () => {
    navigation.navigate('IAPScreen', {
      product: IAP_PRODUCTS.EQ_RESULT,
      onSuccess: () => setHasAccess(true),
    });
  };

  const handleExport = async () => {
    const exported = await exportReport({ type: 'eq', result });
    if (!exported.success) Alert.alert('Lỗi', 'Không thể xuất báo cáo.');
  };

  const { dimensionScores, totalScore, maxTotal, level, percentage } = result;

  const radarScores = Object.values(dimensionScores).map((d) => ({
    emoji: d.emoji,
    score: d.score,
    maxScore: d.maxScore,
  }));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: level?.color || COLORS.primary }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerEmoji}>{level?.emoji}</Text>
          <Text style={styles.headerLabel}>Chỉ số EQ của bé</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNum}>{totalScore}</Text>
            <Text style={styles.scoreMax}>/{maxTotal}</Text>
          </View>
          <Text style={styles.levelName}>{level?.level}</Text>
          <Text style={styles.percentageText}>{percentage}% điểm tối đa</Text>
        </View>

        <View style={styles.content}>
          {/* Radar Chart */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Biểu Đồ EQ</Text>
            <View style={styles.radarContainer}>
              <ScoreRadar scores={radarScores} size={220} />
            </View>
            <View style={styles.radarLegend}>
              {Object.values(dimensionScores).map((d) => (
                <View key={d.id} style={styles.legendItem}>
                  <Text style={styles.legendEmoji}>{d.emoji}</Text>
                  <Text style={styles.legendName}>{d.name}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Dimension Scores */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Chi Tiết Từng Chiều</Text>
            {Object.values(dimensionScores).map((d) => (
              <View key={d.id} style={styles.dimRow}>
                <View style={styles.dimHeader}>
                  <Text style={styles.dimEmoji}>{d.emoji}</Text>
                  <Text style={styles.dimName}>{d.name}</Text>
                  <Text style={[styles.dimScore, { color: d.color }]}>
                    {d.score}/{d.maxScore}
                  </Text>
                </View>
                <View style={styles.dimBarTrack}>
                  <View
                    style={[
                      styles.dimBarFill,
                      { width: `${d.percentage}%`, backgroundColor: d.color },
                    ]}
                  />
                </View>
                <Text style={styles.dimPct}>{d.percentage}%</Text>
              </View>
            ))}
          </Card>

          {/* Locked / Unlocked Content */}
          {!hasAccess ? (
            <View style={styles.unlockCard}>
              <Text style={styles.unlockEmoji}>🔒</Text>
              <Text style={styles.unlockTitle}>Mở Khóa Kế Hoạch Phát Triển EQ</Text>
              <Text style={styles.unlockDesc}>
                Nhận lời khuyên chi tiết và bài tập EQ hàng ngày phù hợp với từng chiều điểm số
              </Text>
              <View style={styles.unlockFeatures}>
                {IAP_PRODUCTS.EQ_RESULT.features.map((f, i) => (
                  <Text key={i} style={[styles.unlockFeature, { color: level?.color }]}>✓ {f}</Text>
                ))}
              </View>
              <Button
                title={`Mở Khóa - ${IAP_PRODUCTS.EQ_RESULT.price}`}
                onPress={handleUnlock}
                style={[styles.unlockBtn, { backgroundColor: level?.color }]}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('IAPScreen', { product: IAP_PRODUCTS.FAMILY_REPORT })}
              >
                <Text style={[styles.bundleLink, { color: level?.color }]}>
                  Hoặc mua Gói Family Report - tiết kiệm hơn ›
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Advice per dimension */}
              {Object.values(dimensionScores).map((d) => {
                const adviceKey = d.percentage >= 60 ? 'high' : 'low';
                const advice = EQ_ADVICE[d.id]?.[adviceKey];
                if (!advice) return null;
                return (
                  <Card key={d.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: d.color }]}>
                    <View style={styles.adviceHeader}>
                      <Text style={styles.dimEmoji}>{d.emoji}</Text>
                      <Text style={[styles.adviceDimName, { color: d.color }]}>{d.name}</Text>
                      <View style={[styles.levelBadge, { backgroundColor: d.color + '22' }]}>
                        <Text style={[styles.levelBadgeText, { color: d.color }]}>
                          {d.percentage >= 60 ? 'Tốt' : 'Cần cải thiện'}
                        </Text>
                      </View>
                    </View>
                    {advice.map((tip, i) => (
                      <View key={i} style={styles.listItem}>
                        <Text style={[styles.listDot, { color: d.color }]}>•</Text>
                        <Text style={styles.listText}>{tip}</Text>
                      </View>
                    ))}
                  </Card>
                );
              })}

              <Button
                title="📄 Xuất Báo Cáo PDF"
                onPress={handleExport}
                variant="outline"
                style={styles.exportBtn}
              />
            </>
          )}

          <Button
            title="Làm lại bài test EQ"
            onPress={() => navigation.replace('EQTest')}
            variant="ghost"
          />
          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
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
  headerEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  headerLabel: { ...TYPOGRAPHY.bodySmall, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.sm },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  scoreNum: { fontSize: 56, fontWeight: '900', color: COLORS.textInverse, lineHeight: 60 },
  scoreMax: { fontSize: 24, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  levelName: { fontSize: 22, fontWeight: '700', color: COLORS.textInverse, marginBottom: 4 },
  percentageText: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.8)' },
  content: { padding: SPACING.lg },
  card: { marginBottom: SPACING.md },
  cardTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  radarContainer: { alignItems: 'center', marginBottom: SPACING.sm },
  radarLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendEmoji: { fontSize: 14 },
  legendName: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  dimRow: { marginBottom: SPACING.sm },
  dimHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  dimEmoji: { fontSize: 20 },
  dimName: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, fontWeight: '500', flex: 1 },
  dimScore: { ...TYPOGRAPHY.bodySmall, fontWeight: '700' },
  dimBarTrack: { height: 8, backgroundColor: COLORS.borderLight, borderRadius: RADIUS.full, overflow: 'hidden' },
  dimBarFill: { height: '100%', borderRadius: RADIUS.full },
  dimPct: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, textAlign: 'right', marginTop: 2 },
  unlockCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.lg,
    marginBottom: SPACING.md,
  },
  unlockEmoji: { fontSize: 40, marginBottom: SPACING.sm },
  unlockTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  unlockDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.md },
  unlockFeatures: { alignSelf: 'stretch', marginBottom: SPACING.md },
  unlockFeature: { ...TYPOGRAPHY.bodySmall, marginBottom: 4, fontWeight: '500' },
  unlockBtn: { alignSelf: 'stretch', marginBottom: SPACING.sm },
  bundleLink: { ...TYPOGRAPHY.bodySmall, textDecorationLine: 'underline' },
  adviceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.sm },
  adviceDimName: { ...TYPOGRAPHY.h4, flex: 1 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  levelBadgeText: { ...TYPOGRAPHY.caption, fontWeight: '600' },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  listDot: { fontSize: 16, marginTop: 2 },
  listText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
  exportBtn: { marginBottom: SPACING.md },
  bottomPad: { height: SPACING.xl },
});
