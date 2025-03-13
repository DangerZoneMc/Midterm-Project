import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

export default function ClaimScreen() {
  const { itemId } = useLocalSearchParams();
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [proofOfOwnership, setProofOfOwnership] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!studentId.trim()) {
      Alert.alert('Error', 'Please enter your student ID');
      return false;
    }
    if (!contactNumber.trim()) {
      Alert.alert('Error', 'Please enter your contact number');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!proofOfOwnership.trim()) {
      Alert.alert('Error', 'Please provide proof of ownership');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      // First find the item to make sure it exists and is still unclaimed
      const allItems = await StorageService.getAllItems();
      const itemToClaim = allItems.find(item => item.id === itemId);
      
      if (!itemToClaim) {
        Alert.alert('Error', 'Item not found. It may have been deleted.');
        return;
      }
      
      if (itemToClaim.status !== 'found') {
        Alert.alert('Error', 'This item is no longer available for claiming.');
        return;
      }

      await StorageService.updateItem(itemId, {
        status: 'claimed',
        claimInfo: {
          fullName,
          studentId,
          contactNumber,
          email,
          proofOfOwnership,
          dateClaimed: new Date().toISOString(),
        },
      }, 'found');

      Alert.alert(
        'Success',
        'Your claim has been submitted successfully. The Lost and Found office will contact you for verification.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/items'),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting claim:', error);
      Alert.alert('Error', 'Failed to submit claim. Please try again.');
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
            <ThemedText style={styles.title}>Claim Form</ThemedText>
            <ThemedText style={styles.description}>
              Please fill in your information to claim this item. The Lost and Found office will verify your claim.
            </ThemedText>

            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
            />

            <ThemedText style={styles.label}>Student ID</ThemedText>
            <TextInput
              style={styles.input}
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Enter your student ID"
              placeholderTextColor="#666"
            />

            <ThemedText style={styles.label}>Contact Number</ThemedText>
            <TextInput
              style={styles.input}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Enter your contact number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            <ThemedText style={styles.label}>Email Address</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <ThemedText style={styles.label}>Proof of Ownership</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={proofOfOwnership}
              onChangeText={setProofOfOwnership}
              placeholder="Describe specific details about the item that prove your ownership"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity 
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={submitting}
            >
              <ThemedText style={styles.submitButtonText}>
                {submitting ? 'Submitting...' : 'Submit Claim'}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
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
  submitButton: {
    backgroundColor: '#007AFF',
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