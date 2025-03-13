import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
  'Devices',
  'ID Cards',
  'Bags',
  'Books',
  'Keys',
  'Clothing',
  'Accessories',
  'Others'
];

export default function ItemFoundScreen() {
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter the item name');
      return false;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter where you found the item');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await StorageService.saveFoundItem({
        itemName,
        selectedCategory,
        description,
        location,
        image,
      });

      Alert.alert(
        'Success',
        'Thank you for reporting a found item!',
        [
          {
            text: 'View Items',
            onPress: () => router.replace('/(tabs)/items'),
          },
          {
            text: 'Report Another',
            onPress: () => {
              setItemName('');
              setSelectedCategory('');
              setDescription('');
              setLocation('');
              setImage(null);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting found item:', error);
      Alert.alert('Error', 'Failed to submit found item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formSection}>
            <ThemedText style={styles.label}>Item Name</ThemedText>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Enter the item name"
              placeholderTextColor="#666"
            />

            <ThemedText style={styles.label}>Category</ThemedText>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContainer}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
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

            <ThemedText style={styles.label}>Where did you find it?</ThemedText>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter the location where you found the item"
              placeholderTextColor="#666"
            />

            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide additional details about the item"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />

            <ThemedText style={styles.label}>Upload Image</ThemedText>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons name="add-photo-alternate" size={32} color="#666" />
                  <ThemedText style={styles.uploadText}>Add Photo</ThemedText>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={submitting}
            >
              <ThemedText style={styles.submitButtonText}>
                {submitting ? 'Submitting...' : 'Submit Found Item'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formSection: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  imageUpload: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  submitButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 