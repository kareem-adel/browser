import {
  TabActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function jumpTo(name, params) {
  if (navigationRef.isReady()) {
    const jumpToAction = TabActions.jumpTo(name, params);
    navigationRef.dispatch(jumpToAction);
  }
}

export function reset(name, params) {
  if (navigationRef.isReady()) {
    navigationRef?.reset(name, params);
  }
}

export function goBack(key) {
  if (navigationRef.isReady()) {
    navigationRef?.goBack(key);
  }
}
export function push(key) {
  if (navigationRef.isReady()) {
    navigationRef?.push(key);
  }
}

export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef?.getCurrentRoute();
  }
}
