import React, { useEffect } from 'react';
import { ScrollView, RefreshControl, Text, View, StyleSheet, Button, Switch } from 'react-native';
import { startOfHour, setHours, isPast, addDays, subDays, addHours, format } from 'date-fns';

import config from './private/config.json';
import useAsyncStorage from './useAsyncStorage';
import useNotifications from './useNotifications';
import TimePicker from './TimePicker';

const { defaultFastStart, defaultFastTime } = config.fasting;

const getStartingFast = () => ({
  start: startOfHour(setHours(new Date(), defaultFastStart)).getTime(),
  on: false,
  done: false,
});

const NOTIFICATION_ID = 'fasting is over';

const FastScreen = () => {
  const [currentFast, setCurrentFast] = useAsyncStorage('currentFast', getStartingFast());
  const canStartEating = addHours(new Date(currentFast.start), defaultFastTime);
  const { loading, refresh, schedule, isScheduled, cancel } = useNotifications();

  const scheduleNotification = async (time) => {
    if (isScheduled(NOTIFICATION_ID)) {
      await cancel(NOTIFICATION_ID);
    }
    let date = addHours(new Date(time), defaultFastTime);
    if (isPast(date)) {
      date = addDays(date, 1);
    }
    await schedule({
      id: NOTIFICATION_ID,
      content: { title: 'Fasting is over' },
      trigger: { date },
    });
  };

  const toggleFasting = () => {
    if (currentFast.on) {
      setCurrentFast(getStartingFast());
      cancel(NOTIFICATION_ID);
    } else {
      setCurrentFast({ ...currentFast, on: true });
      scheduleNotification(currentFast.start);
    }
  };

  useEffect(() => {
    if (currentFast.on && !isScheduled(NOTIFICATION_ID)) {
      setCurrentFast({ ...currentFast, on: false, done: true });
    }
  }, [isScheduled(NOTIFICATION_ID)]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      <Text style={styles.text}>What time did you start fasting?</Text>
      <TimePicker
        value={currentFast.start}
        onChange={time => {
          setCurrentFast({ ...currentFast, start: time, on: true });
          scheduleNotification(time);
        }}
        style={styles.timePicker}
      />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Fasting?</Text>
        <Switch value={currentFast.on} onValueChange={toggleFasting} />
      </View>
      {(currentFast.on || currentFast.done) && (
        <>
          <Text style={styles.text}>
            {currentFast.done ? 'Your fast has ended at' : 'You can start eating at'}
          </Text>
          <Text style={styles.time}>{format(canStartEating, 'kk:mm')}</Text>
          <Button title="Reset" onPress={() => setCurrentFast(getStartingFast())} />
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
