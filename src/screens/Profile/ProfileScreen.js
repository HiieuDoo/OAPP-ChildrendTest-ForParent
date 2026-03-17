import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { getCompletedTests, getPurchases, clearAllData } from '../../utils/storage';

export default function ProfileScreen({ navigation }) {
  const [completedTests, setCompletedTests] = useState({});
  const [purchases, setPurchases] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const [tests, purch] = await Promise.all([getCompletedTests(), getPurchases()]);
    setCompletedTests(tests);
    setPurchases(purch);
  };

  const handleClearData = () => {
    Alert.alert(
      'Xóa tất cả dữ liệu?',
      'Tất cả kết quả test và giao dịch sẽ bị xóa. Không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            loadData();
            Alert.alert('Đã xóa', 'Tất cả dữ liệu đã được xóa.');
          },
        },
      ]
    );
  };

  const testNames = {
    parenting: { name: 'Phong Cách Nuôi Dạy', emoji: '🧠', screen: 'ParentingTest' },
    personality: { name: 'Tính Cách Con', emoji: '🌟', screen: 'PersonalityTest' },
    eq: { name: 'Chỉ Số EQ', emoji: '💝', screen: 'EQTest' },
  };

  const purchaseNames = {
    parenting_result_unlock: '🧠 Kết quả Phong Cách',
    personality_result_unlock: '🌟 Kết quả Tính Cách',
    eq_result_unlock: '💝 Kết quả EQ',
    family_report_bundle: '👨‍👩‍👧‍👦 Family Report',
    export_pdf: '📄 Xuất PDF',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài Khoản</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>👨‍👩‍👧</Text>
          <Text style={styles.profileName}>Phụ Huynh KidsParent</Text>
          <Text style={styles.profileSub}>Đang đồng hành cùng sự phát triển của con</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{Object.keys(completedTests).length}</Text>
              <Text style={styles.statLabel}>Test hoàn thành</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{Object.keys(purchases).length}</Text>
              <Text style={styles.statLabel}>Đã mua</Text>
            </View>
          </View>
        </View>

        {/* Completed Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch Sử Bài Test</Text>
          {Object.keys(completedTests).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyText}>Chưa hoàn thành bài test nào</Text>
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
                      {new Date(date).toLocaleDateString('vi-VN')}
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
          <Text style={styles.sectionTitle}>Giao Dịch Của Bạn</Text>
          {Object.keys(purchases).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💳</Text>
              <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('IAPScreen', { product: null })}
              >
                <Text style={styles.shopLink}>Xem sản phẩm ›</Text>
              </TouchableOpacity>
            </View>
          ) : (
            Object.entries(purchases).map(([productId, data]) => (
              <View key={productId} style={styles.purchaseItem}>
                <Text style={styles.purchaseEmoji}>✓</Text>
                <View style={styles.purchaseInfo}>
                  <Text style={styles.purchaseName}>{purchaseNames[productId] || productId}</Text>
                  <Text style={styles.purchaseDate}>
                    {new Date(data.purchasedAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài Đặt</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('IAPScreen', { product: null })}
          >
            <Text style={styles.settingEmoji}>🔄</Text>
            <Text style={styles.settingText}>Khôi phục giao dịch</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <Text style={styles.settingEmoji}>🗑️</Text>
            <Text style={[styles.settingText, { color: COLORS.secondary }]}>Xóa tất cả dữ liệu</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.appName}>KidsParent - Hiểu Con Hơn</Text>
          <Text style={styles.version}>Phiên bản 1.0.0</Text>
          <Text style={styles.aboutText}>
            App hoạt động hoàn toàn offline. Dữ liệu được lưu trên thiết bị của bạn.
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
  profileSub: { ...TYPOGRAPHY.bodySmall, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.md, textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.lg,
    alignItems: 'center',
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '800', color: COLORS.textInverse },
  statLabel: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
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
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.success + '44',
  },
  purchaseEmoji: { fontSize: 18, color: COLORS.success, fontWeight: '700' },
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
  aboutSection: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  appName: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: 4 },
  version: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginBottom: 8 },
  aboutText: { ...TYPOGRAPHY.bodySmall, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  bottomPad: { height: SPACING.xl },
});
