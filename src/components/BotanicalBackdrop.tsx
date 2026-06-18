import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

type Props = {
  children: React.ReactNode;
  topLeft?: ImageSourcePropType;
  topRight?: ImageSourcePropType;
  cornerOpacity?: number;
};

const CORNER_TL = require('../../assets/onboarding/corner-leaves-tl.png');
const CORNER_TR = require('../../assets/onboarding/corner-leaf-tr.png');

export const BotanicalBackdrop: React.FC<Props> = ({ children, topLeft, topRight, cornerOpacity = 1 }) => {
  return (
    <View style={styles.container}>
      {/* Top-left corner */}
      {topLeft !== false && (
        <Image
          source={topLeft || CORNER_TL}
          style={[styles.cornerTL, { opacity: cornerOpacity }]}
          resizeMode="contain"
        />
      )}

      {/* Top-right corner */}
      {topRight !== false && (
        <Image
          source={topRight || CORNER_TR}
          style={[styles.cornerTR, { opacity: cornerOpacity }]}
          resizeMode="contain"
        />
      )}

      {/* Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F2',
    position: 'relative',
    overflow: 'hidden',
  },
  cornerTL: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 180,
    height: 180,
    zIndex: 1,
  },
  cornerTR: {
    position: 'absolute',
    top: -10,
    right: -30,
    width: 200,
    height: 200,
    zIndex: 1,
  },
});
