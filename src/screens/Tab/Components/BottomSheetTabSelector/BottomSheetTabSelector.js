import React, {
  useRef,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../../hooks';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { extractDomain } from '../../../../Utils/extractDomain';
import { addTab } from '../../../../store/browser';
import { useBackHandler } from '@react-native-community/hooks';
import { TabPreviewCard } from './Components';
import Constants from './Constants';

const BottomSheetTabSelector = forwardRef(({}, ref) => {
  const sheetRef = useRef();
  const bottomSheetFlatListRef = useRef();

  const { Layout, Gutters, Colors } = useTheme();
  const dispatch = useDispatch();

  const tabs = useSelector(state => state.browser?.tabs);
  const activeTab = useSelector(state => state.browser?.activeTab);
  const currentTabIndex = tabs.findIndex(tab => tab.tabId === activeTab);

  const scrollToTab = () => {
    bottomSheetFlatListRef?.current?.scrollToIndex({
      index: parseInt(currentTabIndex / 2, 10),
      animated: true,
      viewPosition: 0,
    });
  };

  const [index, setIndex] = useState(-1);

  useEffect(() => {
    //scrollToTab();
    setTimeout(() => scrollToTab(), 50);
  }, [activeTab]);

  useBackHandler(() => {
    if (index >= 0) {
      methods.close();
      return true;
    }
    return false;
  });

  const snapPoints = useMemo(() => ['100%'], []);

  const methods = {
    close: () => {
      sheetRef.current?.close();
    },
    open: () => {
      sheetRef.current?.snapToIndex(0);
      setTimeout(() => scrollToTab(), 600);
    },
  };

  useImperativeHandle(ref, () => methods, [currentTabIndex]);

  const renderItem = ({ item }) => (
    <TabPreviewCard key={item.tabId} {...item} {...methods} />
  );

  const renderAddTab = () => (
    <TouchableOpacity
      style={[Gutters.tinyPadding, Layout.selfCenter]}
      onPress={() => {
        dispatch(addTab());
      }}
    >
      <FontAwesome name="plus" size={40} color={Colors.black} />
    </TouchableOpacity>
  );
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={setIndex}
      index={-1}
    >
      <BottomSheetFlatList
        ref={bottomSheetFlatListRef}
        data={tabs.map(tab => {
          const url = tab.history[tab.historyIndex].url;
          return {
            tabId: tab.tabId,
            title: extractDomain(url),
            image: tab.snapshot,
          };
        })}
        keyExtractor={i => i.tabId}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        numColumns={2}
        getItemLayout={(data, index) => ({
          length: Constants.tabHeight,
          offset: Constants.tabHeight * index,
          index,
        })}
        ListFooterComponent={renderAddTab}
      />
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  columnWrapper: { flex: 1, justifyContent: 'space-around' },
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});

export default BottomSheetTabSelector;
