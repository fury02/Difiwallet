import React from 'react';
import {
  Center,
  NativeBaseProvider,
  VStack,
  Text
} from "native-base";

export default class WalletInfoScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      textInfo: 'Coming Soon'
    };
  }

  componentDidMount() {  }

  componentWillUnmount()  {  }

  render() {
    return(
        <NativeBaseProvider>
          <Center flex={2} px="3">
            <VStack space={10} alignItems="center">
              <Text fontSize="xs">{this.state.textInfo}</Text>
            </VStack>
          </Center>
        </NativeBaseProvider>)
    }
}


