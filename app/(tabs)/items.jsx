import MaterialIcons from '@expo/vector-icons/MaterialIcons';
<<<<<<< HEAD
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
=======
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
>>>>>>> origin/master
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { StorageService } from '../services/storage';

const CATEGORIES = [
  'All',
  'Devices',
  'ID Cards',
  'Bags',
  'Books',
  'Keys',
  'Clothing',
  'Accessories',
  'Others'
];

export default function ItemsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

=======
>>>>>>> origin/master
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const allItems = await StorageService.getAllItems();
      setItems(allItems);
    } catch (error) {
      console.error('Error loading items:', error);
<<<<<<< HEAD
      Alert.alert(
        'Error',
        'Failed to load items. Please try again.',
        [{ text: 'Retry', onPress: () => loadItems() }]
      );
=======
>>>>>>> origin/master
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
<<<<<<< HEAD
              setLoading(true);
              await StorageService.deleteItem(item.id, item.status);
              await loadItems();
              Alert.alert('Success', 'Item deleted successfully');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert(
                'Error',
                'Failed to delete item. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setLoading(false);
=======
              await StorageService.deleteItem(item.id, item.status);
              loadItems(); // Refresh the list
              Alert.alert('Success', 'Item deleted successfully');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item. Please try again.');
>>>>>>> origin/master
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAction = (item) => {
    if (item.status === 'missing') {
      // For missing items - mark as found
      Alert.alert(
        'Mark as Found',
        'Have you found this item?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => {
              try {
<<<<<<< HEAD
                setLoading(true);
                await StorageService.updateItem(item.id, { status: 'found' }, 'missing');
                await loadItems();
                Alert.alert('Success', 'Item marked as found');
              } catch (error) {
                console.error('Error updating item:', error);
                if (error.message.includes('Storage is full')) {
                  Alert.alert(
                    'Storage Full',
                    'Please delete some old items to free up space.',
                    [{ text: 'OK' }]
                  );
                } else {
                  Alert.alert('Error', error.message || 'Failed to update item. Please try again.');
                }
              } finally {
                setLoading(false);
=======
                await StorageService.updateItem(item.id, { status: 'found' }, 'missing');
                loadItems(); // Refresh the list
                Alert.alert('Success', 'Item marked as found');
              } catch (error) {
                console.error('Error updating item:', error);
                Alert.alert('Error', 'Failed to update item. Please try again.');
>>>>>>> origin/master
              }
            },
          },
        ],
        { cancelable: true }
      );
<<<<<<< HEAD
    } else if (item.status === 'found') {
      // For found items - check if item can be claimed first
      StorageService.getFoundItems().then(foundItems => {
        const itemExists = foundItems.some(i => i.id === item.id);
        if (!itemExists) {
          Alert.alert('Error', 'This item is no longer available for claiming.');
          loadItems();
          return;
        }
        // Navigate to claim form if item is available
        router.push({
          pathname: '/(tabs)/claim',
          params: { itemId: item.id }
        });
      }).catch(error => {
        console.error('Error checking item status:', error);
        Alert.alert(
          'Error',
          'Unable to verify item status. Please try again.',
          [{ text: 'Retry', onPress: () => handleAction(item) }]
        );
      });
    } else if (item.status === 'claimed') {
      // For claimed items - show claim info
      Alert.alert(
        'Item Claimed',
        'This item has already been claimed.',
        [{ text: 'OK' }]
      );
=======
    } else {
      // For found items - navigate to USC
      router.push('/usc');
>>>>>>> origin/master
    }
  };

  const filteredItems = items.filter(item => {
<<<<<<< HEAD
    const matchesSearch = (item.itemName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
=======
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
>>>>>>> origin/master
    const matchesCategory = selectedCategory === 'All' || item.selectedCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity style={styles.itemContent}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        )}
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemName}>{item.itemName}</ThemedText>
          <ThemedText style={styles.itemCategory}>{item.selectedCategory}</ThemedText>
          <ThemedText style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </ThemedText>
          <View style={styles.itemMeta}>
