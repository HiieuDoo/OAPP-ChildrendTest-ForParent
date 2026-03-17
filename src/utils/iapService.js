import { savePurchase, hasPurchased } from './storage';

// Mock IAP service - replace with expo-in-app-purchases in production
// expo-in-app-purchases requires native build

let isInitialized = false;

export const initIAP = async () => {
  try {
    // In production with native build, initialize expo-in-app-purchases here
    // const { connectAsync } = await import('expo-in-app-purchases');
    // await connectAsync();
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('IAP init error:', error);
    return false;
  }
};

export const getProducts = async (productIds) => {
  // In production, fetch real products from store
  // const { getProductsAsync } = await import('expo-in-app-purchases');
  // return await getProductsAsync(productIds);
  return productIds.map((id) => ({ productId: id, available: true }));
};

export const purchaseProduct = async (productId, onSuccess, onError) => {
  try {
    // Simulate IAP flow
    // In production:
    // const { purchaseItemAsync } = await import('expo-in-app-purchases');
    // await purchaseItemAsync(productId);

    // For development/testing - simulate purchase dialog
    await savePurchase(productId);

    if (onSuccess) onSuccess(productId);
    return { success: true, productId };
  } catch (error) {
    console.error('Purchase error:', error);
    if (onError) onError(error);
    return { success: false, error };
  }
};

export const restorePurchases = async () => {
  try {
    // In production:
    // const { getPurchaseHistoryAsync } = await import('expo-in-app-purchases');
    // const history = await getPurchaseHistoryAsync();
    // Restore from history
    return { success: true, restored: [] };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error };
  }
};

export const checkPurchase = async (productId) => {
  return await hasPurchased(productId);
};

export const disconnectIAP = async () => {
  try {
    // const { disconnectAsync } = await import('expo-in-app-purchases');
    // await disconnectAsync();
    isInitialized = false;
  } catch (error) {
    console.error('Disconnect IAP error:', error);
  }
};

// Check if Family Report bundle grants access
export const hasAccessToResult = async (resultType) => {
  const familyBundle = await hasPurchased('family_report_bundle');
  if (familyBundle) return true;

  const specificProduct = await hasPurchased(`${resultType}_result_unlock`);
  return specificProduct;
};
