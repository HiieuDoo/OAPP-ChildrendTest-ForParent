import {
  initConnection,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';
import { addCredits, spendCredits, getCredits, savePurchase, saveUnlockedResult, isResultUnlocked } from './storage';
import { CREDIT_PACKAGES } from '../data/iapProducts';

let isInitialized = false;

// ─── Error Code Mapping ────────────────────────────────────────────────────────

const mapPurchaseError = (error) => {
  const code = (error?.code || '').toString();
  const msg = (error?.message || '').toLowerCase();

  if (
    code === 'E_USER_CANCELLED' ||
    msg.includes('cancel') ||
    msg.includes('user cancelled') ||
    error?.responseCode === 1 // BILLING_RESPONSE_RESULT_USER_CANCELED
  ) {
    return { cancelled: true, message: 'Purchase cancelled.' };
  }

  if (code === 'E_BILLING_UNAVAILABLE' || error?.responseCode === 3) {
    return {
      cancelled: false,
      message:
        'Google Play billing is unavailable.\nMake sure you are signed in to a Google account with a valid payment method.',
    };
  }

  if (code === 'E_ITEM_UNAVAILABLE' || error?.responseCode === 4) {
    return {
      cancelled: false,
      message:
        'This product is not available yet.\nMake sure the app is published on Google Play and the product is active.',
    };
  }

  if (code === 'E_NETWORK_ERROR' || msg.includes('network')) {
    return {
      cancelled: false,
      message: 'Network error. Please check your internet connection and try again.',
    };
  }

  if (code === 'E_SERVICE_ERROR' || error?.responseCode === 6) {
    return {
      cancelled: false,
      message: 'Google Play Store service error. Please try again later.',
    };
  }

  if (code === 'E_ALREADY_OWNED') {
    return {
      cancelled: false,
      message: 'You already own this item. Try restoring purchases.',
    };
  }

  if (code === 'E_DEVELOPER_ERROR' || error?.responseCode === 5) {
    return {
      cancelled: false,
      message:
        'App configuration error (developer error). Please contact support.',
    };
  }

  return {
    cancelled: false,
    message: error?.message || 'Purchase failed. Please try again.',
  };
};

// ─── Init ──────────────────────────────────────────────────────────────────────

export const initIAP = async () => {
  try {
    await initConnection();
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('IAP init error:', error);
    return false;
  }
};

export const disconnectIAP = async () => {
  isInitialized = false;
};

// ─── Load Products From Store ─────────────────────────────────────────────────

export const loadStoreProducts = async () => {
  try {
    if (!isInitialized) await initIAP();
    const skus = CREDIT_PACKAGES.map((p) => p.id);
    const products = await fetchProducts({ skus });
    return products;
  } catch (error) {
    console.error('loadStoreProducts error:', error);
    return [];
  }
};

// ─── Purchase Credits ─────────────────────────────────────────────────────────

export const purchaseCredits = async (packageId, credits, onSuccess, onError) => {
  try {
    if (!isInitialized) {
      const ok = await initIAP();
      if (!ok) {
        const msg =
          'Unable to connect to Google Play.\nPlease check your internet connection and Google account setup.';
        if (onError) onError({ message: msg });
        return { success: false, error: msg };
      }
    }

    // Must fetch product from store before requesting purchase
    let products = [];
    let getProductsError = null;
    try {
      products = await fetchProducts({ skus: [packageId] });
    } catch (e) {
      console.error('getProducts error full:', JSON.stringify(e), e);
      getProductsError = e;
    }

    if (!products || products.length === 0) {
      const errName = getProductsError?.name || '';
      const errCode = getProductsError?.code || getProductsError?.responseCode || 'N/A';
      const errMsg = getProductsError?.message || 'N/A';
      const errExtra = getProductsError
        ? (() => { try { return JSON.stringify(getProductsError); } catch (_) { return ''; } })()
        : '';
      const debugInfo = getProductsError
        ? `\n\n[Debug] SKU: ${packageId}\nType: ${errName}\nCode: ${errCode}\nMessage: ${errMsg}\nDetails: ${errExtra}`
        : `\n\n[Debug] SKU: ${packageId}\ngetProducts returned empty list`;
      const msg =
        'Product not found on Google Play.\nMake sure the app is published and the product is ACTIVE on Play Console.' +
        debugInfo;
      if (onError) onError({ message: msg });
      return { success: false, error: msg };
    }

    return new Promise((resolve) => {
      let purchaseSub;
      let errorSub;
      let settled = false;

      const settle = (result) => {
        if (settled) return;
        settled = true;
        if (purchaseSub) purchaseSub.remove();
        if (errorSub) errorSub.remove();
        resolve(result);
      };

      purchaseSub = purchaseUpdatedListener(async (purchase) => {
        if (purchase.productId !== packageId) return;
        try {
          await finishTransaction({ purchase, isConsumable: true });
          const newBalance = await addCredits(credits);
          await savePurchase(packageId);
          if (onSuccess) onSuccess({ credits, newBalance });
          settle({ success: true, credits, newBalance });
        } catch (e) {
          const { message } = mapPurchaseError(e);
          if (onError) onError({ message });
          settle({ success: false, error: message });
        }
      });

      errorSub = purchaseErrorListener((error) => {
        const { cancelled, message } = mapPurchaseError(error);
        if (!cancelled && onError) onError({ message });
        settle({ success: false, cancelled, error: message });
      });

      requestPurchase({ request: { android: { skus: [packageId] }, apple: { sku: packageId } } }).catch((e) => {
        const { cancelled, message } = mapPurchaseError(e);
        if (!cancelled && onError) onError({ message });
        settle({ success: false, cancelled, error: message });
      });
    });
  } catch (error) {
    console.error('purchaseCredits error:', error);
    const { cancelled, message } = mapPurchaseError(error);
    if (!cancelled && onError) onError({ message });
    return { success: false, cancelled, error: message };
  }
};

// ─── Credit Helpers ────────────────────────────────────────────────────────────

export const getBalance = async () => {
  return await getCredits();
};

export const hasEnoughCredits = async (cost) => {
  const balance = await getCredits();
  return balance >= cost;
};

export const unlockWithCredits = async (resultType, cost) => {
  const spent = await spendCredits(cost);
  if (spent) {
    await saveUnlockedResult(resultType);
    return true;
  }
  return false;
};

export const hasAccessToResult = async (resultType) => {
  return await isResultUnlocked(resultType);
};

// ─── Restore Purchases ────────────────────────────────────────────────────────

export const restorePurchases = async () => {
  try {
    // react-native-iap: getAvailablePurchases fetches past non-consumable purchases
    // Consumable credits cannot be restored — this is expected Google Play behavior
    return { success: true, restored: [] };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error };
  }
};
