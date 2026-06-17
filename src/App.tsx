import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserProvider, useUser } from './context/UserContext';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ExploreScreen, ExploreStackParamList } from './screens/ExploreScreen';
import { CategoryQuestionsScreen } from './screens/CategoryQuestionsScreen';
import { JournalScreen } from './screens/JournalScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SocialShareScreen } from './screens/SocialShareScreen';
import { CouplesMode } from './screens/CouplesMode';
import { colors, fonts } from './theme';

type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 22 : 19, opacity: focused ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="ExploreHome" component={ExploreScreen} />
      <ExploreStack.Screen name="CategoryQuestions" component={CategoryQuestionsScreen} />
    </ExploreStack.Navigator>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainer,
          borderTopColor: colors.outlineVariant + '60',
          borderTopWidth: 1,
          height: 62 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 5,
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
        options={{
          title: 'Daily Quest',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🌿" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="LibraryTab"
        component={ExploreStackNavigator}
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="JournalTab"
        component={JournalScreen}
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused }) => <TabIcon emoji="✍️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ShareTab"
        component={SocialShareScreen}
        options={{
          title: 'Share',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔗" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="CouplesTab"
        component={CouplesMode}
        options={{
          title: 'Couples',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💑" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingLogo}>🌿 Longevity</Text>
        <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: 24 }} />
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
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingLogo: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.primary,
  },
});
