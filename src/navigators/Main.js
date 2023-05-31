import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './ BottomTabs';
const Stack = createStackNavigator();
// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Tabs} />
    </Stack.Navigator>
  );
};
export default MainNavigator;
