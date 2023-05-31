import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

const TabFavicon = ({ tabId, imageStyle }) => {
  const { history, historyIndex } = useSelector(state =>
    state.browser?.tabs.find(tab => tab.tabId === tabId),
  );

  return (
    <View style={{ overflow: 'hidden', borderRadius: 30 }}>
      <FastImage
        style={[{ width: 30, height: 30 }, imageStyle]}
        source={
          history[historyIndex].url
            ? {
                uri: `https://www.google.com/s2/favicons?domain=${history[historyIndex].url}&sz=64`,
                priority: FastImage.priority.high,
              }
            : FontAwesome.getImageSourceSync('home', 32, 'white')
        }
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

export default TabFavicon;
