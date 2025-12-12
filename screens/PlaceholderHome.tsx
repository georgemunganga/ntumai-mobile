import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderHome: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NTUMAI</Text>
      <Text style={styles.subtitle}>Dashboard coming soon.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
});

export default PlaceholderHome;
