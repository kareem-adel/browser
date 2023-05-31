import { getPreviewData } from '@flyerhq/react-native-link-preview';
import { createSlice } from '@reduxjs/toolkit';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { jumpTo, navigate } from '../../navigators/RootNavigation';

const generateTab = (url = '') => {
  return {
    tabId: uuidv4(),
    snapshot: null,
    history: [{ url, manuallyInserted: false }],
    historyIndex: 0,
  };
};

const slice = createSlice({
  name: 'browser',
  initialState: (() => {
    const defaultTab = generateTab();
    return {
      tabs: [defaultTab],
      activeTab: defaultTab.tabId,
      homeLastSeenPreviews: [],
    };
  })(),
  reducers: {
    addTab: state => {
      const newTab = generateTab();
      state.tabs.push(newTab);
      state.activeTab = newTab.tabId;
    },
    removeTab: (state, { payload: { tabId } }) => {
      const tabIndex = state.tabs.findIndex(tab => tab.tabId === tabId);
      state.tabs = state.tabs.filter(tab => tab.tabId !== tabId);
      if (tabIndex > state.tabs.length - 1) {
        if (state.tabs.length === 0) {
          const defaultTab = generateTab();
          state.tabs = [defaultTab];
          state.activeTab = defaultTab.tabId;
          state.snapshot = null;
        } else {
          state.activeTab = state.tabs[tabIndex - 1].tabId;
        }
      } else {
        state.activeTab = state.tabs[tabIndex].tabId;
      }
    },
    setActiveTab: (state, { payload: { tabId } }) => {
      state.activeTab = tabId;
    },

    updateTabSnapshot: (state, { payload: { tabId, snapshot } }) => {
      const tabIndex = state.tabs.findIndex(tab => tab.tabId === tabId);
      state.tabs[tabIndex].snapshot = snapshot;
    },
    tabGoBack: (state, { payload: { tabId } }) => {
      const tabIndex = state.tabs.findIndex(tab => tab.tabId === tabId);
      if (state.tabs[tabIndex].historyIndex > 0) {
        state.tabs[tabIndex].historyIndex--;
      }
    },
    tabGoForward: (state, { payload: { tabId } }) => {
      const tabIndex = state.tabs.findIndex(tab => tab.tabId === tabId);
      if (
        state.tabs[tabIndex].historyIndex <
        state.tabs[tabIndex].history.length - 1
      ) {
        state.tabs[tabIndex].historyIndex++;
      }
    },
    updateHomeLastSeenPreviews: (
      state,
      { payload: { description, image, link, title, url } },
    ) => {
      if (!!description && !!image && !!link && !!title) {
        state.homeLastSeenPreviews = state.homeLastSeenPreviews.filter(
          homeLastSeenPreview => homeLastSeenPreview.url !== url,
        );
        state.homeLastSeenPreviews.unshift({
          description,
          image,
          link,
          title,
          url,
        });
        state.homeLastSeenPreviews.slice(0, 6);
      }
    },
    tabGoToUrl: (state, { payload: { tabId, url, manuallyInserted } }) => {
      const tabIndex = state.tabs.findIndex(tab => tab.tabId === tabId);

      state.tabs[tabIndex].history = state.tabs[tabIndex].history.slice(
        0,
        state.tabs[tabIndex].historyIndex + 1,
      );
      state.tabs[tabIndex].history.push({
        url,
        manuallyInserted: !!manuallyInserted,
      });
      state.tabs[tabIndex].history = state.tabs[tabIndex].history.filter(
        (history, index, historyList) =>
          !history.manuallyInserted || index === historyList.length - 1,
      );
      state.tabs[tabIndex].historyIndex =
        state.tabs[tabIndex].history.length - 1;
    },
  },
});
export const {
  addTab,
  removeTab,
  setActiveTab,
  updateTabSnapshot,
  tabGoBack,
  tabGoForward,
  updateHomeLastSeenPreviews,
  tabGoToUrl,
} = slice.actions;
export default slice.reducer;
