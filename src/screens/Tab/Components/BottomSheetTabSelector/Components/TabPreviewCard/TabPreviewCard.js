import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TabFavicon } from '../../../../../../components';
import { removeTab, setActiveTab } from '../../../../../../store/browser';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../../../../hooks';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Constants from '../../Constants';

const TabPreviewCard = ({ tabId, title, image, close }) => {
  const { Layout, Gutters, Colors } = useTheme();
  const activeTab = useSelector(state => state.browser?.activeTab);
  const isActive = activeTab === tabId;

  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setActiveTab({ tabId }));
        close();
      }}
      style={[Gutters.tinyVMargin]}
    >
      <View
        style={[
          {
            backgroundColor: isActive
              ? Constants.tabThemeColor
              : Constants.inactiveTabThemeColor,
          },
          Layout.row,
          Layout.center,
          styles.tabHeaderContainer(isActive),
        ]}
      >
        <View style={[Gutters.tinyLPadding]}>
          <TabFavicon tabId={tabId} />
        </View>
        <Text
          style={[Layout.fill, Gutters.tinyHPadding, { color: Colors.white }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <TouchableOpacity
          style={[Gutters.tinyPadding]}
          onPress={() => {
            dispatch(removeTab({ tabId }));
          }}
        >
          <FontAwesome name="times" size={14} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <View style={[styles.TabImageContainer(isActive)]}>
        <FastImage
          style={styles.image}
          source={{ uri: image?.replace(/(\r\n|\n|\r|\s)/gm, '') }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    </TouchableOpacity>
  );
};
export default TabPreviewCard;

const styles = StyleSheet.create({
  tabHeaderContainer: isActive => ({
    borderColor: isActive
      ? Constants.tabThemeColor
      : Constants.inactiveTabThemeColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: 45,
    borderBottomWidth: 0,
  }),
  image: {
    width: Constants.tabWidth,
    height: Constants.imageHeight,
    overflow: 'hidden',
  },
  TabImageContainer: isActive => ({
    borderColor: isActive
      ? Constants.tabThemeColor
      : Constants.inactiveTabThemeColor,
    marginTop: -1,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
  }),
});
