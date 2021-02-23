import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Menu, TextInput, TouchableRipple } from 'react-native-paper';
import isEqual from 'lodash/isEqual';

const Dropdown = ({ items, value, onChange, style }) => {
  const [isOpen, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [inputLayout, setInputLayout] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const onLayout = event => {
    setInputLayout(event.nativeEvent.layout);
  };
  useEffect(() => {
    const label = items.find(item => isEqual(item.value, value))?.label;
    if (label) {
      setDisplayValue(label);
    }
  }, [items, value]);

  return (
    <Menu
      visible={isOpen}
      onDismiss={() => setOpen(false)}
      anchor={
        <TouchableRipple onPress={() => setOpen(true)} onLayout={onLayout}>
          <View pointerEvents="none" style={style}>
            <TextInput
              value={displayValue}
              mode="outlined"
              placeholder="unknown"
              pointerEvents="none"
              style={{ width: '100%' }}
              right={<TextInput.Icon name="menu-down" />}
            />
          </View>
        </TouchableRipple>
      }
      style={{
        maxWidth: inputLayout?.width,
        width: inputLayout?.width,
        marginTop: inputLayout?.height,
      }}
    >
      <ScrollView style={{ maxHeight: 48 * 5 }}>
        {items.map((item, index) => (
          <Menu.Item
            key={index}
            titleStyle={{
              color: 'black',
              fontWeight: isEqual(value, item.value) ? 'bold' : 'normal',
            }}
            onPress={() => {
              onChange(item.value);
              setOpen(false);
            }}
            title={item.label}
            style={{ width: inputLayout?.width }}
          />
        ))}
      </ScrollView>
    </Menu>
  );
};

export default Dropdown;
