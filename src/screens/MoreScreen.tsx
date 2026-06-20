import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, radii, shadow } from '../theme';
import { useUser } from '../context/UserContext';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { TopHeader } from '../components/TopHeader';
import { BottomNavigation } from '../components/BottomNavigation';

export const MoreScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<any>();

  const handleNavTab = (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => {
    if (tab === 'more') return;
    const tabName = tab === 'daily' ? 'TodayTab' : tab === 'explore' ? 'LibraryTab' : tab === 'journal' ? 'JournalTab' : 'ProfileTab';
    navigation.getParent()?.navigate(tabName as any);
  };

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
      <TopHeader
        userName={user?.name}
        onProfilePress={() => navigation.getParent()?.navigate('ProfileTab')}
        onMenuPress={() => {}}
      />

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

      <BottomNavigation active="more" onPress={handleNavTab} />
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
