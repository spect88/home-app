import { useState, useEffect } from 'react';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import memoize from 'lodash/memoize';

const askForPermission = memoize(async () => {
  const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  if (permission.status === 'granted') {
    console.log('Notifications allowed');
  } else {
    console.log('Notifications disallowed');
  }
});

const ANDROID_VIBRATION_PATTERN = [
  80, 100, 80, 100, 80, 400,
  80, 100, 80, 100, 80, 400,
  80, 100, 80, 100, 80, 400,
];

const listeners = {};
const addNotificationListener = cb => {
  const id = Math.random();
  listeners[id] = cb;
  return () => delete listeners[id];
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
  handleSuccess: id => {
    Object.values(listeners).forEach(cb => cb(id));
  }
});

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('Default', {
    name: 'Default',
    bypassDnd: false,
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: ANDROID_VIBRATION_PATTERN,
    lightColor: '#FF231F7C',
    enableLights: true,
    enableVibrate: true,
  });
}

const useNotifications = () => {
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(false);
  const refresh = async () => {
    if (Platform.OS === 'web') return;
    setLoading(true);
    try {
      const notifs = await Notifications.getAllScheduledNotificationsAsync();
      setScheduled(notifs);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    askForPermission();
    refresh();
    const removeListener = addNotificationListener(refresh);
    return () => {
      removeListener();
    };
  }, []);

  const schedule = async ({ id, content, trigger }) => {
    if (Platform.OS === 'web') {
      setTimeout(() => {
        setScheduled([...scheduled, { identifier: id }]);
      }, 10);
      return;
    }
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        sound: 'defaultCritical',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: ANDROID_VIBRATION_PATTERN,
        vibrationPattern: ANDROID_VIBRATION_PATTERN,
        sticky: false,
        autoDismiss: true,
        ...content,
      },
      trigger: {
        channelId: 'Default',
        ...trigger,
      },
    });
    refresh();
  };

  const isScheduled = id => {
    return scheduled.some(({ identifier }) => identifier === id);
  };

  const cancel = async (id) => {
    if (Platform.OS === 'web') {
      setTimeout(() => {
        setScheduled(scheduled.filter(({ identifier }) => identifier !== id));
      }, 10);
      return;
    }
    await Notifications.cancelScheduledNotificationAsync(id);
    refresh();
  };

  return { loading, refresh, schedule, isScheduled, cancel };
};

export default useNotifications;
