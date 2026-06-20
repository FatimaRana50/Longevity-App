import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { colors } from '../theme';

const TL: ImageSourcePropType = require('../../assets/corner-top-left.png');
const BR: ImageSourcePropType = require('../../assets/corner-bottom-right.png');
const PLANT: ImageSourcePropType = require('../../assets/plant2.png');
const SUNFLOWER: ImageSourcePropType = require('../../assets/sunflower.png');

interface Props {
  variant?: 'full' | 'subtle' | 'top' | 'bottom';
  tint?: string;
  showPlant?: boolean;
  showSunflower?: boolean;
  showCorners?: boolean;
}

/**
 * Premium botanical backdrop. Place as first child of a screen container
 * with absolute fill — content sits on top of it.
 */
export const BotanicalBackdrop: React.FC<Props> = ({ variant = 'subtle', tint = colors.cream, showPlant = true, showSunflower = true, showCorners = true }) => {
  const showTop = showCorners && variant !== 'bottom';
  const showBottom = showCorners && variant !== 'top';
  const opacity = variant === 'full' ? 0.35 : 0.18;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: tint }]}>
      {showPlant && (
        <Image
          source={PLANT}
          style={styles.plant}
          blurRadius={2}
          resizeMode="cover"
        />
      )}
      {showTop && (
        <Image
          source={TL}
          style={[styles.tl, { opacity }]}
          resizeMode="contain"
        />
      )}
      {showBottom && (
        <Image
          source={BR}
          style={[styles.br, { opacity }]}
          resizeMode="contain"
        />
      )}
      {showSunflower && (
        <Image
          source={SUNFLOWER}
          style={styles.sunflower}
          blurRadius={2}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  plant: { position: 'absolute', width: '100%', height: '60%', bottom: 0, opacity: 0.45 },
  tl: { position: 'absolute', top: -40, left: -60, width: 280, height: 280 },
  br: { position: 'absolute', bottom: -40, right: -60, width: 280, height: 280 },
  sunflower: { position: 'absolute', top: '45%', right: -60, width: 320, height: 320, opacity: 0.35 },
});
