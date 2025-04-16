import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JourneyScreen from './screens/JourneyScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import RoleScreen from './screens/RoleScreen';
import HomeScreen from './screens/HomeScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import LostFoundScreen from './screens/LostFoundScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleScreen" component={RoleScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
        <Stack.Screen name="JourneyScreen" component={JourneyScreen} />
        <Stack.Screen name="LostFoundScreen" component={LostFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}