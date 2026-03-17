import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PARENTING_RESULT: 'parenting_result',
  PERSONALITY_RESULT: 'personality_result',
  EQ_RESULT: 'eq_result',
  PURCHASES: 'purchases',
  USER_PROFILE: 'user_profile',
  COMPLETED_TESTS: 'completed_tests',
};

export const saveTestResult = async (testType, result) => {
  try {
    const key = KEYS[testType.toUpperCase() + '_RESULT'];
    const data = {
      result,
      timestamp: new Date().toISOString(),
      testType,
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('saveTestResult error:', error);
    return false;
  }
};

export const getTestResult = async (testType) => {
  try {
    const key = KEYS[testType.toUpperCase() + '_RESULT'];
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('getTestResult error:', error);
    return null;
  }
};

export const savePurchase = async (productId) => {
  try {
    const existing = await getPurchases();
    const purchases = {
      ...existing,
      [productId]: {
        purchasedAt: new Date().toISOString(),
        productId,
      },
    };
    await AsyncStorage.setItem(KEYS.PURCHASES, JSON.stringify(purchases));
    return true;
  } catch (error) {
    console.error('savePurchase error:', error);
    return false;
  }
};

export const getPurchases = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PURCHASES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('getPurchases error:', error);
    return {};
  }
};

export const hasPurchased = async (productId) => {
  try {
    const purchases = await getPurchases();
    return !!purchases[productId];
  } catch (error) {
    return false;
  }
};

export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('saveUserProfile error:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const markTestCompleted = async (testType) => {
  try {
    const data = await AsyncStorage.getItem(KEYS.COMPLETED_TESTS);
    const completed = data ? JSON.parse(data) : {};
    completed[testType] = new Date().toISOString();
    await AsyncStorage.setItem(KEYS.COMPLETED_TESTS, JSON.stringify(completed));
    return true;
  } catch (error) {
    return false;
  }
};

export const getCompletedTests = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.COMPLETED_TESTS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
};
