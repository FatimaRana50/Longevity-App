import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, radii, shadow } from '../theme';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { Header } from '../components/Header';

export const MoreScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const menuItems = [
    {
      id: 'share',
      label: 'Share Results',
      description: 'Share your archetype with others',
      onPress: () => navigation.navigate('Share'),
    },
    {
      id: 'couples',
      label: 'Couples Mode',
      description: 'Experience longevity as a couple',
      onPress: () => navigation.navigate('Couples'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="More" subtitle="Additional features" />

        <View style={styles.content}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              activeOpacity={0.7}
              style={styles.menuItem}
            >
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  safe: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 12 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
    padding: 20,
    marginBottom: 12,
    ...shadow.soft,
  },
  menuContent: { flex: 1 },
  menuLabel: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 4,
  },
  menuDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
    color: colors.terracotta,
    marginLeft: 12,
    fontWeight: '600',
  },
});
