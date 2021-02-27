import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  RefreshControl,
  Text,
  View,
  Switch,
  Button,
  StyleSheet,
} from 'react-native';

import useNotifications from './useNotifications';
import config from './private/config.json';

const NotificationsScreen = () => {
  const { loading, refresh, schedule, isScheduled, cancel } = useNotifications();

  const triggerTestNotification = () => {
    schedule({
      id: 'test',
      content: {
        title: 'Test notification',
        body: 'This is the body',
      },
      trigger: { seconds: 1, repeats: false },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      {config.notifications.map(({ label, trigger }) => (
        <View style={styles.row} key={label}>
          <Text style={styles.text}>{label}</Text>
          <Switch
            value={isScheduled(label)}
            onValueChange={() => {
              if (isScheduled(label)) {
                cancel(label);
              } else {
                schedule({
                  id: label,
                  content: { title: label },
                  trigger,
                });
              }
            }}
          />
        </View>
      ))}
      <View style={styles.row}>
        <Text style={styles.text}>Notification test</Text>
        <Button title="Test" onPress={() => triggerTestNotification()} />
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
