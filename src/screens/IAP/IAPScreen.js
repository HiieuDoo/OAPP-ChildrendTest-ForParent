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
import { IAP_PRODUCTS } from '../../data/iapProducts';
import Button from '../../components/Button';
import { purchaseProduct, checkPurchase } from '../../utils/iapService';

export default function IAPScreen({ route, navigation }) {
  const { product, onSuccess } = route.params || {};
  const [purchasing, setPurchasing] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  useEffect(() => {
    if (product?.id) {
      checkPurchase(product.id).then(setAlreadyPurchased);
    }
  }, [product]);

  const handlePurchase = async (selectedProduct) => {
    setPurchasing(true);
    try {
      const result = await purchaseProduct(
        selectedProduct.id,
        () => {
          setPurchasing(false);
          Alert.alert('Thành công! 🎉', 'Cảm ơn bạn đã mua. Nội dung đã được mở khóa!', [
            {
              text: 'Xem ngay',
              onPress: () => {
                if (onSuccess) onSuccess();
                navigation.goBack();
              },
            },
          ]);
        },
        (err) => {
          setPurchasing(false);
          Alert.alert('Lỗi', 'Giao dịch không thành công. Vui lòng thử lại.');
        }
      );
    } catch (e) {
      setPurchasing(false);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra.');
    }
  };

  const displayProduct = product || IAP_PRODUCTS.FAMILY_REPORT;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mở Khóa Nội Dung</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Main Product */}
        <View style={[styles.productCard, { borderColor: displayProduct.color }]}>
          {displayProduct.badge && (
            <View style={[styles.badge, { backgroundColor: COLORS.secondary }]}>
              <Text style={styles.badgeText}>{displayProduct.badge}</Text>
            </View>
          )}
          <Text style={styles.productEmoji}>{displayProduct.icon}</Text>
          <Text style={styles.productName}>{displayProduct.name}</Text>
          <Text style={styles.productDesc}>{displayProduct.description}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: displayProduct.color }]}>{displayProduct.price}</Text>
            <Text style={styles.priceSub}>một lần</Text>
          </View>
          <View style={styles.featuresList}>
            {displayProduct.features.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <Text style={[styles.featureCheck, { color: displayProduct.color }]}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {alreadyPurchased ? (
            <View style={[styles.purchasedBtn, { backgroundColor: COLORS.successLight }]}>
              <Text style={[styles.purchasedBtnText, { color: COLORS.success }]}>✓ Đã mua</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.buyBtn, { backgroundColor: displayProduct.color }]}
              onPress={() => handlePurchase(displayProduct)}
              disabled={purchasing}
              activeOpacity={0.85}
            >
              {purchasing ? (
                <ActivityIndicator color={COLORS.textInverse} />
              ) : (
                <Text style={styles.buyBtnText}>Mua ngay - {displayProduct.price}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Other Products */}
        <Text style={styles.otherTitle}>Sản Phẩm Khác</Text>
        {Object.values(IAP_PRODUCTS)
          .filter((p) => p.id !== displayProduct.id)
          .map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.otherCard}
              onPress={() => navigation.replace('IAPScreen', { product: p, onSuccess })}
              activeOpacity={0.8}
            >
              <View style={[styles.otherIcon, { backgroundColor: p.color + '22' }]}>
                <Text style={styles.otherIconText}>{p.icon}</Text>
              </View>
              <View style={styles.otherInfo}>
                <Text style={styles.otherName}>{p.name}</Text>
                <Text style={styles.otherDesc} numberOfLines={1}>{p.description}</Text>
              </View>
              <Text style={[styles.otherPrice, { color: p.color }]}>{p.price}</Text>
            </TouchableOpacity>
          ))}

        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            • Thanh toán một lần, không tự động gia hạn{'\n'}
            • Kết quả được lưu trên thiết bị của bạn{'\n'}
            • Không cần kết nối internet sau khi mua
          </Text>
          <TouchableOpacity>
            <Text style={styles.restoreText}>Khôi phục giao dịch</Text>
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
  productCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
    position: 'relative',
    overflow: 'visible',
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: SPACING.md,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '800' },
  productEmoji: { fontSize: 56, marginBottom: SPACING.sm },
  productName: { ...TYPOGRAPHY.h3, color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  productDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: SPACING.md },
  price: { fontSize: 32, fontWeight: '800' },
  priceSub: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  featuresList: { alignSelf: 'stretch', marginBottom: SPACING.lg },
  featureItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  featureCheck: { fontWeight: '700', fontSize: 16 },
  featureText: { ...TYPOGRAPHY.body, color: COLORS.text, flex: 1, lineHeight: 22 },
  buyBtn: {
    alignSelf: 'stretch',
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  buyBtnText: { ...TYPOGRAPHY.button, color: COLORS.textInverse },
  purchasedBtn: {
    alignSelf: 'stretch',
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  purchasedBtnText: { ...TYPOGRAPHY.button },
  otherTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  otherCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  otherIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherIconText: { fontSize: 22 },
  otherInfo: { flex: 1 },
  otherName: { ...TYPOGRAPHY.bodySmall, color: COLORS.text, fontWeight: '600' },
  otherDesc: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 2 },
  otherPrice: { ...TYPOGRAPHY.bodySmall, fontWeight: '700' },
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
