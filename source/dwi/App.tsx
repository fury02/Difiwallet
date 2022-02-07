import React from 'react';
import {StyleSheet} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import StackNavigatorScreen from "./navigations/StackNavigatorScreen";

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <StackNavigatorScreen></StackNavigatorScreen>
      </NavigationContainer>
    );
  }
}

export default App;
