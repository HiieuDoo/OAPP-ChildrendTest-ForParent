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
import { CREDIT_COSTS } from '../../data/iapProducts';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { hasAccessToResult, unlockWithCredits, getBalance } from '../../utils/iapService';
import { exportReport } from '../../utils/pdfExport';
import { spendCredits } from '../../utils/storage';

const COST = CREDIT_COSTS.PERSONALITY_RESULT;
const PDF_COST = CREDIT_COSTS.EXPORT_PDF;

export default function PersonalityResultScreen({ route, navigation }) {
  const { result, ageGroup } = route.params;
  const [hasAccess, setHasAccess] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const [access, bal] = await Promise.all([hasAccessToResult('personality'), getBalance()]);
    setHasAccess(access);
    setBalance(bal);
  };

  const handleUnlock = async () => {
    if (balance < COST) {
      Alert.alert(
        'Not enough credits 💎',
        `Need ${COST} credits to view result.\nBalance: ${balance.toFixed(1)} credits`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy credits',
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
      'Confirm unlock',
      `Use ${COST} credits to view Child Personality result?\nBalance: ${balance.toFixed(1)} credits`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const success = await unlockWithCredits('personality', COST);
            if (success) {
              await checkAccess();
            } else {
              Alert.alert('Error', 'Unable to unlock. Please try again.');
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
        'Not enough credits',
        `Need ${PDF_COST} credits to export PDF.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy credits',
            onPress: () => navigation.navigate('IAPScreen', { requiredCredits: PDF_COST }),
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Confirm export',
      `Use ${PDF_COST} credits to export PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            const spent = await spendCredits(PDF_COST);
            if (!spent) { Alert.alert('Error', 'Not enough credits.'); return; }
            const exported = await exportReport({ type: 'personality', result });
            await checkAccess();
            if (!exported.success) {
              Alert.alert('Export failed', exported.error || 'Unable to export report. Please try again.');
            }
          },
        },
      ]
    );
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
          <TouchableOpacity
            style={styles.balanceBadge}
            onPress={() => navigation.navigate('IAPScreen', {})}
          >
            <Text style={styles.balanceBadgeText}>💎 {balance.toFixed(1)}</Text>
          </TouchableOpacity>
          <Text style={styles.headerEmoji}>{primaryType?.emoji || '🌟'}</Text>
          <Text style={styles.headerLabel}>Your child's personality</Text>
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
            <Text style={styles.cardTitle}>Key Traits</Text>
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
            <Text style={styles.cardTitle}>Personality Analysis</Text>
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
              <Text style={styles.unlockTitle}>Unlock In-Depth Advice</Text>
              <Text style={styles.unlockDesc}>
                Get parenting tips, recommended activities, and an age-based development plan
              </Text>
              <View style={styles.creditCostRow}>
                <Text style={styles.creditCostLabel}>Cost:</Text>
                <Text style={[styles.creditCostValue, { color: accentColor }]}>💎 {COST} credit</Text>
                {balance < COST && (
                  <Text style={styles.creditShort}>
                    (Need {(COST - balance).toFixed(1)} more credits)
                  </Text>
                )}
              </View>
              <Button
                title={`Unlock Now — ${COST} Credit`}
                onPress={handleUnlock}
                style={[styles.unlockBtn, { backgroundColor: accentColor }]}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('IAPScreen', { requiredCredits: COST })}
              >
                <Text style={[styles.buyCreditsLink, { color: accentColor }]}>Buy credits ›</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {ageAdvice && (
                <>
                  <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: accentColor }]}>
                    <Text style={styles.cardTitle}>💡 Parenting Tips</Text>
                    {ageAdvice.tips?.map((tip, i) => (
                      <View key={i} style={styles.listItem}>
                        <Text style={[styles.listDot, { color: accentColor }]}>•</Text>
                        <Text style={styles.listText}>{tip}</Text>
                      </View>
                    ))}
                  </Card>

                  <Card style={styles.card}>
                    <Text style={styles.cardTitle}>🎮 Recommended Activities</Text>
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
                title={`📄 Export PDF Report (${PDF_COST} credit)`}
                onPress={handleExport}
                variant="outline"
                style={styles.exportBtn}
              />
            </>
          )}

          <Button
            title="Retake test"
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
  traitBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1 },
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
  creditCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  creditCostLabel: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  creditCostValue: { fontSize: 18, fontWeight: '800' },
  creditShort: { ...TYPOGRAPHY.caption, color: COLORS.secondary, width: '100%', textAlign: 'center' },
  unlockBtn: { alignSelf: 'stretch', marginBottom: SPACING.sm },
  buyCreditsLink: { ...TYPOGRAPHY.bodySmall, textDecorationLine: 'underline' },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  listDot: { fontSize: 16, marginTop: 2 },
  listText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
  activitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  activityBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  activityText: { ...TYPOGRAPHY.bodySmall, fontWeight: '500' },
  exportBtn: { marginBottom: SPACING.md },
  bottomPad: { height: SPACING.xl },
});
