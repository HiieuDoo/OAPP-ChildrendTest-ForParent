import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, TYPOGRAPHY } from '../utils/theme';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import ParentingTestScreen from '../screens/ParentingStyle/ParentingTestScreen';
import ParentingResultScreen from '../screens/ParentingStyle/ParentingResultScreen';
import PersonalityTestScreen from '../screens/ChildPersonality/PersonalityTestScreen';
import PersonalityResultScreen from '../screens/ChildPersonality/PersonalityResultScreen';
import EQTestScreen from '../screens/EQTest/EQTestScreen';
import EQResultScreen from '../screens/EQTest/EQResultScreen';
import IAPScreen from '../screens/IAP/IAPScreen';
import FamilyReportScreen from '../screens/IAP/FamilyReportScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 24 : 20 }}>{emoji}</Text>
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 16,
          paddingTop: 8,
          height: 76,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { ...TYPOGRAPHY.caption, marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="FamilyReport"
        component={FamilyReportScreen}
        options={{
          tabBarLabel: 'Family',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👨‍👩‍👧‍👦" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={IAPScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💎" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="MainTabs" component={HomeTabs} />
        <Stack.Screen name="ParentingTest" component={ParentingTestScreen} />
        <Stack.Screen
          name="ParentingResult"
          component={ParentingResultScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="PersonalityTest" component={PersonalityTestScreen} />
        <Stack.Screen
          name="PersonalityResult"
          component={PersonalityResultScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="EQTest" component={EQTestScreen} />
        <Stack.Screen
          name="EQResult"
          component={EQResultScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="IAPScreen"
          component={IAPScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
