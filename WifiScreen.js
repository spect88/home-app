import React from 'react';
import { Text, View, StyleSheet, ScrollView, Share, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { FontAwesome5 } from '@expo/vector-icons';

import secrets from './private/secrets.json';

const WifiScreen = () => {
  const share = message =>
    Share.share({ message }).catch(error => alert(error.message));

  return (
    <ScrollView style={styles.scrollView}>
      {secrets.wifi.map(({ ssid, password }) => (
        <View style={styles.item} key={ssid}>
          <QRCode value={`WIFI:S:${ssid};T:WPA;P:${password};;`} size={200} />
          <View style={styles.credentials}>
            <View style={styles.icon}>
              <FontAwesome5 name="wifi" size={22} color="black" />
            </View>
            <Text style={styles.text}>{ssid}</Text>
          </View>
          <View style={styles.credentials}>
            <View style={styles.icon}>
              <FontAwesome5 name="key" size={22} color="black" />
            </View>
            <Text style={styles.text}>{password}</Text>
          </View>
          <View style={styles.share}>
            <Button
              onPress={() => share(`SSID: ${ssid}\nPASS: ${password}`)}
              title="Share"
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  item: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  credentials: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  icon: {
    width: 40,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
  share: {
    marginTop: 8,
  },
});

export default WifiScreen;
