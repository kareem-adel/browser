import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Animated as RNAnimated,
} from 'react-native';
import { useTheme } from '../../hooks';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';
import {
  tabGoBack,
  updateHomeLastSeenPreviews,
  updateTabSnapshot,
} from '../../store/browser';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { getPreviewData } from '@flyerhq/react-native-link-preview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBackHandler } from '@react-native-community/hooks';
import { AnimatedBrowser, AnimatedBrowserHeader } from './Components';

const Tab = ({ route }) => {
  const tabId = route.params.tabId;
  const setShowtab = route.params.setShowtab;
  const openBottomSheetTabSelector = route.params.openBottomSheetTabSelector;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isTabFocused = useIsFocused();
  const { bottom, top } = useSafeAreaInsets();

  const { width, height } = useWindowDimensions();

  const windowSafeHeight = height - top - bottom;
  const tabs = useSelector(state => state.browser?.tabs);
  const { history, historyIndex } = useSelector(state =>
    state.browser?.tabs.find(tab => tab.tabId === tabId),
  );
  const homeLastSeenPreviews = useSelector(
    state => state.browser?.homeLastSeenPreviews,
  );

  const [error, setError] = useState(false);
  const [refreshWebview, setRefreshWebview] = useState(
    new Date().getMilliseconds(),
  );

  const hasForward = historyIndex < history.length - 1;
  const hasBackward = historyIndex > 0;

  useBackHandler(() => {
    if (hasBackward) {
      dispatch(tabGoBack({ tabId }));
      return true;
    }
    return false;
  });

  const currentHistoryPoint = history[historyIndex];

  const [count, setCount] = useState(0);

  const takeScreen = () => {
    viewShotRef?.current?.capture().then(uri => {
      dispatch(updateTabSnapshot({ tabId, snapshot: uri }));
    });
  };

  const getOpenGraphData = url => {
    getPreviewData(url).then(({ description, image, link, title }) => {
      dispatch(
        updateHomeLastSeenPreviews({ description, image, link, title, url }),
      );
    });
  };

  useEffect(() => {
    if (isTabFocused) {
      takeScreen();
    }
    const timer = setTimeout(() => isTabFocused && setCount(count + 1), 20000);
    return () => clearTimeout(timer);
  }, [count, isTabFocused]);

  useEffect(() => {
    translateY.value = 0;
    setShowtab(true);
    if (error && error.url !== currentHistoryPoint.url) {
      setRefreshWebview(new Date().getMilliseconds());
    }
    setError(false);
  }, [currentHistoryPoint.url]);

  useEffect(() => {
    navigation?.setOptions({ tabBarStyle: { display: 'none' } });
  }, []);

  const [submittedUrl, setSubmittedUrl] = useState(!!currentHistoryPoint.url);
  const [webViewLoadingProgress, setWebViewLoadingProgress] = useState(0);
  const { Layout, Gutters, Fonts, Common, NavigationColors } = useTheme();

  const urlInput = useRef();
  const webviewRef = useRef();
  const viewShotRef = useRef();

  const fadeAnim = useRef(new RNAnimated.Value(1)).current;

  const lastContentOffset = useSharedValue(0);
  const translateY = useSharedValue(0);

  const actionBarStyle = useAnimatedStyle(() => {
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

  const browserStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value + 65, {
            duration: 350,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  const handleWebViewScroll = event => {
    const y = event.nativeEvent.contentOffset.y;
    const cy = event.nativeEvent.contentSize.height;

    if (y < 0 || y + windowSafeHeight - 65 > cy) {
      return;
    }
    if (lastContentOffset.value > y) {
      translateY.value = 0;
      setShowtab(true);
    } else if (lastContentOffset.value < y) {
      translateY.value = -65;
      setShowtab(false);
    }

    lastContentOffset.value = y;
  };

  function startFadeAnimation(submittedUrl) {
    RNAnimated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setSubmittedUrl(!submittedUrl);
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        submittedUrl && urlInput.current.focus();
      });
    });
  }

  const toggleView = () => {
    startFadeAnimation(submittedUrl);
  };

  return (
    <View style={[Layout.fill]}>
      <AnimatedBrowser
        Layout={Layout}
        browserStyle={browserStyle}
        currentHistoryPoint={currentHistoryPoint}
        dispatch={dispatch}
        handleWebViewScroll={handleWebViewScroll}
        homeLastSeenPreviews={homeLastSeenPreviews}
        refreshWebview={refreshWebview}
        setError={setError}
        setWebViewLoadingProgress={setWebViewLoadingProgress}
        tabId={tabId}
        takeScreen={takeScreen}
        viewShotRef={viewShotRef}
        webviewRef={webviewRef}
      />

      <AnimatedBrowserHeader
        Common={Common}
        Fonts={Fonts}
        Gutters={Gutters}
        Layout={Layout}
        NavigationColors={NavigationColors}
        actionBarStyle={actionBarStyle}
        currentHistoryPoint={currentHistoryPoint}
        dispatch={dispatch}
        fadeAnim={fadeAnim}
        getOpenGraphData={getOpenGraphData}
        hasBackward={hasBackward}
        hasForward={hasForward}
        renderBottomSheetTabSelector={renderBottomSheetTabSelector}
        renderBrowserProgressBar={renderBrowserProgressBar}
        submittedUrl={submittedUrl}
        tabId={tabId}
        tabs={tabs}
        toggleView={toggleView}
        urlInput={urlInput}
      />
    </View>
  );

  function renderBottomSheetTabSelector() {
    return (
      tabs?.length && (
        <TouchableOpacity
          style={[
            Gutters.smallHMargin,
            Gutters.tinyVMargin,
            Gutters.tinyPadding,
            { borderRadius: 10, borderWidth: 3, borderColor: 'grey' },
          ]}
          onPress={() => {
            takeScreen();
            openBottomSheetTabSelector();
          }}
        >
          <Text>{tabs?.length}</Text>
        </TouchableOpacity>
      )
    );
  }

  function renderBrowserProgressBar() {
    return (
      !!currentHistoryPoint.url &&
      !error &&
      webViewLoadingProgress < 1.0 &&
      webViewLoadingProgress > 0.0 && (
        <Progress.Bar
          height={2}
          style={[Layout.absolute, Layout.bottom0, Layout.left0]}
          progress={webViewLoadingProgress}
          width={width}
        />
      )
    );
  }
};

export default Tab;
