import { addCredits, spendCredits, getCredits, savePurchase, saveUnlockedResult, isResultUnlocked } from './storage';

// Credit-based IAP service
// In production: integrate with expo-in-app-purchases / react-native-iap

let isInitialized = false;

export const initIAP = async () => {
  try {
    // TODO: replace with real IAP initialization for native build
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('IAP init error:', error);
    return false;
  }
};

export const disconnectIAP = async () => {
  try {
    isInitialized = false;
  } catch (error) {
    console.error('Disconnect IAP error:', error);
  }
};

// Purchase a credit package (adds credits to balance)
export const purchaseCredits = async (packageId, credits, onSuccess, onError) => {
  try {
    // Simulate IAP flow — replace with real store purchase in production
    const newBalance = await addCredits(credits);
    await savePurchase(packageId); // Log transaction history

    if (onSuccess) onSuccess({ credits, newBalance });
    return { success: true, credits, newBalance };
  } catch (error) {
    console.error('Purchase credits error:', error);
    if (onError) onError(error);
    return { success: false, error };
  }
};

// Get current credit balance
export const getBalance = async () => {
  return await getCredits();
};

// Check if user has enough credits
export const hasEnoughCredits = async (cost) => {
  const balance = await getCredits();
  return balance >= cost;
};

// Spend credits to unlock a result
export const unlockWithCredits = async (resultType, cost) => {
  const spent = await spendCredits(cost);
  if (spent) {
    await saveUnlockedResult(resultType);
    return true;
  }
  return false;
};

// Check if a result is unlocked (paid)
export const hasAccessToResult = async (resultType) => {
  return await isResultUnlocked(resultType);
};

export const restorePurchases = async () => {
  try {
    // In production: restore from store purchase history
    return { success: true, restored: [] };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error };
  }
};
