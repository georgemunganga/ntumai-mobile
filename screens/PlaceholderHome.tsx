import AppText from '@/components/AppText';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const PlaceholderHome: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Welcome to NTUMAI</AppText>
      <AppText style={styles.subtitle}>Dashboard coming soon.</AppText>
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
