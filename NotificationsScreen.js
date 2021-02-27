import React, { useState } from 'react';
import { ScrollView, Text, View, Switch, Vibration, Platform, StyleSheet } from 'react-native';

import config from './private/config.json';
import useAsyncStorage from './useAsyncStorage';

const vibrate = () => {
  const pattern = Platform.select({
    android: [
      80, // wait
      100, // vibrate
      80, // wait
      100, // vibrate
      80, // wait
      400, // vibrate
    ],
    ios: [
      50, // wait, then 400 vibrate
      100, // wait, then 400 vibrate
    ],
  });
  if (!pattern) return;
  Vibration.vibrate(pattern, true);
};

const NotificationsScreen = () => {
  const [testing, setTesting] = useState(false);
  const testFlip = () => {
    if (testing) {
      setTesting(false);
      Vibration.cancel();
    } else {
      setTesting(true);
      vibrate();
    }
  };
  const [notifications, setNotifications] = useAsyncStorage('customNotifications', {});

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {config.notifications.custom.map(({ label }) => (
        <View style={styles.row}>
          <Text style={styles.text}>{label}</Text>
          <Switch
            value={!!notifications[label]}
            onValueChange={() => {
              setNotifications({ ...notifications, [label]: !notifications[label] });
            }}
          />
        </View>
      ))}
      <View style={styles.row}>
        <Text style={styles.text}>Notification test</Text>
        <Switch value={testing} onValueChange={testFlip} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    padding: 16,
    paddingBottom: 8,
    width: '100%',
  },
  text: {
    fontSize: 22,
  },
});

export default NotificationsScreen;
