import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts } from '../theme';
import { useUser } from '../context/UserContext';

export const CouplesMode: React.FC = () => {
  const { user } = useUser();
  const [partnerId, setPartnerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [partnered, setPartnered] = useState(false);
  const [compatibility, setCompatibility] = useState(0);

  const handleInvitePartner = async () => {
    if (!partnerId.trim()) {
      Alert.alert('Error', 'Please enter your partner\'s user ID');
      return;
    }

    setLoading(true);
    try {
      // Placeholder for future API call to send invitation
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('Success', 'Invitation sent to your partner!');
      setPartnerId('');
      setPartnered(true);
      setCompatibility(Math.floor(Math.random() * 30) + 65); // Placeholder
    } catch (error) {
      Alert.alert('Error', 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  if (!partnered) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>💑 Couples Mode</Text>
            <Text style={styles.subtitle}>Compare your longevity philosophies</Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>What is Couples Mode?</Text>
              <Text style={styles.infoText}>
                Share your wellness journeys with your partner. Compare answers, discover compatibility, and have meaningful conversations about aging and longevity together.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formLabel}>Partner's User ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter partner's 36-character ID"
                placeholderTextColor={colors.textMuted}
                value={partnerId}
                onChangeText={setPartnerId}
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.inviteBtn}
                onPress={handleInvitePartner}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.inviteBtnText}>Send Invitation 💌</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.helpText}>
                Ask your partner to share their user ID from the Profile screen.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>✨ Features</Text>
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>• View each other's archetype</Text>
                <Text style={styles.featureItem}>• Compare answer choices</Text>
                <Text style={styles.featureItem}>• Calculate compatibility score</Text>
                <Text style={styles.featureItem}>• Get discussion prompts</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Partnered view
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>💑 Your Relationship</Text>

          {/* Compatibility Score */}
          <View style={styles.compatibilityCard}>
            <Text style={styles.compatLabel}>Wellness Compatibility</Text>
            <View style={styles.compatScoreContainer}>
              <Text style={styles.compatScore}>{compatibility}%</Text>
              <View style={styles.compatBar}>
                <View style={[styles.compatFill, { width: `${compatibility}%` }]} />
              </View>
            </View>
            <Text style={styles.compatMeta}>You're well-aligned on health priorities</Text>
          </View>

          {/* Discussion Prompts */}
          <View style={styles.promptsCard}>
            <Text style={styles.promptsTitle}>💬 Discussion Topics</Text>
            <View style={styles.promptList}>
              <View style={styles.prompt}>
                <Text style={styles.promptEmoji}>🎯</Text>
                <Text style={styles.promptText}>What longevity priorities do you share?</Text>
              </View>
              <View style={styles.prompt}>
                <Text style={styles.promptEmoji}>🔄</Text>
                <Text style={styles.promptText}>Where do your approaches differ?</Text>
              </View>
              <View style={styles.prompt}>
                <Text style={styles.promptEmoji}>🤝</Text>
                <Text style={styles.promptText}>How can you support each other's goals?</Text>
              </View>
            </View>
          </View>

          {/* Comparison Stats */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>📊 Comparison</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Answered same choice:</Text>
              <Text style={styles.statValue}>68%</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Complementary choices:</Text>
              <Text style={styles.statValue}>24%</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Different approaches:</Text>
              <Text style={styles.statValue}>8%</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.disconnectBtn}
            onPress={() => {
              setPartnered(false);
              setCompatibility(0);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.disconnectBtnText}>Disconnect Partner</Text>
          </TouchableOpacity>
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
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
    fontWeight: '500',
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
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
    marginBottom: 10,
  },

  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
  },

  formCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: 16,
  },

  inviteBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  inviteBtnText: {
    color: colors.white,
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: '700',
  },

  helpText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },

  featureCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },

  featureList: {
    gap: 8,
  },

  featureItem: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Partnered view styles
  compatibilityCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  compatLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  compatScoreContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  compatScore: {
    fontFamily: fonts.serif,
    fontSize: 42,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: -1,
  },

  compatBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.outlineVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },

  compatFill: {
    height: 8,
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },

  compatMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 10,
  },

  promptsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  promptsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },

  promptList: {
    gap: 12,
  },

  prompt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  promptEmoji: {
    fontSize: 18,
    marginTop: 2,
  },

  promptText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },

  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  statsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.outlineVariant,
  },

  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },

  disconnectBtn: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },

  disconnectBtnText: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 15,
  },
});
