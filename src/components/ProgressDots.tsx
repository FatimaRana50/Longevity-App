import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  total: number;
  current: number; // 1-indexed
};

const TERRACOTTA = '#C4654A';
const SAGE_DARK = '#546342';
const MUTED = '#E6DFD1';

export const ProgressDots: React.FC<Props> = ({ total, current }) => {
  const items = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <View style={styles.row}>
      {items.map((n, idx) => {
        const isActive = n === current;
        const isDone = n < current;
        return (
          <React.Fragment key={n}>
            <View
              style={[
                styles.dot,
                isActive && styles.dotActive,
                isDone && styles.dotDone,
              ]}
            >
              <Text
                style={[
                  styles.dotText,
                  (isActive || isDone) && { color: '#FDF9F2' },
                ]}
              >
                {n}
              </Text>
            </View>
            {idx < items.length - 1 && (
              <View style={[styles.bar, n < current && styles.barDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
  dot: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: MUTED,
    alignItems: 'center', justifyContent: 'center',
  },
  dotActive: { backgroundColor: TERRACOTTA },
  dotDone: { backgroundColor: SAGE_DARK },
  dotText: { fontSize: 13, fontWeight: '600', color: '#8a7d68' },
  bar: { width: 56, height: 1.5, backgroundColor: MUTED, marginHorizontal: 8 },
  barDone: { backgroundColor: SAGE_DARK },
});
