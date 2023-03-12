import { Dimensions, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { TransitionPresets } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';

import type { ContainerProps } from './Interfaces';

export const activeColor = '#325efb';

export const passiveColor = '#eef2f4';

export const lightColor = '#9db3ff';

export const darkColor = '#19243b';

export const blackColor = '#171D33';

export const whiteColor = '#fff';

export const disabledColor = '#2d4150';

export const windowWidth = Dimensions.get('window').width;

export const windowHeight = Dimensions.get('window').height;

export const container: ContainerProps = {
  flex: 1,
  width: windowWidth,
  height: windowHeight,
  justifyContent: 'center',
  backgroundColor: '#fff',
  paddingTop: 82,
  paddingBottom: 100,
};

const φ = (1 + Math.sqrt(5)) / 2;

export const MIN_HEADER_HEIGHT = 64 + Constants.statusBarHeight;
export const MAX_HEADER_HEIGHT = windowHeight * (1 - 1 / φ);
export const HEADER_DELTA = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;

// config
export const config = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  ...TransitionPresets.SlideFromRightIOS,
  headerTintColor: activeColor,
  headerTransparent: true,
  headerBackground: () => <BlurView tint="light" intensity={5} style={StyleSheet.absoluteFill} />,
};
