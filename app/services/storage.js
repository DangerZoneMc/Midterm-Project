import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  MISSING_ITEMS: '@lost_and_found/missing_items',
  FOUND_ITEMS: '@lost_and_found/found_items',
  CLAIMED_ITEMS: '@lost_and_found/claimed_items',
};

const MAX_ITEMS_PER_CATEGORY = 50; // Reduced from 100 to 50
const CLEANUP_THRESHOLD = 40; // Reduced from 90 to 40

export const StorageService = {
  // Optimize item data before storing
  optimizeItemData: (item) => {
    // Remove any undefined or null values
    const optimized = Object.entries(item).reduce((acc, [key, value]) => {
      if (value != null) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // If image is too large (data URL), store only the first 100 chars
    if (optimized.image && optimized.image.length > 100) {
      optimized.image = optimized.image.substring(0, 100);
    }

    // Trim long text fields
    if (optimized.description && optimized.description.length > 500) {
      optimized.description = optimized.description.substring(0, 500);
    }
    if (optimized.itemName && optimized.itemName.length > 100) {
      optimized.itemName = optimized.itemName.substring(0, 100);
    }

    return optimized;
  },

  // Helper function to cleanup old items
  cleanupOldItems: async (items, maxItems) => {
    if (items.length > maxItems) {
      // Sort by date and keep only the most recent items
      const sortedItems = items
        .sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported))
        .slice(0, maxItems)
        .map(item => StorageService.optimizeItemData(item));
      return sortedItems;
    }
    return items.map(item => StorageService.optimizeItemData(item));
  },

  // Force cleanup of all storage
  forceCleanup: async () => {
    try {
      const [missingItems, foundItems, claimedItems] = await Promise.all([
        StorageService.getMissingItems(),
        StorageService.getFoundItems(),
        AsyncStorage.getItem(STORAGE_KEYS.CLAIMED_ITEMS).then(items => items ? JSON.parse(items) : [])
      ]);

      // Clean up each category
      const [cleanedMissing, cleanedFound, cleanedClaimed] = await Promise.all([
        StorageService.cleanupOldItems(missingItems, MAX_ITEMS_PER_CATEGORY),
        StorageService.cleanupOldItems(foundItems, MAX_ITEMS_PER_CATEGORY),
        StorageService.cleanupOldItems(claimedItems, MAX_ITEMS_PER_CATEGORY)
      ]);

      // Save cleaned data
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.MISSING_ITEMS, JSON.stringify(cleanedMissing)),
        AsyncStorage.setItem(STORAGE_KEYS.FOUND_ITEMS, JSON.stringify(cleanedFound)),
        AsyncStorage.setItem(STORAGE_KEYS.CLAIMED_ITEMS, JSON.stringify(cleanedClaimed))
      ]);

      return true;
    } catch (error) {
      console.error('Error during force cleanup:', error);
      return false;
    }
  },

  // Save a missing item
  saveMissingItem: async (item) => {
    try {
      // Try to save normally first
      const existingItems = await StorageService.getMissingItems();
      const optimizedItem = StorageService.optimizeItemData({
        ...item,
        id: Date.now().toString(),
        status: 'missing',
        dateReported: new Date().toISOString(),
      });

      // If we're at the limit, remove oldest items
      let updatedItems = existingItems;
      if (existingItems.length >= MAX_ITEMS_PER_CATEGORY) {
        updatedItems = existingItems
          .sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported))
          .slice(0, MAX_ITEMS_PER_CATEGORY - 1);
      }

      try {
        // Try to save
        await AsyncStorage.setItem(
          STORAGE_KEYS.MISSING_ITEMS, 
          JSON.stringify([optimizedItem, ...updatedItems])
        );
        return optimizedItem;
      } catch (storageError) {
        // If failed, try force cleanup and save again
        await StorageService.forceCleanup();
        await AsyncStorage.setItem(
          STORAGE_KEYS.MISSING_ITEMS, 
          JSON.stringify([optimizedItem, ...updatedItems])
        );
        return optimizedItem;
      }
    } catch (error) {
      console.error('Error saving missing item:', error);
      throw new Error('Unable to save item. Storage might be full.');
    }
  },

  // Save a found item
  saveFoundItem: async (item) => {
    try {
      // Try to save normally first
      const existingItems = await StorageService.getFoundItems();
      const optimizedItem = StorageService.optimizeItemData({
        ...item,
        id: Date.now().toString(),
        status: 'found',
        dateReported: new Date().toISOString(),
      });

      // If we're at the limit, remove oldest items
      let updatedItems = existingItems;
      if (existingItems.length >= MAX_ITEMS_PER_CATEGORY) {
        updatedItems = existingItems
          .sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported))
          .slice(0, MAX_ITEMS_PER_CATEGORY - 1);
      }

      try {
        // Try to save
        await AsyncStorage.setItem(
          STORAGE_KEYS.FOUND_ITEMS, 
          JSON.stringify([optimizedItem, ...updatedItems])
        );
        return optimizedItem;
      } catch (storageError) {
        // If failed, try force cleanup and save again
        await StorageService.forceCleanup();
        await AsyncStorage.setItem(
          STORAGE_KEYS.FOUND_ITEMS, 
          JSON.stringify([optimizedItem, ...updatedItems])
        );
        return optimizedItem;
      }
    } catch (error) {
      console.error('Error saving found item:', error);
      throw new Error('Unable to save item. Storage might be full.');
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

  // Get all items (missing, found, and claimed)
  getAllItems: async () => {
    try {
      const [missingItems, foundItems, claimedItems] = await Promise.all([
        StorageService.getMissingItems(),
        StorageService.getFoundItems(),
        AsyncStorage.getItem(STORAGE_KEYS.CLAIMED_ITEMS).then(items => items ? JSON.parse(items) : []),
      ]);
      return [...missingItems, ...foundItems, ...claimedItems].sort((a, b) => 
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
      // For marking an item as found
      if (updatedData.status === 'found' && status === 'missing') {
        // Get items from both lists
        const missingItems = await StorageService.getMissingItems();
        const foundItems = await StorageService.getFoundItems();

        // Find the item to mark as found
        const itemToMarkFound = missingItems.find(item => item.id === itemId);
        if (!itemToMarkFound) {
          throw new Error('Item not found in missing items');
        }

        // Create the found item
        const foundItem = StorageService.optimizeItemData({
          ...itemToMarkFound,
          status: 'found',
          dateUpdated: new Date().toISOString(),
          dateFound: new Date().toISOString()
        });

        // Remove from missing items
        const updatedMissingItems = missingItems.filter(item => item.id !== itemId);

        // Add to found items (at the beginning)
        const updatedFoundItems = [foundItem, ...foundItems];

        // If found items exceed limit, remove oldest
        const finalFoundItems = updatedFoundItems.length > MAX_ITEMS_PER_CATEGORY
          ? updatedFoundItems.slice(0, MAX_ITEMS_PER_CATEGORY)
          : updatedFoundItems;

        // Update both storages
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.MISSING_ITEMS, JSON.stringify(updatedMissingItems)),
          AsyncStorage.setItem(STORAGE_KEYS.FOUND_ITEMS, JSON.stringify(finalFoundItems))
        ]);

        return foundItem;
      }
      
      // For claiming an item
      if (updatedData.status === 'claimed' && status === 'found') {
        // Get all items to ensure we have the latest data
        const foundItems = await StorageService.getFoundItems();
        const claimedItemsStr = await AsyncStorage.getItem(STORAGE_KEYS.CLAIMED_ITEMS);
        const claimedItems = claimedItemsStr ? JSON.parse(claimedItemsStr) : [];

        // Check if item exists in found items
        const itemToClaim = foundItems.find(item => item.id === itemId);
        if (!itemToClaim) {
          throw new Error('Item not found in found items');
        }

        // Check if already claimed
        if (claimedItems.some(item => item.id === itemId)) {
          throw new Error('Item is already claimed');
        }

        // Remove from found items
        const updatedFoundItems = foundItems.filter(item => item.id !== itemId);
        
        // Create claimed item with all necessary data
        const claimedItem = StorageService.optimizeItemData({ 
          ...itemToClaim,
          status: 'claimed',
          claimInfo: updatedData.claimInfo || {},
          dateUpdated: new Date().toISOString(),
          dateClaimed: new Date().toISOString()
        });

        // Update storages
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.FOUND_ITEMS, JSON.stringify(updatedFoundItems)),
          AsyncStorage.setItem(STORAGE_KEYS.CLAIMED_ITEMS, JSON.stringify([...claimedItems, claimedItem]))
        ]);
        
        return claimedItem;
      }
      
      // For other updates
      const storageKey = status === 'missing' ? 
        STORAGE_KEYS.MISSING_ITEMS : 
        status === 'found' ? 
        STORAGE_KEYS.FOUND_ITEMS :
        STORAGE_KEYS.CLAIMED_ITEMS;

      const items = await AsyncStorage.getItem(storageKey);
      const parsedItems = items ? JSON.parse(items) : [];
      
      // Check if item exists
      const existingItem = parsedItems.find(item => item.id === itemId);
      if (!existingItem) {
        throw new Error(`Item not found in ${status} items`);
      }

      // Update the item
      const updatedItem = StorageService.optimizeItemData({
        ...existingItem,
        ...updatedData,
        dateUpdated: new Date().toISOString()
      });

      const updatedItems = parsedItems.map(item => 
        item.id === itemId ? updatedItem : item
      );
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedItems));
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete an item
  deleteItem: async (itemId, status) => {
    try {
      const storageKey = status === 'missing' ? 
        STORAGE_KEYS.MISSING_ITEMS : 
        status === 'found' ? 
        STORAGE_KEYS.FOUND_ITEMS :
        STORAGE_KEYS.CLAIMED_ITEMS;
        
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
        STORAGE_KEYS.CLAIMED_ITEMS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
}; 