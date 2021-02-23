import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, RefreshControl, StyleSheet, Switch } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import Dropdown from './Dropdown';
import config from './private/config';
import {
  getTemperatures,
  getAppliances,
  turnACOnOff,
  updateAC,
  sendLightButton,
  sendSignal,
} from './remo';

const formatTemperature = temperature => temperature ? `${temperature}°C` : '?';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [temperatures, setTemperatures] = useState({});
  const [appliances, setAppliances] = useState({});
  const refreshState = () => {
    setRefreshing(true);
    Promise.all([
      getTemperatures().then(temperatures => setTemperatures(temperatures)),
      getAppliances().then(appliances => setAppliances(appliances)),
    ]).then(() => setRefreshing(false));
  };
  useEffect(refreshState, []);

  const turnOnOff = async (applianceName) => {
    const appliance = appliances[applianceName];
    let newState = appliance.state;
    if (appliance.type === 'AC') {
      newState = await turnACOnOff(appliance.id, !appliance.state.on);
    }
    if (appliance.type === 'LIGHT') {
      await sendLightButton(appliance.id, 'onoff');
    }
    setAppliances({
      ...appliances,
      [applianceName]: { ...appliance, state: newState },
    });
  };

  const useQuickMenu = async (applianceName, value) => {
    if (!value) return;

    const appliance = appliances[applianceName];
    let newState = appliance.state;
    if (appliance.type === 'AC') {
      newState = await updateAC(appliance.id, value);
    }
    if (appliance.type === 'LIGHT') {
      if (value.type === 'signal') {
        console.log(appliance.available.signals);
        await sendSignal(appliance.available.signals[value.name]);
      }
      if (value.type === 'button') {
        await sendLightButton(appliance.id, value.name);
      }
    }
    setAppliances({
      ...appliances,
      [applianceName]: { ...appliance, state: newState },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshState} />}
    >
      {config.home.map(({ room, appliances: configAppliances }) => (
        <View style={styles.room} key={room}>
          <View style={styles.roomName}>
            <Text style={styles.text}>{room}</Text>
            <Text style={styles.text}>{formatTemperature(temperatures[room])}</Text>
          </View>
          {configAppliances.filter(a => appliances[a.name]).map(({ name, menu }) => (
            <View style={styles.appliance} key={name}>
              <View style={styles.iconAndSwitch}>
                <View style={styles.icon}>
                  {appliances[name].type === 'AC' && (
                    <MaterialCommunityIcons name="air-conditioner" size={24} color="black" />
                  )}
                  {appliances[name].type === 'LIGHT' && (
                    <FontAwesome5 name="lightbulb" size={24} color="black" />
                  )}
                </View>
                <Switch
                  value={appliances[name].state.on}
                  onValueChange={() => turnOnOff(name)}
                />
              </View>
              <Dropdown
                items={menu}
                value={appliances[name].state.ac}
                onChange={value => useQuickMenu(name, value)}
                style={styles.dropdown}
              />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  room: {
    padding: 16,
    width: '100%',
  },
  appliance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    height: 64,
  },
  roomName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 30,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconAndSwitch: {
    flexDirection: 'row',
    width: 100,
  },
  text: {
    fontSize: 22,
  },
  dropdown: {
    width: 200,
  },
});

export default HomeScreen;
