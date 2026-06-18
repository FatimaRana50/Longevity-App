import React from 'react';
import { Text, StyleSheet } from 'react-native';

type Props = {
  size?: number;
  color?: string;
};

const SAGE_DARK = '#546342';

export const ClipboardIcon: React.FC<Props> = ({ size = 24, color = SAGE_DARK }) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>📋</Text>
);

export const CheckIcon: React.FC<Props> = ({ size = 24, color = SAGE_DARK }) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>✓</Text>
);

export const LeafIcon: React.FC<Props> = ({ size = 24, color = SAGE_DARK }) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🌿</Text>
);

export const ClockIcon: React.FC<Props> = ({ size = 24, color = SAGE_DARK }) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>⏱</Text>
);

export const ArrowLeftIcon: React.FC<Props> = ({ size = 24, color = SAGE_DARK }) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>←</Text>
);

const styles = StyleSheet.create({
  icon: {
    fontWeight: '600',
  },
});
