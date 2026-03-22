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
        'Not enough credits 💎',
        `You need ${FAMILY_COST} credits to view the family report.\nBalance: ${balance.toFixed(1)} credits`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy credits',
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
      'Confirm unlock',
      `Use ${FAMILY_COST} credits to view the Family Report?\nBalance: ${balance.toFixed(1)} credits`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setUnlocking(true);
            const success = await unlockWithCredits('family', FAMILY_COST);
            if (success) {
              await loadData();
              Alert.alert('Unlocked! 🎉', 'Family report is now active!');
            } else {
              Alert.alert('Error', 'Unable to unlock. Please try again.');
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
        'Not enough credits',
        `Need ${CREDIT_COSTS.EXPORT_PDF} credits to export PDF.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy credits',
            onPress: () => navigation.navigate('IAPScreen', { requiredCredits: CREDIT_COSTS.EXPORT_PDF }),
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Confirm export',
      `Use ${CREDIT_COSTS.EXPORT_PDF} credits to export PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            setExporting(true);
            const exported = await exportReport({ type: 'family', result: results });
            setExporting(false);
            if (!exported.success && !exported.cancelled) {
              Alert.alert('Export failed', exported.error || 'Unable to export report. Please try again.');
              return;
            }
            if (!exported.cancelled) {
              const { spendCredits } = await import('../../utils/storage');
              const spent = await spendCredits(CREDIT_COSTS.EXPORT_PDF);
              await loadData();
              if (!spent) Alert.alert('Warning', 'Export succeeded but credits could not be deducted. Please contact support.');
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
        <Text style={styles.headerTitle}>Family Report</Text>
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
          <Text style={styles.bannerTitle}>Complete Family Report</Text>
          <Text style={styles.bannerDesc}>
            Combined analysis from all 3 tests for a deeper understanding of your family
          </Text>
          {hasAccess ? (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>✓ Activated</Text>
            </View>
          ) : (
            <View style={styles.costBadge}>
              <Text style={styles.costBadgeText}>💎 {FAMILY_COST} credit</Text>
            </View>
          )}
        </View>

        {/* Test Progress */}
        <Text style={styles.sectionTitle}>Test Progress ({completedCount}/3)</Text>

        {[
          { key: 'parenting', name: 'Parenting Style', emoji: '🧠', color: COLORS.primary, screen: 'ParentingTest' },
          { key: 'personality', name: 'Child Personality', emoji: '🌟', color: '#FF6B35', screen: 'PersonalityTest' },
          { key: 'eq', name: 'EQ Score', emoji: '💝', color: '#FF69B4', screen: 'EQTest' },
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
                  {hasResult ? '✓ Completed' : '○ Not done'}
                </Text>
              </View>
              {!hasResult && (
                <View style={[styles.doBtn, { backgroundColor: test.color }]}>
                  <Text style={styles.doBtnText}>Start</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Content */}
        {hasAccess ? (
          <>
            <Text style={styles.sectionTitle}>Family Report</Text>

            {results.parenting && (
              <View style={[styles.resultCard, { borderLeftColor: COLORS.primary }]}>
                <Text style={styles.resultCardTitle}>
                  🧠 Style: {results.parenting.result?.primaryStyle?.name}
                </Text>
                <Text style={styles.resultCardDesc}>
                  {results.parenting.result?.primaryStyle?.description}
                </Text>
              </View>
            )}

            {results.personality && (
              <View style={[styles.resultCard, { borderLeftColor: '#FF6B35' }]}>
                <Text style={styles.resultCardTitle}>
                  🌟 Child personality: {results.personality.result?.primaryType?.name}
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
                  Emotional intelligence level: {results.eq.result?.percentage}% of maximum
                </Text>
              </View>
            )}

            {completedCount === 3 && (
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>🔍 Family Insight</Text>
                <Text style={styles.insightText}>
                  Based on all 3 tests, your parenting style is{' '}
                  <Text style={styles.bold}>{results.parenting?.result?.primaryStyle?.name}</Text> — well matched
                  with your child's{' '}
                  <Text style={styles.bold}>{results.personality?.result?.primaryType?.name}</Text> personality.
                  Their EQ level of{' '}
                  <Text style={styles.bold}>{results.eq?.result?.level?.level}</Text> shows healthy emotional development.
                </Text>
              </View>
            )}

            <Button
              title={exporting ? 'Exporting...' : `📄 Export PDF (${CREDIT_COSTS.EXPORT_PDF} credit)`}
              onPress={handleExportFamily}
              style={styles.exportBtn}
              disabled={exporting}
            />
          </>
        ) : (
          <View style={styles.lockedCard}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.lockTitle}>Unlock Family Report</Text>
            <Text style={styles.lockDesc}>
              Use {FAMILY_COST} credits to view the complete combined analysis from all 3 tests
            </Text>
            <View style={styles.lockFeatures}>
              {[
                'All 3 test results',
                'Parent-child compatibility analysis',
                'Family communication tips',
                'Full PDF report export',
              ].map((f, i) => (
                <View key={i} style={styles.lockFeatureItem}>
                  <Text style={styles.lockFeatureCheck}>✓</Text>
                  <Text style={styles.lockFeatureText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Cost:</Text>
              <Text style={styles.costValue}>💎 {FAMILY_COST} credits</Text>
              {balance < FAMILY_COST && (
                <Text style={styles.costShort}>
                  (Need {(FAMILY_COST - balance).toFixed(1)} more credits)
                </Text>
              )}
            </View>
            <Button
              title={unlocking ? 'Unlocking...' : `Unlock Now — ${FAMILY_COST} Credits`}
              onPress={handleUnlock}
              disabled={unlocking}
              style={{ backgroundColor: '#4ECDC4' }}
            />
            {balance < FAMILY_COST && (
              <TouchableOpacity
                onPress={() => navigation.navigate('IAPScreen', { requiredCredits: FAMILY_COST })}
              >
                <Text style={styles.buyCreditsLink}>Buy more credits ›</Text>
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
