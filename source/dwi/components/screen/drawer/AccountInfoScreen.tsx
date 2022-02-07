import React from 'react';
import {
  Alert,
  Box,
  Center,
  CloseIcon,
  HStack,
  IconButton,
  NativeBaseProvider,
  VStack,
  Text,
  Fab,
  Icon
} from "native-base";
import EncryptedStorage from "react-native-encrypted-storage";

import nodejs from "nodejs-mobile-react-native";

import {SECURE_STORAGE} from "../../../const/Crypto";
import {Server} from "../../../const/Server";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class AccountInfoScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      savedId: '',
      savedMnemonic: '',
      savedIdentity: '',
      accountBalance: ''
    };

    this.listenerRefSavedAccount = null;
    this.listenerRefBalanceAccount = null;

    this.getBalanceAccount();
  }

  componentDidMount()
  {
    nodejs.start(Server.StartJsMobile);

    this.listenerRefSavedAccount = (msg) => {this.channelHandlerSavedAccount(msg);}
    nodejs.channel.addListener( Server.EventSavedAccount, this.listenerRefSavedAccount, this);

    this.listenerRefBalanceAccount = (msg) => {this.channelHandlerBalanceAccount(msg);}
    nodejs.channel.addListener( Server.EventBalanceAccount, this.listenerRefBalanceAccount, this);
  }

  componentWillUnmount()
  {
    if (this.listenerRefSavedAccount) {
      nodejs.channel.removeListener(Server.EventSavedAccount, this.listenerRefSavedAccount);
    }
    if (this.listenerRefBalanceAccount) {
      nodejs.channel.removeListener(Server.EventBalanceAccount, this.listenerRefBalanceAccount);
    }
  }

  private channelHandlerSavedAccount(msg: string){
    try {
      let account = JSON.parse(msg);
      this.setState({savedId: account.AccountId});
      this.setState({savedMnemonic: account.Mnemonic});
      this.setState({savedIdentity: account.Identity});
    }
    catch(error) { console.log(error); }
  }

  private channelHandlerBalanceAccount(msg: string){
    try {
      let balance = JSON.parse(msg);
      balance = balance + ' ' + 'ICP';
      this.setState({accountBalance: balance});
    }
    catch(error) {
      console.log(error);
    }
  }

  private async getBalanceAccount() {
    try {
      const mnemonic = await this.getSavedAccount();
      nodejs.channel.post(Server.EventBalanceAccount, mnemonic);
    } catch (error) {
      console.log(error);
    }
  }

  private async getSavedAccount(): string {
    try {
      const mnemonic_json = await EncryptedStorage.getItem(SECURE_STORAGE);
      if (mnemonic_json !== undefined) {
        const mnemonic = JSON.parse(mnemonic_json).mnemonic;
        nodejs.channel.post(Server.EventSavedAccount, mnemonic);
        return mnemonic;
      }
      else { return ''; }
    }
    catch(error) { console.log(error); }
  }

  render() {
    return(
        <NativeBaseProvider>
          <Center flex={1} px="3">
            <Alert w="100%" status="info" colorScheme="green">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between" >
                  <HStack flexShrink={1} space={2} alignItems="center">
                    <Alert.Icon />
                    <Text fontSize="md" fontWeight="medium" color="coolGray.800"> Current Wallet Information </Text>
                  </HStack>
                </HStack>
                <Box textAlign={"center"} pl="6" _text={{ color: "coolGray.900",}} >
                  Address wallet: {this.state.savedId}
                </Box>
                <Box textAlign={"center"} pl="6" _text={{ color: "coolGray.900",}} >
                  Principal wallet: {this.state.savedIdentity}
                </Box>
                <Box textAlign={"center"} pl="6" _text={{ color: "amber.900",}} >
                  Balance wallet: {this.state.accountBalance}
                </Box>
              </VStack>
            </Alert>
          </Center>
          <Fab
            colorScheme="yellow"
            size="sm"
            icon={ <Icon color="white" as={<MaterialIcons name="replay" />} size="4"/> }
            onPress={()=> this.getBalanceAccount()}
          />
        </NativeBaseProvider>
    );
  }
}


