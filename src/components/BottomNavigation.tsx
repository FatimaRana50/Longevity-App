import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

interface NavItem {
  id: 'daily' | 'explore' | 'journal' | 'profile' | 'more';
  label: string;
  iconName: string;
  iconLib: 'ionicons' | 'feather';
}

const navItems: NavItem[] = [
  { id: 'daily', label: 'Daily Quest', iconName: 'leaf-outline', iconLib: 'ionicons' },
  { id: 'explore', label: 'Explore', iconName: 'compass-outline', iconLib: 'ionicons' },
  { id: 'journal', label: 'Journal', iconName: 'book-outline', iconLib: 'ionicons' },
  { id: 'profile', label: 'Profile', iconName: 'person-outline', iconLib: 'ionicons' },
  { id: 'more', label: 'More', iconName: 'ellipsis-horizontal-outline', iconLib: 'ionicons' },
];

interface Props {
  active: 'daily' | 'explore' | 'journal' | 'profile' | 'more';
  onPress: (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => void;
}

export const BottomNavigation: React.FC<Props> = ({ active, onPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom }]}>
      {navItems.map(item => {
        const isActive = active === item.id;
        const iconColor = isActive ? colors.sage : '#9B8B7E';
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => onPress(item.id)}
            activeOpacity={0.7}
          >
            {item.iconLib === 'ionicons' ? (
              <Ionicons name={item.iconName as any} size={24} color={iconColor} />
            ) : (
              <Feather name={item.iconName as any} size={24} color={iconColor} />
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
  label: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: '#9B8B7E',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  labelActive: {
    color: colors.sage,
    fontWeight: '600',
  },
});
