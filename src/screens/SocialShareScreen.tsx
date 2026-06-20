import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, radii, shadow } from '../theme';
import { useUser } from '../context/UserContext';
import { archetypeLabels } from '../utils/longevity';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { TopHeader } from '../components/TopHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { PremiumButton } from '../components/PremiumButton';

const CORNER = require('../../assets/corner-top-left.png');

export const SocialShareScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<any>();
  const [sharing, setSharing] = useState(false);

  const archetype = user?.primaryArchetype;
  const label = archetype ? archetypeLabels[archetype] : null;

  const handleShare = async () => {
    if (!archetype || !label) return;
    setSharing(true);
    try {
      const message =
        `I'm a "${label.label}".\n\n` +
        `I just discovered my longevity archetype on The Longevity Game. What's yours?\n\n` +
        `#longevity #wellness #healthspan`;
      await Share.share({ message, title: 'My Longevity Archetype', url: 'https://longevity.game' });
    } catch (e) {
      console.error('Share error:', e);
    } finally {
      setSharing(false);
    }
  };

  const handleNavTab = (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => {
    if (tab === 'more') return;
    const tabName = tab === 'daily' ? 'TodayTab' : tab === 'explore' ? 'LibraryTab' : tab === 'journal' ? 'JournalTab' : 'ProfileTab';
    navigation.getParent()?.navigate(tabName as any);
  };

  if (!archetype || !label) {
    return (
      <View style={styles.container}>
        <BotanicalBackdrop variant="full" />
        <TopHeader
          userName={user?.name}
          onProfilePress={() => handleNavTab('profile')}
          onMenuPress={() => {}}
        />
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Almost there</Text>
          <Text style={styles.emptySub}>
            Answer more questions to discover your archetype and unlock sharing.
          </Text>
        </View>
        <BottomNavigation active="more" onPress={handleNavTab} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />
      <TopHeader
        userName={user?.name}
        onProfilePress={() => handleNavTab('profile')}
        onMenuPress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Preview card */}
          <View style={styles.card}>
            <Image source={CORNER} style={styles.cardCornerTL} resizeMode="contain" />
            <Image source={CORNER} style={styles.cardCornerBR} resizeMode="contain" />
            <View style={styles.cardInner}>
              <Text style={styles.eyebrow}>Longevity Archetype</Text>
              <Text style={styles.archeName}>{label.label}</Text>
              <View style={styles.divider} />
              <Text style={styles.tagline}>Discover your path to longevity</Text>
              {user?.totalChoicesMade ? (
                <Text style={styles.stat}>{user.totalChoicesMade} choices made</Text>
              ) : null}
              <Text style={styles.brand}>The Longevity Game</Text>
            </View>
          </View>

          <PremiumButton
            label="Share My Archetype"
            onPress={handleShare}
            loading={sharing}
            style={{ marginTop: 28 }}
          />

          <View style={styles.iconRow}>
            {['M', 'X', '@'].map(l => (
              <TouchableOpacity key={l} style={styles.iconBtn} onPress={handleShare}>
                <Text style={styles.iconTxt}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.whyCard}>
            <Text style={styles.whyTitle}>Why share?</Text>
            <Text style={styles.whyTxt}>
              Sharing your archetype invites friends and family into the conversation about
              longevity — and helps you find others who see aging the way you do.
            </Text>
          </View>
      </ScrollView>

      <BottomNavigation active="more" onPress={handleNavTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  card: {
    backgroundColor: colors.cardWarm, borderRadius: radii.xl,
    borderWidth: 1, borderColor: colors.hairline,
    overflow: 'hidden', aspectRatio: 1, ...shadow.card,
  },
  cardCornerTL: {
    position: 'absolute', top: -30, left: -40, width: 180, height: 180, opacity: 0.5,
  },
  cardCornerBR: {
    position: 'absolute', bottom: -30, right: -40, width: 180, height: 180,
    opacity: 0.5, transform: [{ rotate: '180deg' }],
  },
  cardInner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  eyebrow: {
    fontFamily: fonts.sans, fontSize: 11, letterSpacing: 2,
    textTransform: 'uppercase', color: colors.terracotta, marginBottom: 14,
  },
  archeName: { fontFamily: fonts.serif, fontSize: 36, color: colors.ink, textAlign: 'center', letterSpacing: -0.5 },
  divider: { width: 40, height: 1, backgroundColor: colors.terracotta, marginVertical: 18 },
  tagline: { fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 15, color: colors.inkSoft, textAlign: 'center', lineHeight: 22 },
  stat: { fontFamily: fonts.sans, fontSize: 12, color: colors.sage, marginTop: 16, letterSpacing: 0.5 },
  brand: { fontFamily: fonts.serif, fontSize: 13, color: colors.inkMuted, marginTop: 22, letterSpacing: 1.2 },
  iconRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  iconBtn: {
    width: 48, height: 48, borderRadius: 24, marginHorizontal: 8,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.hairline,
    alignItems: 'center', justifyContent: 'center', ...shadow.soft,
  },
  iconTxt: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink },
  whyCard: {
    marginTop: 28, padding: 20, borderRadius: radii.lg,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.hairlineSoft,
  },
  whyTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink, marginBottom: 8 },
  whyTxt: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkSoft, lineHeight: 22 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 26, color: colors.ink, textAlign: 'center' },
  emptySub: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkSoft, marginTop: 10, textAlign: 'center', lineHeight: 22 },
});
