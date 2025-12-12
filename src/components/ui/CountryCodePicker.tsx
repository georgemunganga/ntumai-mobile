import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { ChevronDown } from 'lucide-react-native';

interface CountryCodePickerProps {
  code: string;
  onSelect: (code: string) => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  code,
  onSelect,
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <TouchableOpacity
        className='bg-gray-100 border border-gray-200 rounded-full h-11 p-3 flex-row items-center justify-center'
        style={{
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <Text className='text-base pr-3'>{code}</Text>

        <View
          className='flex-1 justify-center items-center bg-white '
          style={{
            maxWidth: 8,
            width: 0,
            height: 0,
            borderLeftWidth: 8,
            borderRightWidth: 8,
            borderTopWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#606268',
            backgroundColor:'transparent'
          }}
        />
      </TouchableOpacity>
      <CountryPicker
        show={show}
        lang='en'
        pickerButtonOnPress={(item) => {
          onSelect(item.dial_code);
          setShow(false);
        }}
        onBackdropPress={() => setShow(false)}
        style={{
          modal: { height: 400 },
        }}
      />
    </>
  );
};

export default CountryCodePicker;
