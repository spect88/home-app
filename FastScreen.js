import React from 'react';
import { ScrollView, Text, View, StyleSheet, Button, Switch } from 'react-native';
import { startOfHour, setHours, subDays, addHours, format } from 'date-fns';

import config from './private/config.json';
import useAsyncStorage from './useAsyncStorage';
import TimePicker from './TimePicker';

const { defaultFastStart, defaultFastTime } = config.fasting;

const getStartingFast = () => ({
  start: startOfHour(setHours(new Date(), defaultFastStart)).getTime(),
  on: false,
});

const FastScreen = () => {
  const [currentFast, setCurrentFast] = useAsyncStorage('currentFast', getStartingFast());
  const canStartEating = addHours(new Date(currentFast.start), defaultFastTime);

  const toggleFasting = () =>
    setCurrentFast(currentFast.on ? getStartingFast() : { ...currentFast, on: true });

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.text}>What time did you start fasting?</Text>
      <TimePicker
        value={currentFast.start}
        onChange={time => setCurrentFast({ ...currentFast, start: time, on: true })}
        style={styles.timePicker}
      />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Fasting?</Text>
        <Switch value={currentFast.on} onValueChange={toggleFasting} />
      </View>
      {currentFast.on && (
        <>
          <Text style={styles.text}>You can start eating at</Text>
          <Text style={styles.time}>{format(canStartEating, 'kk:mm')}</Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    alignItems: 'center',
  },
  timePicker: {
    width: 150,
  },
  text: {
    fontSize: 24,
    marginTop: 24,
  },
  switchRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  switchLabel: {
    fontSize: 24,
  },
  time: {
    fontSize: 48,
    marginTop: 16,
  },
});

export default FastScreen;
