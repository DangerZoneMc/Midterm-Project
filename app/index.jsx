import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const handleEnterPress = () => {
    router.replace('/(tabs)/items');
  };

  const handleReportPress = () => {
    router.push('/(tabs)/missingitem');
  };

  const handleFoundPress = () => {
    router.push('/(tabs)/itemfound');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <ThemedView style={styles.container}>
        <View style={styles.headerSection}>
          <Image
            source={require('@/assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Lost and Found</ThemedText>
            <View style={styles.descriptionContainer}>
              <ThemedText style={styles.description}>
                Welcome to the University Lost and Found System. This platform helps students, faculty, and staff locate their missing items or report found items across campus. Our goal is to reunite people with their belongings efficiently and securely.
              </ThemedText>
            </View>
          </ThemedView>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={[styles.button, styles.enterButton]} 
            onPress={handleEnterPress}
          >
            <MaterialIcons name="login" size={24} color="white" style={styles.buttonIcon} />
            <ThemedText style={styles.buttonText}>Enter</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.reportButton]} 
            onPress={handleReportPress}
          >
            <MaterialIcons name="report-problem" size={24} color="white" style={styles.buttonIcon} />
            <ThemedText style={styles.buttonText}>Report Item</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.foundButton]} 
            onPress={handleFoundPress}
          >
            <MaterialIcons name="search" size={24} color="white" style={styles.buttonIcon} />
            <ThemedText style={styles.buttonText}>Item Found</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 32,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  descriptionContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  logo: {
    width: 180,
    height: 180,
  },
  buttonSection: {
    width: '100%',
    marginTop: 40,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  enterButton: {
    backgroundColor: '#007AFF',
  },
  reportButton: {
    backgroundColor: '#34C759',
  },
  foundButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  }
});
