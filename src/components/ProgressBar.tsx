import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radii } from '../theme';

interface Props {
  value: number; // 0..1
  tint?: string;
  height?: number;
}

export const ProgressBar: React.FC<Props> = ({ value, tint = colors.terracotta, height = 6 }) => {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, {
      toValue: Math.max(0, Math.min(1, value)),
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterp = w.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <Animated.View style={[styles.fill, { width: widthInterp, backgroundColor: tint, borderRadius: height }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { backgroundColor: colors.hairlineSoft, overflow: 'hidden', width: '100%' },
  fill: { height: '100%' },
});
