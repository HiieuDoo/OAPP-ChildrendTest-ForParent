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
import { CREDIT_PACKAGES, CREDIT_COSTS } from '../../data/iapProducts';
import { purchaseCredits, getBalance } from '../../utils/iapService';

export default function IAPScreen({ route, navigation }) {
  const { onSuccess, requiredCredits } = route.params || {};
  const [purchasing, setPurchasing] = useState(null); // packageId being purchased
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    const b = await getBalance();
    setBalance(b);
  };

  const handlePurchase = async (pkg) => {
    setPurchasing(pkg.id);
    try {
      await purchaseCredits(
        pkg.id,
        pkg.credits,
        async ({ credits, newBalance }) => {
          setPurchasing(null);
          setBalance(newBalance);
          Alert.alert(
            'Credits added! 💎',
            `Added ${credits} credits.\nNew balance: ${newBalance} credits`,
            [
              {
                text: 'Continue',
                onPress: () => {
                  if (onSuccess) onSuccess(newBalance);
                  if (requiredCredits && newBalance >= requiredCredits) {
                    navigation.goBack();
                  }
                },
              },
            ]
          );
        },
        () => {
          setPurchasing(null);
          Alert.alert('Error', 'Transaction failed. Please try again.');
        }
      );
    } catch (e) {
      setPurchasing(null);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Credits</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceIcon}>💎</Text>
            <Text style={styles.balanceNum}>{balance.toFixed(1)}</Text>
            <Text style={styles.balanceUnit}>credit</Text>
          </View>
          {requiredCredits && balance < requiredCredits && (
            <View style={styles.alertBadge}>
              <Text style={styles.alertText}>
                Need {(requiredCredits - balance).toFixed(1)} more credits to unlock
              </Text>
            </View>
          )}
        </View>

        {/* Credit Usage Guide */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>💡 What are credits used for?</Text>
          <View style={styles.guideList}>
            <View style={styles.guideItem}>
              <Text style={styles.guideEmoji}>🧠</Text>
              <Text style={styles.guideText}>View Parenting Style result</Text>
              <Text style={styles.guideCost}>{CREDIT_COSTS.PARENTING_RESULT} credit</Text>
            </View>
            <View style={styles.guideItem}>
              <Text style={styles.guideEmoji}>🌟</Text>
              <Text style={styles.guideText}>View Child Personality result</Text>
              <Text style={styles.guideCost}>{CREDIT_COSTS.PERSONALITY_RESULT} credit</Text>
            </View>
            <View style={styles.guideItem}>
              <Text style={styles.guideEmoji}>💝</Text>
              <Text style={styles.guideText}>View EQ Score result</Text>
              <Text style={styles.guideCost}>{CREDIT_COSTS.EQ_RESULT} credit</Text>
            </View>
            <View style={[styles.guideItem, styles.guideItemHighlight]}>
              <Text style={styles.guideEmoji}>👨‍👩‍👧‍👦</Text>
              <Text style={[styles.guideText, { fontWeight: '600' }]}>Family Report</Text>
              <Text style={[styles.guideCost, { color: COLORS.secondary }]}>
                {CREDIT_COSTS.FAMILY_REPORT} credits
              </Text>
            </View>
            <View style={styles.guideItem}>
              <Text style={styles.guideEmoji}>📄</Text>
              <Text style={styles.guideText}>Export PDF report</Text>
              <Text style={styles.guideCost}>{CREDIT_COSTS.EXPORT_PDF} credit</Text>
            </View>
          </View>
        </View>

        {/* Credit Packages */}
        <Text style={styles.sectionTitle}>Choose a Package</Text>

        {CREDIT_PACKAGES.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            style={[
              styles.packageCard,
              pkg.badge === 'POPULAR' && styles.packageCardPopular,
              pkg.badge === 'BEST VALUE' && styles.packageCardBest,
            ]}
            onPress={() => handlePurchase(pkg)}
            disabled={!!purchasing}
            activeOpacity={0.85}
          >
            {pkg.badge && (
              <View
                style={[
                  styles.packageBadge,
                  { backgroundColor: pkg.badge === 'BEST VALUE' ? COLORS.warning : COLORS.secondary },
                ]}
              >
                <Text style={styles.packageBadgeText}>{pkg.badge}</Text>
              </View>
            )}
            <View style={styles.packageLeft}>
              <View style={[styles.packageIconBg, { backgroundColor: pkg.color + '22' }]}>
                <Text style={styles.packageIcon}>💎</Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={[styles.packageCredits, { color: pkg.color }]}>
                  {pkg.credits} Credit{pkg.credits > 1 ? 's' : ''}
                </Text>
                <Text style={styles.packageId}>{pkg.id}</Text>
              </View>
            </View>
            <View style={styles.packageRight}>
              {purchasing === pkg.id ? (
                <ActivityIndicator size="small" color={pkg.color} />
              ) : (
                <View style={[styles.priceBtn, { backgroundColor: pkg.color }]}>
                  <Text style={styles.priceBtnText}>{pkg.priceUSD}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Legal */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            • Credits never expire — use anytime{'\n'}
            • Secure payment via App Store / Google Play{'\n'}
            • No refunds once credits have been used{'\n'}
            • $0.20 USD per credit
          </Text>
          <TouchableOpacity>
            <Text style={styles.restoreText}>Restore purchases</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
  },
  closeBtnText: { fontSize: 16, color: COLORS.textSecondary },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, flex: 1, textAlign: 'center' },
  content: { flex: 1, padding: SPACING.lg },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  balanceLabel: { ...TYPOGRAPHY.bodySmall, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balanceIcon: { fontSize: 32 },
  balanceNum: { fontSize: 48, fontWeight: '900', color: COLORS.textInverse },
  balanceUnit: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.8)', marginTop: 12 },
  alertBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    marginTop: SPACING.sm,
  },
  alertText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, textAlign: 'center' },
  guideCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  guideTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  guideList: { gap: 8 },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  guideItemHighlight: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    borderBottomWidth: 0,
    marginVertical: 2,
  },
  guideEmoji: { fontSize: 18, width: 26 },
  guideText: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, flex: 1 },
  guideCost: { ...TYPOGRAPHY.bodySmall, color: COLORS.primary, fontWeight: '700' },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  packageCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
    position: 'relative',
    overflow: 'visible',
  },
  packageCardPopular: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  packageCardBest: {
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
  packageBadge: {
    position: 'absolute',
    top: -10,
    right: SPACING.md,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  packageBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '800' },
  packageLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  packageIconBg: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageIcon: { fontSize: 22 },
  packageInfo: { flex: 1 },
  packageCredits: { fontSize: 18, fontWeight: '800' },
  packageId: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginTop: 2 },
  packageRight: { alignItems: 'flex-end' },
  priceBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  priceBtnText: { ...TYPOGRAPHY.bodySmall, color: COLORS.textInverse, fontWeight: '700' },
  legalSection: {
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  legalText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, lineHeight: 20 },
  restoreText: { ...TYPOGRAPHY.caption, color: COLORS.primary, textDecorationLine: 'underline' },
  bottomPad: { height: SPACING.xl },
});
