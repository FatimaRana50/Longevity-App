import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

const LOGO = require('../../assets/logo-leaves.png');

interface Props {
  userName?: string;
  onProfilePress?: () => void;
  onMenuPress?: () => void;
}

export const TopHeader: React.FC<Props> = ({ userName, onProfilePress, onMenuPress }) => {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.center}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.title}>LONGEVITY QUEST</Text>
          <Text style={styles.subtitle}>LIVE LONGER, LIVE BETTER</Text>
        </View>

        <TouchableOpacity onPress={onProfilePress} style={styles.avatar}>
          <Text style={styles.avatarText}>{userName?.charAt(0).toUpperCase() ?? 'F'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#F5F1E8',
  },
  menuIcon: { fontSize: 20, color: colors.ink },
  center: {
    alignItems: 'center',
    flex: 1,
  },
  logo: { fontSize: 20, marginBottom: 2 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 13,
    letterSpacing: 2,
    color: colors.ink,
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.terracotta,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.cream,
    fontWeight: '600',
  },
});
