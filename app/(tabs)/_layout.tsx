import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const handleMissingPress = () => {
    router.push('/(tabs)/missingitem');
  };

  const handleFoundPress = () => {
    router.push('/(tabs)/itemfound');
  };

  return (
    <Stack 
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={handleMissingPress}
              style={styles.headerButton}
            >
              <MaterialIcons name="report-problem" size={24} color="#FF3B30" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleFoundPress}
              style={styles.headerButton}
            >
              <MaterialIcons name="search" size={24} color="#34C759" />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Stack.Screen 
        name="missingitem" 
        options={{
          title: 'Report Missing Item',
          headerTitleStyle: {
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen 
        name="itemfound" 
        options={{
          title: 'Report Found Item',
          headerTitleStyle: {
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen 
        name="items" 
        options={{
          title: 'Lost & Found History',
          headerTitleStyle: {
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen 
<<<<<<< HEAD
        name="claim"
        options={{
          title: 'Claim Item',
          headerTitleStyle: {
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen 
=======
>>>>>>> origin/master
        name="index"
        options={{
          title: 'Home',
          headerTitleStyle: {
            fontSize: 20,
          },
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
<<<<<<< HEAD
    gap: 16,
    paddingRight: 16,
=======
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
>>>>>>> origin/master
  },
  headerButton: {
    padding: 4,
  },
});
