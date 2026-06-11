import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider, useUser } from './context/UserContext';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { colors, fonts } from './theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderSub}>Coming Soon</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.borderLight,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="TodayTab"
        component={QuestionScreen}
        options={{ title: 'Daily Quest' }}
      />
      <Tab.Screen
        name="LibraryTab"
        component={() => <PlaceholderScreen title="Library" />}
        options={{ title: 'Library' }}
      />
      <Tab.Screen
        name="JournalTab"
        component={() => <PlaceholderScreen title="Journal" />}
        options={{ title: 'Journal' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={() => <PlaceholderScreen title="Profile" />}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {user?.onboardingCompleted ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  placeholderTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.textPrimary,
  },
  placeholderSub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
  },
});
