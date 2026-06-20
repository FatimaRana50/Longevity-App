import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

interface NavItem {
  id: 'daily' | 'explore' | 'journal' | 'profile' | 'more';
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'daily', label: 'Daily Quest', icon: '🌿' },
  { id: 'explore', label: 'Explore', icon: '🧭' },
  { id: 'journal', label: 'Journal', icon: '📖' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'more', label: 'More', icon: '⋯' },
];

interface Props {
  active: 'daily' | 'explore' | 'journal' | 'profile' | 'more';
  onPress: (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => void;
}

export const BottomNavigation: React.FC<Props> = ({ active, onPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom }]}>
      {navItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => onPress(item.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.icon, active === item.id && styles.iconActive]}>
            {item.icon}
          </Text>
          <Text style={[styles.label, active === item.id && styles.labelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.cream,
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.inkMuted,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: colors.terracotta,
    fontWeight: '600',
  },
});
