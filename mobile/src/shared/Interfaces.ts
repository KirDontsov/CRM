import type { TextStyle } from 'react-native';

export interface ShatedStackProps {
  navigation?: any;
}

export interface ContainerProps {
  flex?: number;
  width?: number;
  height?: number;
  justifyContent?: string;
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  container?: object;
}

export interface IStyles {
  containerLight: Record<string, never>;
  containerDark: Record<string, never>;
  gradient?: Record<string, never>;
  textLight?: TextStyle;
  textDark?: TextStyle;
}

export interface IProfile {
  id: string;
  name: string;
  age: number;
  profile: any;
}
