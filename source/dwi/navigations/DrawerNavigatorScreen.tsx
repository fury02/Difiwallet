import React from 'react';
import {createDrawerNavigator } from '@react-navigation/drawer';
import AccountCreateScreen from "../components/screen/drawer/AccountCreateScreen";
import AccountRestoreScreen from "../components/screen/drawer/AccountRestoreScreen";
import AccountInfoScreen from "../components/screen/drawer/AccountInfoScreen";
import AccountReceiveScreen from "../components/screen/drawer/AccountReceiveScreen";
import WalletInfoScreen from "../components/screen/drawer/WalletInfoScreen";
import WalletSettingsScreen from "../components/screen/drawer/WalletSettingsScreen";
import WalletLicenseScreen from "../components/screen/drawer/WalletLicenseScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigatorScreen() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Account" component={AccountInfoScreen} />
      <Drawer.Screen name="Create" component={AccountCreateScreen} />
      <Drawer.Screen name="Restore" component={AccountRestoreScreen} />
      <Drawer.Screen name="Receive" component={AccountReceiveScreen} />
      <Drawer.Screen name="License" component={WalletLicenseScreen} />
      {/*<Drawer.Screen name="Info" component={WalletInfoScreen} />*/}
      {/*<Drawer.Screen name="Settings" component={WalletSettingsScreen} />*/}
    </Drawer.Navigator>
  );
}
