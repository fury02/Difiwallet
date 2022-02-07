import React from "react";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import DrawerNavigatorScreen from "./DrawerNavigatorScreen";
import HistoryOperationsScreen from "../components/screen/tab/HistoryOperationsScreen";
import BlockchainOperationsScreen from "../components/screen/tab/BlockchainOperationsScreen";

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigatorScreen(){
  return(
    <Tab.Navigator barStyle={{ backgroundColor: 'teal' }} activeColor="gray" >
      <Tab.Screen
        name="MainScreen"
        component={DrawerNavigatorScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu" color={color} size={25} />
          ),
        }}/>
      <Tab.Screen
        name="TransactionsScreen"
        component={BlockchainOperationsScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="send" color={color} size={25} />
          ),
        }} />
      <Tab.Screen
        name="HistoryScreen"
        component={HistoryOperationsScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="update" color={color} size={25} />
          ),
        }} />
    </Tab.Navigator>
  );
}
