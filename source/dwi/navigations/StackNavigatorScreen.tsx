import TabNavigatorScreen from "./TabNavigatorScreen";
import DrawerNavigatorScreen from "./DrawerNavigatorScreen";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function StackNavigatorScreen(){
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={TabNavigatorScreen}/>
      <Stack.Screen name="Drawer" component={DrawerNavigatorScreen}/>
    </Stack.Navigator>
  );
}
