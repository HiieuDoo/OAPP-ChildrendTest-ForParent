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
import { getCompletedTests, getPurchases, clearAllData, getCredits } from '../../utils/storage';

const APP_NAME = 'Mindful Guardian';

export default function ProfileScreen({ navigation }) {
  const [completedTests, setCompletedTests] = useState({});
  const [purchases, setPurchases] = useState({});
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const [tests, purch, bal] = await Promise.all([
      getCompletedTests(),
      getPurchases(),
      getCredits(),
    ]);
    setCompletedTests(tests);
    setPurchases(purch);
    setCredits(bal);
  };

  const handleClearData = () => {
    Alert.alert(
      'Delete all data?',
      'All test results, credits, and transactions will be deleted. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            loadData();
            Alert.alert('Deleted', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const testNames = {
    parenting: { name: 'Parenting Style', emoji: '🧠', screen: 'ParentingTest' },
    personality: { name: 'Child Personality', emoji: '🌟', screen: 'PersonalityTest' },
    eq: { name: 'EQ Score', emoji: '💝', screen: 'EQTest' },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>👨‍👩‍👧</Text>
          <Text style={styles.profileName}>{APP_NAME} Parent</Text>
          <Text style={styles.profileSub}>Supporting your child's growth journey</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{Object.keys(completedTests).length}</Text>
              <Text style={styles.statLabel}>Tests Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{credits.toFixed(1)}</Text>
              <Text style={styles.statLabel}>💎 Credits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{Object.keys(purchases).length}</Text>
              <Text style={styles.statLabel}>Purchases</Text>
            </View>
          </View>
        </View>

        {/* Credit Balance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Credits</Text>
          <TouchableOpacity
            style={styles.creditCard}
            onPress={() => navigation.navigate('IAPScreen', {})}
            activeOpacity={0.85}
          >
            <View style={styles.creditLeft}>
              <Text style={styles.creditEmoji}>💎</Text>
              <View>
                <Text style={styles.creditBalance}>{credits.toFixed(1)} Credits</Text>
                <Text style={styles.creditSub}>Use to unlock results & export reports</Text>
              </View>
            </View>
            <View style={styles.creditBtn}>
              <Text style={styles.creditBtnText}>Top Up</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Completed Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test History</Text>
          {Object.keys(completedTests).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyText}>No tests completed yet</Text>
            </View>
          ) : (
            Object.entries(completedTests).map(([testId, date]) => {
              const info = testNames[testId];
              if (!info) return null;
              return (
                <TouchableOpacity
                  key={testId}
                  style={styles.testItem}
                  onPress={() => navigation.navigate(info.screen)}
                >
                  <Text style={styles.testItemEmoji}>{info.emoji}</Text>
                  <View style={styles.testItemInfo}>
                    <Text style={styles.testItemName}>{info.name}</Text>
                    <Text style={styles.testItemDate}>
                      {new Date(date).toLocaleDateString('en-US')}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Purchases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credit History</Text>
          {Object.keys(purchases).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💳</Text>
              <Text style={styles.emptyText}>No purchases yet</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('IAPScreen', {})}
              >
                <Text style={styles.shopLink}>Buy credits ›</Text>
              </TouchableOpacity>
            </View>
          ) : (
            Object.entries(purchases).map(([productId, data]) => (
              <View key={productId} style={styles.purchaseItem}>
                <Text style={styles.purchaseEmoji}>💎</Text>
                <View style={styles.purchaseInfo}>
                  <Text style={styles.purchaseName}>{productId}</Text>
                  <Text style={styles.purchaseDate}>
                    {new Date(data.purchasedAt).toLocaleDateString('en-US')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('IAPScreen', {})}
          >
            <Text style={styles.settingEmoji}>🔄</Text>
            <Text style={styles.settingText}>Restore purchases</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <Text style={styles.settingEmoji}>🗑️</Text>
            <Text style={[styles.settingText, { color: COLORS.secondary }]}>Delete all data</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.version}>Version 2.0.0</Text>
          <Text style={styles.aboutText}>
            Helping parents understand their family's psychology better.{'\n'}
            All data is stored locally on your device.
          </Text>
        </View>

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
  },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.text },
  profileCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  profileEmoji: { fontSize: 56, marginBottom: SPACING.sm },
  profileName: { ...TYPOGRAPHY.h3, color: COLORS.textInverse, marginBottom: 4 },
  profileSub: {
    ...TYPOGRAPHY.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse },
  statLabel: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  creditCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.sm,
    borderWidth: 2,
    borderColor: COLORS.primary + '44',
  },
  creditLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  creditEmoji: { fontSize: 32 },
  creditBalance: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  creditSub: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 2 },
  creditBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  creditBtnText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '700' },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  emptyEmoji: { fontSize: 36, marginBottom: SPACING.sm },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center' },
  shopLink: { ...TYPOGRAPHY.body, color: COLORS.primary, marginTop: SPACING.sm, fontWeight: '600' },
  testItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  testItemEmoji: { fontSize: 24 },
  testItemInfo: { flex: 1 },
  testItemName: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, fontWeight: '600' },
  testItemDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 2 },
  chevron: { fontSize: 20, color: COLORS.textMuted },
  purchaseItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '33',
    ...SHADOWS.sm,
  },
  purchaseEmoji: { fontSize: 18 },
  purchaseInfo: { flex: 1 },
  purchaseName: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, fontWeight: '600' },
  purchaseDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 2 },
  settingItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  settingEmoji: { fontSize: 20 },
  settingText: { ...TYPOGRAPHY.body, color: COLORS.text, flex: 1 },
  aboutSection: { padding: SPACING.lg, alignItems: 'center' },
  appName: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: 4 },
  version: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginBottom: 8 },
  aboutText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPad: { height: SPACING.xl },
});
