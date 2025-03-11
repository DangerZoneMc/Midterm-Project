import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  MISSING_ITEMS: '@lost_and_found/missing_items',
  FOUND_ITEMS: '@lost_and_found/found_items',
};

export const StorageService = {
  // Save a missing item
  saveMissingItem: async (item) => {
    try {
      const existingItems = await StorageService.getMissingItems();
      const newItem = {
        ...item,
        id: Date.now().toString(),
        status: 'missing',
        dateReported: new Date().toISOString(),
      };
      const updatedItems = [...existingItems, newItem];
      await AsyncStorage.setItem(STORAGE_KEYS.MISSING_ITEMS, JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error('Error saving missing item:', error);
      throw error;
    }
  },

  // Save a found item
  saveFoundItem: async (item) => {
    try {
      const existingItems = await StorageService.getFoundItems();
      const newItem = {
        ...item,
        id: Date.now().toString(),
        status: 'found',
        dateReported: new Date().toISOString(),
      };
      const updatedItems = [...existingItems, newItem];
      await AsyncStorage.setItem(STORAGE_KEYS.FOUND_ITEMS, JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error('Error saving found item:', error);
      throw error;
    }
  },

  // Get all missing items
  getMissingItems: async () => {
    try {
      const items = await AsyncStorage.getItem(STORAGE_KEYS.MISSING_ITEMS);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error getting missing items:', error);
      return [];
    }
  },

  // Get all found items
  getFoundItems: async () => {
    try {
      const items = await AsyncStorage.getItem(STORAGE_KEYS.FOUND_ITEMS);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error getting found items:', error);
      return [];
    }
  },

  // Get all items (both missing and found)
  getAllItems: async () => {
    try {
      const [missingItems, foundItems] = await Promise.all([
        StorageService.getMissingItems(),
        StorageService.getFoundItems(),
      ]);
      return [...missingItems, ...foundItems].sort((a, b) => 
        new Date(b.dateReported) - new Date(a.dateReported)
      );
    } catch (error) {
      console.error('Error getting all items:', error);
      return [];
    }
  },

  // Update an item
  updateItem: async (itemId, updatedData, status) => {
    try {
      const storageKey = status === 'missing' ? 
        STORAGE_KEYS.MISSING_ITEMS : STORAGE_KEYS.FOUND_ITEMS;
      const items = await AsyncStorage.getItem(storageKey);
      const parsedItems = items ? JSON.parse(items) : [];
      
      const updatedItems = parsedItems.map(item => 
        item.id === itemId ? { ...item, ...updatedData } : item
      );
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedItems));
      return updatedItems.find(item => item.id === itemId);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete an item
  deleteItem: async (itemId, status) => {
    try {
      const storageKey = status === 'missing' ? 
        STORAGE_KEYS.MISSING_ITEMS : STORAGE_KEYS.FOUND_ITEMS;
      const items = await AsyncStorage.getItem(storageKey);
      const parsedItems = items ? JSON.parse(items) : [];
      
      const updatedItems = parsedItems.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  // Clear all data (for testing/development)
  clearAll: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.MISSING_ITEMS,
        STORAGE_KEYS.FOUND_ITEMS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
}; 