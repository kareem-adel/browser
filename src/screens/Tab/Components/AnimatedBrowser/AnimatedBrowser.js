import React from 'react';
import Animated from 'react-native-reanimated';
import ViewShot from 'react-native-view-shot';
import HomePage from '../HomePage/HomePage';
import BrowserWebview from '../BrowserWebview/BrowserWebview';

const AnimatedBrowser = ({
  Layout,
  browserStyle,
  currentHistoryPoint,
  dispatch,
  handleWebViewScroll,
  homeLastSeenPreviews,
  refreshWebview,
  setError,
  setWebViewLoadingProgress,
  tabId,
  takeScreen,
  viewShotRef,
  webviewRef,
}) => (
  <Animated.View
    style={[
      {
        width: '100%',
        flex: 1,
      },
      browserStyle,
    ]}
  >
    <ViewShot
      style={[Layout.fill]}
      ref={viewShotRef}
      options={{
        format: 'jpg',
        quality: 0.1,
        result: 'data-uri',
      }}
    >
      {currentHistoryPoint.url ? (
        <BrowserWebview
          currentHistoryPoint={currentHistoryPoint}
          dispatch={dispatch}
          handleWebViewScroll={handleWebViewScroll}
          refreshWebview={refreshWebview}
          setError={setError}
          setWebViewLoadingProgress={setWebViewLoadingProgress}
          tabId={tabId}
          takeScreen={takeScreen}
          webviewRef={webviewRef}
        />
      ) : (
        <HomePage
          dispatch={dispatch}
          handleWebViewScroll={handleWebViewScroll}
          homeLastSeenPreviews={homeLastSeenPreviews}
          tabId={tabId}
        />
      )}
    </ViewShot>
  </Animated.View>
);

export default AnimatedBrowser;
