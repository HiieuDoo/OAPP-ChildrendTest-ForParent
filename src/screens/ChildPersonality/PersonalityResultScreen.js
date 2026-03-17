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
import { PERSONALITY_TYPES, PERSONALITY_ADVICE_BY_AGE } from '../../data/childPersonalityData';
import { IAP_PRODUCTS } from '../../data/iapProducts';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { hasAccessToResult } from '../../utils/iapService';
import { exportReport } from '../../utils/pdfExport';

export default function PersonalityResultScreen({ route, navigation }) {
  const { result, ageGroup } = route.params;
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const access = await hasAccessToResult('personality');
    setHasAccess(access);
  };

  const handleUnlock = () => {
    navigation.navigate('IAPScreen', {
      product: IAP_PRODUCTS.PERSONALITY_RESULT,
      onSuccess: () => setHasAccess(true),
    });
  };

  const handleExport = async () => {
    const exported = await exportReport({ type: 'personality', result });
    if (!exported.success) Alert.alert('Lỗi', 'Không thể xuất báo cáo.');
  };

  const { primaryType, percentages, primaryTypeId, ageGroupId } = result;
  const ageAdvice = PERSONALITY_ADVICE_BY_AGE[ageGroupId]?.[primaryTypeId];
  const accentColor = primaryType?.color || COLORS.secondary;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: accentColor }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerEmoji}>{primaryType?.emoji || '🌟'}</Text>
          <Text style={styles.headerLabel}>Tính cách của bé</Text>
          <Text style={styles.headerTitle}>{primaryType?.name}</Text>
          <View style={styles.ageTag}>
            <Text style={styles.ageTagText}>
              {ageGroup?.emoji} {ageGroup?.label}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Traits */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Đặc Điểm Nổi Bật</Text>
            <Text style={styles.descText}>{primaryType?.description}</Text>
            <View style={styles.traitsRow}>
              {primaryType?.traits?.map((trait, i) => (
                <View key={i} style={[styles.traitBadge, { backgroundColor: accentColor + '22', borderColor: accentColor }]}>
                  <Text style={[styles.traitText, { color: accentColor }]}>{trait}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Type Distribution */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Phân Tích Tính Cách</Text>
            {Object.entries(percentages || {}).map(([typeId, pct]) => {
              const type = PERSONALITY_TYPES[typeId];
              if (!type) return null;
              return (
                <View key={typeId} style={styles.typeRow}>
                  <Text style={styles.typeEmoji}>{type.emoji}</Text>
                  <View style={styles.typeInfo}>
                    <View style={styles.typeLabelRow}>
                      <Text style={styles.typeName}>{type.name}</Text>
                      <Text style={[styles.typePct, { color: type.color }]}>{pct}%</Text>
                    </View>
                    <View style={styles.typeBarTrack}>
                      <View style={[styles.typeBarFill, { width: `${pct}%`, backgroundColor: type.color }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>

          {/* Locked or Unlocked */}
          {!hasAccess ? (
            <View style={styles.unlockCard}>
              <Text style={styles.unlockEmoji}>🔒</Text>
              <Text style={styles.unlockTitle}>Mở Khóa Lời Khuyên Chuyên Sâu</Text>
              <Text style={styles.unlockDesc}>
                Nhận lời khuyên nuôi dưỡng, hoạt động phù hợp và kế hoạch phát triển theo độ tuổi
              </Text>
              <View style={styles.unlockFeatures}>
                {IAP_PRODUCTS.PERSONALITY_RESULT.features.map((f, i) => (
                  <Text key={i} style={[styles.unlockFeature, { color: accentColor }]}>✓ {f}</Text>
                ))}
              </View>
              <Button
                title={`Mở Khóa - ${IAP_PRODUCTS.PERSONALITY_RESULT.price}`}
                onPress={handleUnlock}
                style={[styles.unlockBtn, { backgroundColor: accentColor }]}
              />
            </View>
          ) : (
            <>
              {ageAdvice && (
                <>
                  <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: accentColor }]}>
                    <Text style={styles.cardTitle}>💡 Lời Khuyên Nuôi Dưỡng</Text>
                    {ageAdvice.tips?.map((tip, i) => (
                      <View key={i} style={styles.listItem}>
                        <Text style={[styles.listDot, { color: accentColor }]}>•</Text>
                        <Text style={styles.listText}>{tip}</Text>
                      </View>
                    ))}
                  </Card>

                  <Card style={styles.card}>
                    <Text style={styles.cardTitle}>🎮 Hoạt Động Phù Hợp</Text>
                    <View style={styles.activitiesRow}>
                      {ageAdvice.activities?.map((act, i) => (
                        <View key={i} style={[styles.activityBadge, { backgroundColor: accentColor + '15' }]}>
                          <Text style={[styles.activityText, { color: accentColor }]}>{act}</Text>
                        </View>
                      ))}
                    </View>
                  </Card>
                </>
              )}

              <Button
                title="📄 Xuất Báo Cáo PDF"
                onPress={handleExport}
                variant="outline"
                style={styles.exportBtn}
              />
            </>
          )}

          <Button
            title="Làm lại bài test"
            onPress={() => navigation.replace('PersonalityTest')}
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
  headerEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  headerLabel: { ...TYPOGRAPHY.bodySmall, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textInverse, marginBottom: 8 },
  ageTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  ageTagText: { ...TYPOGRAPHY.bodySmall, color: COLORS.textInverse, fontWeight: '600' },
  content: { padding: SPACING.lg },
  card: { marginBottom: SPACING.md },
  cardTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  descText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.sm },
  traitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  traitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  traitText: { ...TYPOGRAPHY.caption, fontWeight: '600' },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  typeEmoji: { fontSize: 20, width: 28 },
  typeInfo: { flex: 1 },
  typeLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  typeName: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, fontWeight: '500' },
  typePct: { ...TYPOGRAPHY.bodySmall, fontWeight: '700' },
  typeBarTrack: { height: 8, backgroundColor: COLORS.borderLight, borderRadius: RADIUS.full, overflow: 'hidden' },
  typeBarFill: { height: '100%', borderRadius: RADIUS.full },
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
  unlockBtn: { alignSelf: 'stretch' },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  listDot: { fontSize: 16, marginTop: 2 },
  listText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
  activitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  activityBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  activityText: { ...TYPOGRAPHY.bodySmall, fontWeight: '500' },
  exportBtn: { marginBottom: SPACING.md },
  bottomPad: { height: SPACING.xl },
});
