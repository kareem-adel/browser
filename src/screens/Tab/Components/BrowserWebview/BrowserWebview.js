import React from 'react';
import { Platform } from 'react-native';
import WebView from 'react-native-webview';
import { tabGoToUrl } from '../../../../store/browser';

const BrowserWebview = ({
  currentHistoryPoint,
  dispatch,
  handleWebViewScroll,
  refreshWebview,
  setError,
  setWebViewLoadingProgress,
  tabId,
  takeScreen,
  webviewRef,
}) => (
  <WebView
    setSupportMultipleWindows={false}
    contentInset={{ top: 0, bottom: 0 }} // Adjust the inset values as per your requirement
    automaticallyAdjustContentInsets={false}
    alwaysBounceHorizontal={false}
    alwaysBounceVertical={false}
    bounces={false}
    overScrollMode="never"
    onScroll={handleWebViewScroll}
    key={refreshWebview}
    originWhitelist={['*']}
    ref={webviewRef}
    useWebView2={true}
    {...{
      [`${Platform.OS === 'android' ? 'onLoadStart' : 'onLoadEnd'}`]: ({
        nativeEvent: { url, code },
      }) => {
        if (code === undefined) {
          currentHistoryPoint.url !== url &&
            dispatch(tabGoToUrl({ tabId, url, manuallyInserted: false }));
        }
        takeScreen();
      },
    }}
    source={{ uri: currentHistoryPoint.url }}
    onLoadProgress={({ nativeEvent }) => {
      setWebViewLoadingProgress(nativeEvent.progress);
    }}
    onError={({ nativeEvent: { domain, code, description } }) => {
      setError({
        domain,
        code,
        description,
        url: currentHistoryPoint.url,
      });
    }}
  />
);

export default BrowserWebview;
