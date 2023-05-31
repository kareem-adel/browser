import React, { Fragment } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '../hooks';
import MainNavigator from './Main';
import { useFlipper } from '@react-navigation/devtools';
import { navigationRef } from './RootNavigation';
const Stack = createStackNavigator();
// @refresh reset
const ApplicationNavigator = () => {
  const { darkMode, NavigationTheme, NavigationColors, Layout } = useTheme();
  useFlipper(navigationRef);
  return (
    <Fragment>
      <SafeAreaView
        style={[
          styles.safeAreaTop,
          { backgroundColor: NavigationColors.background },
        ]}
      />
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={[Layout.fill, { backgroundColor: '#201a17' }]}>
        <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Fragment>
  );
};
export default ApplicationNavigator;

const styles = StyleSheet.create({
  safeAreaTop: { flex: 0 },
});
