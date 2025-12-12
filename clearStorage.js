// Utility script to clear AsyncStorage data
const AsyncStorage = require('@react-native-async-storage/async-storage');

async function clearAuthStorage() {
  try {
    console.log('Clearing auth storage...');
    await AsyncStorage.removeItem('auth-store');
    console.log('Auth storage cleared successfully');
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
}

clearAuthStorage();