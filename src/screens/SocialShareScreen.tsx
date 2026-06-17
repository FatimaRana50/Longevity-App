import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts } from '../theme';
import { useUser } from '../context/UserContext';
import { archetypeLabels } from '../utils/longevity';

export const SocialShareScreen: React.FC = () => {
  const { user } = useUser();
  const [sharing, setSharing] = useState(false);

  const archetype = user?.primaryArchetype;
  const label = archetype ? archetypeLabels[archetype] : null;

  const handleShare = async () => {
    if (!archetype || !label) return;

    setSharing(true);
    try {
      const message = `I'm a "${label.label}" 🌿\n\nI just discovered my longevity archetype on The Longevity Game! What's yours?\n\n#longevity #wellness #healthspan`;

      await Share.share({
        message,
        title: 'My Longevity Archetype',
        url: 'https://longevity.game', // Will update with actual link
      });
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setSharing(false);
    }
  };

  if (!archetype || !label) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <Text style={styles.emptyText}>Complete questions to unlock sharing</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Share Your Results</Text>

          {/* Card Preview */}
          <View style={styles.cardPreview}>
            <View style={styles.cardContent}>
              <Text style={styles.archetypeEmoji}>{label.emoji}</Text>
              <Text style={styles.archetypeName}>{label.label}</Text>
              <Text style={styles.tagline}>{label.description}</Text>

              {user?.totalChoicesMade ? (
                <Text style={styles.statText}>
                  {user.totalChoicesMade} Choices Made
                </Text>
              ) : null}

              <Text style={styles.brandText}>The Longevity Game</Text>
            </View>
          </View>

          {/* Share Buttons */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            disabled={sharing}
            activeOpacity={0.85}
          >
            {sharing ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Text style={styles.shareBtnEmoji}>📱</Text>
                <Text style={styles.shareBtnText}>Share My Archetype</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why Share?</Text>
            <Text style={styles.infoText}>
              • Challenge your friends to discover their archetype
              • Compare results with your network
              • Start conversations about longevity
              • Inspire others on their wellness journey
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },

  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 24,
    letterSpacing: -0.3,
  },

  cardPreview: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.secondary,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },

  cardContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  archetypeEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },

  archetypeName: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },

  statText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  brandText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  shareBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  shareBtnEmoji: {
    fontSize: 20,
  },

  shareBtnText: {
    color: colors.white,
    fontFamily: fonts.serif,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
  },

  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});
