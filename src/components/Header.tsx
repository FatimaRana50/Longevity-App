import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}

export const Header: React.FC<Props> = ({ title, subtitle, right, onBack }) => {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={12} style={styles.back}>
            <Text style={styles.backTxt}>‹</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  backTxt: { fontSize: 32, color: colors.ink, lineHeight: 32, marginTop: -4 },
  title: { fontFamily: fonts.serif, fontSize: 30, color: colors.ink, letterSpacing: -0.3 },
  sub: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkSoft, marginTop: 4 },
});
