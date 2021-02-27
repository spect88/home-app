import React from 'react';
import { Text, View, ScrollView, RefreshControl, StyleSheet, Switch } from 'react-native';
import { addDays, subDays, format, isToday, isTomorrow, endOfDay, startOfHour } from 'date-fns';

import useNotifications from './useNotifications';
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

  const { loading, refresh, schedule, isScheduled, cancel } = useNotifications();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      {config.trash.categories.map(category => (
        <View style={styles.trash} key={category.label}>
          <Text style={styles.text}>{category.label}:</Text>
          <Text style={styles.text}>
            {formatDate(findNextDate({ startingFrom, ...category }))}
          </Text>
          <Switch
            value={isScheduled(category.label)}
            onValueChange={() => {
              if (isScheduled(category.label)) {
                cancel(category.label);
                return;
              }
              const nextDate = findNextDate({ startingFrom, ...category });
              const dayBefore = subDays(nextDate, 1);
              dayBefore.setHours(23);
              const eveningBefore = startOfHour(dayBefore);
              schedule({
                id: category.label,
                content: { title: `${category.label} trash is collected tomorrow morning` },
                trigger: { date: eveningBefore },
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
