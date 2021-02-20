import React from 'react';
import { Text, View, ScrollView, StyleSheet, Switch } from 'react-native';
import { addDays, format, isToday, isTomorrow, endOfDay } from 'date-fns';

import useAsyncStorage from './useAsyncStorage';
import config from './private/config.json';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const nthTimeThisMonth = date => Math.floor((date.getDate() - 1) / 7) + 1;

const findNextDate = ({ startingFrom, daysOfTheWeek, nthTimeInAMonth }) => {
  let date = startingFrom;
  for (let i = 0; i < 31; i++) {
    const day = date.getDay();
    const nthTime = nthTimeThisMonth(date);
    if (daysOfTheWeek.includes(day) && nthTimeInAMonth.includes(nthTime)) {
      return date;
    }
    date = addDays(date, 1);
  }
  return null;
};

const isNextSixDays = date =>
  new Date() < date && date < endOfDay(addDays(new Date(), 6));

const formatDate = date => {
  if (!date) return 'unknown';
  if (isToday(date)) return 'today';
  if (isTomorrow(date)) return 'tomorrow';
  if (isNextSixDays(date)) return format(date, 'eeee');

  return format(date, 'eeee, MMM do');
};

const TrashScreen = () => {
  const isNightOrMorning = new Date().getHours() < config.trash.collectionTime;
  const startingFrom = isNightOrMorning ? new Date() : addDays(new Date(), 1);
  const [trashNotifications, setTrashNotifications] = useAsyncStorage('trashNotifications', {});

  return (
    <ScrollView style={styles.scrollView}>
      {config.trash.categories.map(category => (
        <View style={styles.trash} key={category.label}>
          <Text style={styles.text}>{category.label}:</Text>
          <Text style={styles.text}>
            {formatDate(findNextDate({ startingFrom, ...category }))}
          </Text>
          <Switch
            value={!!trashNotifications[category.label]}
            onValueChange={() => {
              setTrashNotifications({
                ...trashNotifications,
                [category.label]: !trashNotifications[category.label],
              });
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  trash: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  text: {
    fontSize: 18,
  },
});

export default TrashScreen;
