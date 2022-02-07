import React from 'react';
import EncryptedStorage from "react-native-encrypted-storage";
import {
  Button,
  Center,
  Divider,
  Input,
  NativeBaseProvider,
  Toast,
  VStack,
  HStack, InputGroup, InputLeftAddon
} from "native-base";
import Clipboard from "@react-native-clipboard/clipboard";

import nodejs from "nodejs-mobile-react-native";

import { SECURE_STORAGE } from '../../../const/Crypto';
import { Server } from "../../../const/Server";

export default class AccountCreateScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      createId: '',
      createMnemonic: '',
      createIdentity: '',
    };
    this.listenerRefCreateAccount = null;
  }

  componentDidMount()
  {
    nodejs.start(Server.StartJsMobile);
    this.listenerRefCreateAccount = (msg) => {this.channelHandlerCreateAccount(msg);}
    nodejs.channel.addListener( Server.EventCreateAccount, this.listenerRefCreateAccount, this);
  }

  componentWillUnmount()
  {
    if (this.listenerRefCreateAccount) {
      nodejs.channel.removeListener(Server.EventCreateAccount, this.listenerRefCreateAccount);
    }
  }

  private channelHandlerCreateAccount(msg: string){
    try {
      let account = JSON.parse(msg);
      this.setState({createId: account.AccountId});
      this.setState({createMnemonic: account.Mnemonic});
      this.setState({createIdentity: account.Identity});
    }
    catch(error) {  console.log(error);  }
  }

  private async clickCreateAccount(){
    try {
      nodejs.channel.post(Server.EventCreateAccount, 'create');
    }
    catch(error) {  console.log(error);  }
  }

  private async clickSaveAccountCreated(){
    try {
      if(this.state.createMnemonic !== undefined) {
        const sm = {mnemonic: this.state.createMnemonic};
        await EncryptedStorage.setItem(SECURE_STORAGE, JSON.stringify(sm));

        //**Rechecking save mnemonic**//
        const mnemonic_json = await EncryptedStorage.getItem(SECURE_STORAGE);
        if (mnemonic_json !== undefined) {
          if(this.state.createMnemonic == JSON.parse(mnemonic_json).mnemonic){
            Toast.show({ title: "Saved!"});
            //**For updating components**//
            nodejs.channel.post(Server.EventSavedAccount, this.state.createMnemonic);
            //**For updating components**//
            nodejs.channel.post(Server.EventBalanceAccount, this.state.createMnemonic);
          }
        }
      }
    }
    catch(error) {  console.log(error);  }
  }

  private async clickCopyMnemonic(){
    try {
      Clipboard.setString(this.state.createMnemonic);
    }
    catch(error) {  console.log(error);  }
  }

  private async clickCopyId(){
    try {
      Clipboard.setString(this.state.createId);
    }
    catch(error) {  console.log(error);  }
  }

  private async clickCopyIdentity(){
    try {
      Clipboard.setString(this.state.createIdentity);
    }
    catch(error) {  console.log(error);  }
  }


  render() {
    return (
      <NativeBaseProvider>
        <Center flex={2} px="3">
          <VStack space={3} alignItems="center">
            <Divider />
            <InputGroup w={{ base: "70%", md: "285", }}>
              <InputLeftAddon children={"Seed:              "} />
              <Input w={{ base: "65%", md: "100%", }}
                     placeholder=""
                     InputRightElement={<Button size="xs" rounded="xs" w="2/6" h="full" colorScheme="green"
                                                onPress={() =>{Toast.show({ title: "Copied mnemonic"}); this.clickCopyMnemonic()}}>Copy</Button>
                     }
              >{this.state.createMnemonic}</Input>
            </InputGroup>
            <InputGroup w={{ base: "70%", md: "285", }}>
              <InputLeftAddon children={"Address (ID):"} />
              <Input w={{ base: "65%", md: "100%", }}
                     placeholder=""
                     InputRightElement={<Button size="xs" rounded="xs" w="2/6" h="full" colorScheme="gray"
                                                onPress={() =>{Toast.show({ title: "Copied address (id)"});this.clickCopyId()} }>Copy</Button>
                     }
              >{this.state.createId}</Input>
            </InputGroup>
            <InputGroup w={{ base: "70%", md: "285",  }}>
              <InputLeftAddon children={"Principal:       "} />
              <Input w={{ base: "65%", md: "100%", }}
                     placeholder=""
                     InputRightElement={<Button size="xs" rounded="xs" w="2/6" h="full" colorScheme="gray"
                                                onPress={() =>{Toast.show({ title: "Copied principal"}); this.clickCopyIdentity()} }>Copy</Button>
                     }
              >{this.state.createIdentity}</Input>
            </InputGroup>

            <HStack space={3} alignItems="center">

                <Button  size={"lg"} variant="outline" colorScheme="primary"
                         onPress={() => this.clickCreateAccount()}>
                  Generate
                </Button>

                <Button size={"lg"} variant="outline" colorScheme="success"
                         onPress={() => {this.clickSaveAccountCreated()}}>
                  Save
                </Button>

            </HStack>
          </VStack>
        </Center>
      </NativeBaseProvider>
    );
  }
}

