import React from 'react';
import Animated from 'react-native-reanimated';
import TouchableIcon from '../../../../components/TouchableIcon/TouchableIcon';
import { tabGoBack, tabGoForward } from '../../../../store/browser';
import AnimatedSearchBar from '../AnimatedSearchBar/AnimatedSearchBar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AnimatedBrowserHeader = ({
  Common,
  Fonts,
  Gutters,
  Layout,
  NavigationColors,
  actionBarStyle,
  currentHistoryPoint,
  dispatch,
  fadeAnim,
  getOpenGraphData,
  hasBackward,
  hasForward,
  renderBottomSheetTabSelector,
  renderBrowserProgressBar,
  submittedUrl,
  tabId,
  tabs,
  toggleView,
  urlInput,
}) => (
  <Animated.View
    style={[
      Layout.row,
      Layout.center,
      {
        position: 'absolute',
        top: 0,
        backgroundColor: NavigationColors.background,
      },
      actionBarStyle,
    ]}
  >
    <TouchableIcon
      IconFamily={FontAwesome}
      iconName={'chevron-left'}
      disabled={!hasBackward}
      onPress={() => {
        dispatch(tabGoBack({ tabId }));
      }}
      containerStyle={[Gutters.smallHPadding, Gutters.smallVPadding]}
    />
    <TouchableIcon
      IconFamily={FontAwesome}
      iconName={'chevron-right'}
      disabled={!hasForward}
      onPress={() => {
        dispatch(tabGoForward({ tabId }));
      }}
      containerStyle={[Gutters.smallHPadding, Gutters.smallVPadding]}
    />
    <AnimatedSearchBar
      Common={Common}
      Fonts={Fonts}
      Gutters={Gutters}
      Layout={Layout}
      currentHistoryPoint={currentHistoryPoint}
      dispatch={dispatch}
      fadeAnim={fadeAnim}
      getOpenGraphData={getOpenGraphData}
      submittedUrl={submittedUrl}
      tabId={tabId}
      tabs={tabs}
      toggleView={toggleView}
      urlInput={urlInput}
    />
    {renderBottomSheetTabSelector()}
    {renderBrowserProgressBar()}
  </Animated.View>
);

export default AnimatedBrowserHeader;
