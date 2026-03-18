import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { getCompletedTests, getCredits } from '../../utils/storage';

const TEST_CARDS = [
  {
    id: 'parenting',
    title: 'Parenting\nStyle',
    description: 'Discover your parenting style and how it shapes your child',
    emoji: '🧠',
    color: '#6C63FF',
    lightColor: '#E8E6FF',
    questions: 10,
    minutes: 5,
    screen: 'ParentingTest',
  },
  {
    id: 'personality',
    title: "Child's Personality\nby Age",
    description: "Understand your child's personality and development needs at each stage",
    emoji: '🌟',
    color: '#FF6B35',
    lightColor: '#FFF0EB',
    questions: 9,
    minutes: 5,
    screen: 'PersonalityTest',
  },
  {
    id: 'eq',
    title: "Child's EQ\nScore",
    description: "Assess your child's emotional intelligence and social skills",
    emoji: '💝',
    color: '#FF69B4',
    lightColor: '#FFF0F7',
    questions: 15,
    minutes: 8,
    screen: 'EQTest',
  },
];

export default function HomeScreen({ navigation }) {
  const [completedTests, setCompletedTests] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [credits, setCredits] = useState(0);

  const loadData = async () => {
    const [completed, bal] = await Promise.all([getCompletedTests(), getCredits()]);
    setCompletedTests(completed);
    setCredits(bal);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <Text style={styles.greeting}>Hello, Parent! 👋</Text>
              <TouchableOpacity
                style={styles.creditBadge}
                onPress={() => navigation.navigate('IAPScreen', {})}
              >
                <Text style={styles.creditBadgeText}>💎 {credits.toFixed(1)}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.headerTitle}>Mindful Guardian</Text>
            <Text style={styles.headerSubtitle}>
              Understand your family through science-based assessments
            </Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Object.keys(completedTests).length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Total Tests</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>18+</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
        </View>

        {/* Test Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tests For You</Text>
          {TEST_CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.testCard}
              onPress={() => navigation.navigate(card.screen)}
              activeOpacity={0.9}
            >
              <View style={[styles.testCardAccent, { backgroundColor: card.color }]} />
              <View style={styles.testCardContent}>
                <View style={styles.testCardHeader}>
                  <View style={[styles.testEmoji, { backgroundColor: card.lightColor }]}>
                    <Text style={styles.testEmojiText}>{card.emoji}</Text>
                  </View>
                  <View style={styles.testCardBadges}>
                    {completedTests[card.id] && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>✓ Done</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.testCardTitle}>{card.title}</Text>
                <Text style={styles.testCardDesc}>{card.description}</Text>
                <View style={styles.testCardFooter}>
                  <Text style={styles.testCardMeta}>📝 {card.questions} questions</Text>
                  <Text style={styles.testCardMeta}>⏱ ~{card.minutes} min</Text>
                  <View style={[styles.startBtn, { backgroundColor: card.color }]}>
                    <Text style={styles.startBtnText}>
                      {completedTests[card.id] ? 'Redo' : 'Start'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Family Report Banner */}
        <TouchableOpacity
          style={styles.familyBanner}
          onPress={() => navigation.navigate('FamilyReport')}
          activeOpacity={0.9}
        >
          <View style={styles.familyBannerContent}>
            <Text style={styles.familyBannerEmoji}>👨‍👩‍👧‍👦</Text>
            <View style={styles.familyBannerText}>
              <View style={styles.familyBannerRow}>
                <Text style={styles.familyBannerTitle}>Family Report</Text>
                <View style={styles.hotBadge}>
                  <Text style={styles.hotBadgeText}>HOT</Text>
                </View>
              </View>
              <Text style={styles.familyBannerSubtitle}>
                Complete family analysis — only 2 credits
              </Text>
            </View>
            <Text style={styles.familyBannerArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parenting Tips 💡</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>🌱</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Praise effort, not just results</Text>
              <Text style={styles.tipText}>
                Instead of saying "You're so smart!", try "You worked so hard!" — this helps your
                child develop a growth mindset.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    marginBottom: SPACING.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  creditBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  creditBadgeText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textInverse,
    fontWeight: '700',
  },
  greeting: {
    ...TYPOGRAPHY.bodySmall,
    color: 'rgba(255,255,255,0.8)',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textInverse,
    marginBottom: 8,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  testCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    flexDirection: 'row',
    ...SHADOWS.md,
  },
  testCardAccent: {
    width: 6,
  },
  testCardContent: {
    flex: 1,
    padding: SPACING.md,
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  testEmoji: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testEmojiText: {
    fontSize: 24,
  },
  testCardBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  completedBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  completedBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: '600',
  },
  testCardTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: 6,
  },
  testCardDesc: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  testCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testCardMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    flex: 1,
  },
  startBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
  },
  startBtnText: {
    ...TYPOGRAPHY.buttonSmall,
    color: COLORS.textInverse,
  },
  familyBanner: {
    marginHorizontal: SPACING.lg,
    backgroundColor: '#1A1A2E',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  familyBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  familyBannerEmoji: {
    fontSize: 40,
  },
  familyBannerText: {
    flex: 1,
  },
  familyBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  familyBannerTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textInverse,
  },
  hotBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
  familyBannerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: 'rgba(255,255,255,0.7)',
  },
  familyBannerArrow: {
    fontSize: 28,
    color: 'rgba(255,255,255,0.5)',
  },
  tipCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
    ...SHADOWS.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: 4,
  },
  tipText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomPad: {
    height: SPACING.xl,
  },
});
