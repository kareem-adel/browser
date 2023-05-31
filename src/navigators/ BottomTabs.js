import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tab } from '../screens';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '../hooks';
import { addTab, removeTab, setActiveTab } from '../store/browser';
import { jumpTo } from './RootNavigation';
import { useEffect } from 'react';
import { useRef } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import BottomSheetTabSelector from '../screens/Tab/Components/BottomSheetTabSelector/BottomSheetTabSelector';
import TabFavicon from '../components/TabFavicon/TabFavicon';

const TabNavigator = createBottomTabNavigator();

/**
    tabId: uuidv4(),
    snapshot: null,
    history: [{ url, manuallyInserted: false }],
    historyIndex: 0,
*/
const TabItem = ({ tabId, history, historyIndex }) => {
  const dispatch = useDispatch();
  const { Layout, Images, Gutters, Fonts, Common } = useTheme();

  const activeTab = useSelector(state => state.browser?.activeTab);
  const isActive = tabId === activeTab;

  return (
    <TouchableOpacity
      style={[styles.tabContent, styles.tabItem(isActive)]}
      onPress={() => {
        dispatch(setActiveTab({ tabId }));
      }}
    >
      <TabFavicon tabId={tabId} />

      {isActive && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            dispatch(removeTab({ tabId }));
          }}
        >
          <FontAwesome name="times" size={14} color="#1f140e" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

function MyTabBar({ showTab }) {
  const dispatch = useDispatch();
  const { Layout, Images, Gutters, Fonts, Common } = useTheme();
  const tabs = useSelector(state => state.browser.tabs);
  const activeTab = useSelector(state => state.browser?.activeTab);
  const currentTabIndex = tabs.findIndex(tab => tab.tabId === activeTab);

  const tabFlatlistRef = useRef();

  const translateY = useSharedValue(0);

  const tabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 350,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  useEffect(() => {
    if (showTab) {
      translateY.value = 0;
    } else {
      translateY.value = 75;
    }
  }, [showTab]);

  const scrollToTab = () => {
    tabFlatlistRef?.current?.scrollToIndex({
      index: currentTabIndex,
      animated: true,
      viewPosition: 0.5,
    });
  };

  useEffect(() => {
    //scrollToTab();
    setTimeout(() => scrollToTab(), 50);
  }, [activeTab]);

  const renderItem = ({ item }) => {
    return <TabItem {...item} />;
  };

  return (
    <Animated.View style={[styles.container, tabBarStyle]}>
      <FlatList
        ref={tabFlatlistRef}
        data={tabs}
        extraData={{ activeTab, tabs }}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: 32 + 13 * 2,
          offset: (32 + 13 * 2) * index,
          index,
        })}
        //initialScrollIndex={currentTabIndex}
        keyExtractor={item => item.tabId}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity
        style={[Gutters.smallHPadding, Gutters.smallVPadding]}
        onPress={() => {
          dispatch(addTab());
        }}
      >
        <FeatherIcon name="plus" size={32} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
}

function Tabs() {
  const tabs = useSelector(state => state.browser.tabs);
  const bottomSheetTabSelectorRef = useRef();
  const { Layout, Images, Gutters, Fonts, Common } = useTheme();

  const activeTab = useSelector(state => state.browser?.activeTab);

  const [showTab, setShowtab] = useState(true);

  const closeBottomSheetTabSelector = () => {
    bottomSheetTabSelectorRef.current?.close();
  };
  const openBottomSheetTabSelector = () => {
    bottomSheetTabSelectorRef.current?.open();
  };

  useEffect(() => {
    jumpTo(activeTab, { tabId: activeTab });
  }, [activeTab]);

  return (
    <>
      <TabNavigator.Navigator
        initialRouteName={activeTab}
        screenOptions={{ headerShown: false, tabBarStyle: { height: 0 } }}
        tabBar={props => null}
      >
        {tabs.map((tab, i) => {
          return (
            <TabNavigator.Screen
              //getId={({ params }) => params.tabId}
              name={tab.tabId}
              key={tab.tabId}
              component={Tab}
              initialParams={{
                tabId: tab.tabId,
                setShowtab,
                closeBottomSheetTabSelector,
                openBottomSheetTabSelector,
              }}
            />
          );
        })}
      </TabNavigator.Navigator>
      <MyTabBar showTab={showTab} />
      <BottomSheetTabSelector
        ref={bottomSheetTabSelectorRef}
        setShowtab={setShowtab}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#372925',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabListContainer: {},
  tabItem: isActive => ({
    width: 32 + 8 * 2,
    height: 32 + 8 * 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isActive ? '#352a24' : '#2a2a2a',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: isActive ? '#e9b398' : 'transparent',
  }),
  tabTitle: {
    marginRight: 10,
  },
  addButton: {
    fontSize: 20,
  },
  closeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9b398',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Tabs;