<<<<<<< HEAD
            <ThemedText style={[
              styles.itemStatus, 
              item.status === 'found' ? styles.statusFound : 
              item.status === 'claimed' ? styles.statusClaimed : 
              styles.statusMissing
            ]}>
=======
            <ThemedText style={[styles.itemStatus, item.status === 'found' ? styles.statusFound : styles.statusMissing]}>
>>>>>>> origin/master
              {item.status.toUpperCase()}
            </ThemedText>
            <ThemedText style={styles.itemDate}>
              {new Date(item.dateReported).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.itemActions}>
<<<<<<< HEAD
        {(item.status === 'found' || item.status === 'claimed' || item.status === 'missing') && (
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              item.status === 'found' ? styles.unclaimedButton : 
              item.status === 'claimed' ? styles.claimedButton :
              styles.foundButton
            ]} 
            onPress={() => handleAction(item)}
            disabled={item.status === 'claimed'}
          >
            <MaterialIcons 
              name={
                item.status === 'found' ? "person-outline" : 
                item.status === 'claimed' ? "check-circle" :
                "check"
              } 
              size={20} 
              color={
                item.status === 'found' ? "#007AFF" : 
                item.status === 'claimed' ? "#8E8E93" :
                "#34C759"
              } 
            />
            <ThemedText style={[
              styles.actionButtonText,
              { color: 
                item.status === 'found' ? "#007AFF" : 
                item.status === 'claimed' ? "#8E8E93" :
                "#34C759" 
              }
            ]}>
              {item.status === 'found' ? 'Unclaimed' : 
               item.status === 'claimed' ? 'Claimed' :
               'Mark as Found'}
            </ThemedText>
          </TouchableOpacity>
        )}
=======
        <TouchableOpacity 
          style={[styles.actionButton, item.status === 'found' ? styles.unclaimedButton : styles.foundButton]} 
          onPress={() => handleAction(item)}
        >
          <MaterialIcons 
            name={item.status === 'found' ? "person-outline" : "check-circle"} 
            size={20} 
            color={item.status === 'found' ? "#007AFF" : "#34C759"} 
          />
          <ThemedText style={[
            styles.actionButtonText,
            { color: item.status === 'found' ? "#007AFF" : "#34C759" }
          ]}>
            {item.status === 'found' ? 'Unclaimed' : 'Found'}
          </ThemedText>
        </TouchableOpacity>
>>>>>>> origin/master
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDelete(item)}
        >
          <MaterialIcons name="delete" size={20} color="#FF3B30" />
<<<<<<< HEAD
          <ThemedText style={[styles.actionButtonText, { color: "#FF3B30" }]}>
            Delete
          </ThemedText>
=======
>>>>>>> origin/master
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lost and found items..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={24} color="#666" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
<<<<<<< HEAD
          {CATEGORIES.map((category, index) => (
            <TouchableOpacity
              key={`category-${index}-${category}`}
=======
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
>>>>>>> origin/master
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}
              >
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="search-off" size={64} color="#666" style={styles.emptyIcon} />
          <ThemedText style={styles.emptyText}>No items found</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            {searchQuery || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filters'
              : 'Items that are reported lost or found will appear here'}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#000',
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryContainer: {
    paddingVertical: 4,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
  },
  listContent: {
    paddingBottom: 16,
    gap: 16,
  },
  itemCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusFound: {
    backgroundColor: '#34C759',
    color: '#FFFFFF',
  },
  statusMissing: {
    backgroundColor: '#FF3B30',
    color: '#FFFFFF',
  },
<<<<<<< HEAD
  statusClaimed: {
    backgroundColor: '#8E8E93',
    color: '#FFFFFF',
  },
=======
>>>>>>> origin/master
  itemDate: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  unclaimedButton: {
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  foundButton: {
    backgroundColor: 'rgba(52,199,89,0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255,59,48,0.1)',
  },
<<<<<<< HEAD
  claimedButton: {
    backgroundColor: 'rgba(142,142,147,0.1)',
  },
=======
>>>>>>> origin/master
}); 