import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/ja';
import { TimePickerModal } from 'react-native-paper-dates';
import { TextInput, TouchableRipple } from 'react-native-paper';
import { format } from 'date-fns';

const tsToHoursAndMinutes = ts => {
  const date = new Date(ts);
  return { hours: date.getHours(), minutes: date.getMinutes() };
};

const hoursAndMinutesToTs = (hours, minutes) => {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.getTime();
};
const TimePicker = ({ value, onChange, style }) => {
  const [isOpen, setOpen] = useState(false);
  const timeValue = tsToHoursAndMinutes(value);
  return (
    <View style={[style, { alignItems: 'center' }]}>
      <TimePickerModal
        visible={isOpen}
        onDismiss={() => setOpen(false)}
        onConfirm={({ hours, minutes }) => {
          onChange(hoursAndMinutesToTs(hours, minutes));
          setOpen(false);
        }}
        hours={timeValue.hours}
        minutes={timeValue.minutes}
        locale="ja-jp"
      />
      <TouchableRipple onPress={() => setOpen(true)}>
        <View style={style} pointerEvents="none">
          <TextInput
            mode="outlined"
            value={format(new Date(value), 'kk:mm')}
            pointerEvents="none"
            style={{ width: '100%', fontSize: 32 }}
            right={<TextInput.Icon name="clock-outline" />}
          />
        </View>
      </TouchableRipple>
      <View style={styles.now}>
        <Button title="Now" onPress={() => onChange(Date.now())} />
      </View>
    </View>
  );
};

TimePicker.defaultProps = {
  style: {},
};

const styles = StyleSheet.create({
  now: {
    marginTop: 8,
    width: 80,
  }
});

export default TimePicker;
