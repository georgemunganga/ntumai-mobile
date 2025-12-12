declare module 'react-native-country-codes-picker' {
  import { ComponentType } from 'react';

  export interface CountryItem {
    name: string;
    dial_code: string;
    code: string;
    flag?: string;
  }

  export interface CountryPickerProps {
    show: boolean;
    pickerButtonOnPress?: (item: CountryItem) => void;
    onBackdropPress?: () => void;
    countryCode?: string;
    lang?: string;
    searchPlaceholder?: string;
    style?: {
      modal?: object;
      [key: string]: unknown;
    };
  }

  export const CountryPicker: ComponentType<CountryPickerProps>;
}

declare module 'react-native-device-info';
declare module 'react-native-status-bar-height';
declare module '@react-native-community/geolocation';
declare module 'react-native-push-notification';
declare module '@react-native-community/push-notification-ios';
declare module 'react-native-permissions';

declare namespace JSX {
  type Element = any;
  interface ElementClass {
    render: any;
  }
  interface ElementAttributesProperty {
    props: any;
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
