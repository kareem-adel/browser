import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../../../hooks';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import {
  tabGoToUrl,
  updateHomeLastSeenPreviews,
} from '../../../../store/browser';

const HomePage = ({
  dispatch,
  handleWebViewScroll,
  homeLastSeenPreviews,
  tabId,
}) => {
  const { NavigationColors } = useTheme();
  return (
    <ScrollView
      onScroll={handleWebViewScroll}
      scrollEventThrottle={500}
      style={{ backgroundColor: NavigationColors.background }}
      //contentContainerStyle={{ backgroundColor: NavigationColors.background }}
    >
      <View style={{ flex: 1 }}>
        {homeLastSeenPreviews?.map((homeLastSeenPreview, index) => {
          return (
            <LinkPreview
              renderImage={() => null}
              touchableWithoutFeedbackProps={{
                onPress: () => {
                  dispatch(
                    tabGoToUrl({
                      tabId,
                      url: homeLastSeenPreview.url,
                      manuallyInserted: false,
                    }),
                  );
                  dispatch(
                    updateHomeLastSeenPreviews({
                      ...homeLastSeenPreview,
                    }),
                  );
                },
              }}
              key={index}
              previewData={homeLastSeenPreview}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default HomePage;
