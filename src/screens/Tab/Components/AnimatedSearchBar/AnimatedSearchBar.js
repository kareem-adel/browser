import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Animated as RNAnimated,
} from 'react-native';

import { extractDomain } from '../../../../Utils/extractDomain';
import { validateAndAppendHttps } from '../../../../Utils/validateAndAutocorrectUrl';
import { tabGoToUrl } from '../../../../store/browser';

const AnimatedSearchBar = ({
  Common,
  Fonts,
  Gutters,
  Layout,
  currentHistoryPoint,
  dispatch,
  fadeAnim,
  getOpenGraphData,
  submittedUrl,
  tabId,
  tabs,
  toggleView,
  urlInput,
}) => (
  <RNAnimated.View
    style={[Gutters.tinyVMargin, { opacity: fadeAnim }, Layout.fill]}
  >
    {submittedUrl ? (
      <TouchableOpacity
        style={[
          Common.textContainer,
          Layout.center,
          !tabs?.length && Gutters.smallRMargin,
        ]}
        onPress={() => {
          toggleView();
        }}
      >
        <Text style={[Fonts.textBold]}>
          {extractDomain(currentHistoryPoint.url)}
        </Text>
      </TouchableOpacity>
    ) : (
      <TextInput
        keyboardType={'url'}
        autoCorrect={false}
        autoCapitalize={'none'}
        ref={urlInput}
        enablesReturnKeyAutomatically={true}
        style={[Common.textInput, !tabs?.length && Gutters.smallRMargin]}
        defaultValue={currentHistoryPoint.url}
        onSubmitEditing={({ nativeEvent: { text } }) => {
          dispatch(
            tabGoToUrl({
              tabId,
              url: validateAndAppendHttps(text),
              manuallyInserted: true,
            }),
          );
          getOpenGraphData(validateAndAppendHttps(text));
          toggleView();
        }}
      />
    )}
  </RNAnimated.View>
);

export default AnimatedSearchBar;
