import React from 'react';
import EncryptedStorage from "react-native-encrypted-storage";
import {
  Box,
  Button,
  Divider,
  Input,
  NativeBaseProvider,
  Toast,
  VStack,
  InputGroup,
  InputLeftAddon,
  Center
} from "native-base";
import Clipboard from "@react-native-clipboard/clipboard";

import nodejs from "nodejs-mobile-react-native";

import {SECURE_STORAGE} from "../../../const/Crypto";
import {Server} from "../../../const/Server";

export default class AccountRestoreScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      savedId: '',
      savedMnemonic: '',
      savedIdentity: '',
      inputMnemonic: '',
      restoreId: '',
      restoreMnemonic: '',
      restoreIdentity: '',
    };

    this.listenerRefRestoreAccount = null;
    this.listenerRefSavedAccount = null;

    this.getSavedAccount();
  }

  componentDidMount()
  {
    nodejs.start(Server.StartJsMobile);

    this.listenerRefRestoreAccount = (msg) => {this.channelHandlerRestoreAccount(msg);}
    nodejs.channel.addListener( Server.EventRestoreAccount, this.listenerRefRestoreAccount, this);

    this.listenerRefSavedAccount = (msg) => {this.channelHandlerSavedAccount(msg);}
    nodejs.channel.addListener( Server.EventSavedAccount, this.listenerRefSavedAccount, this);
  }

  componentWillUnmount()
  {
    if (this.listenerRefRestoreAccount) {
      nodejs.channel.removeListener(Server.EventRestoreAccount, this.listenerRefRestoreAccount);
    }
    if (this.listenerRefSavedAccount) {
      nodejs.channel.removeListener(Server.EventSavedAccount, this.listenerRefSavedAccount);
    }
  }

  private channelHandlerRestoreAccount(msg: string){
    try {
      let account = JSON.parse(msg);
      let id = account.AccountId;
      let saveMnemonic = account.Mnemonic;
      let identity = account.Identity;
      this.setState({restoreId: id});
      this.setState({restoreMnemonic: saveMnemonic});
      this.setState({restoreIdentity: identity});
      if(saveMnemonic !== undefined) {
        const save = {mnemonic: saveMnemonic};
        EncryptedStorage.setItem(SECURE_STORAGE, JSON.stringify(save));
        this.getSavedAccount();
      }
    }
    catch(error) { console.log(error); }
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

  private  async changeTextRestoreMnemonic(str: String){
    try {
        this.state.inputMnemonic = str;
    }
    catch(error) { console.log(error); }
  }

  private async clickCopyId(){
    try {
      Clipboard.setString(this.state.savedId);
    }
    catch(error) {  console.log(error);  }
  }

  private async clickCopyIdentity(){
    try {
      Clipboard.setString(this.state.savedIdentity);
    }
    catch(error) {  console.log(error);  }
  }

  private async clickCopyMnemonic(){
    try {
      Clipboard.setString(this.state.savedMnemonic);
    }
    catch(error) {  console.log(error);  }
  }

  private async clickPasteMnemonic(){
    try {
      Clipboard.getString().then(i => this.setState({inputMnemonic: i}));
    }
    catch(error) {  console.log(error);  }
  }

  private async clickRestoreAccount(){
    try {
      if (this.state.inputMnemonic !== ''){
        if(this.state.inputMnemonic.split(' ').length == 12){
          nodejs.channel.post(Server.EventRestoreAccount, this.state.inputMnemonic);
          //**For updating components**//
          nodejs.channel.post(Server.EventBalanceAccount, this.state.inputMnemonic);
        }
      }
    }
    catch(error) { console.log(error); }
  }

  render() {
    return (
      <NativeBaseProvider>
        <Center flex={2} px="3">
            <VStack space={3} alignItems="center">
              <Divider />
              <InputGroup w={{ base: "70%", md: "285", }}>
                <InputLeftAddon children={"Address (ID):"} />
                <Input w={{ base: "65%", md: "100%", }}
                       placeholder=""
                       InputRightElement={<Button size="xs" rounded="xs" w="2/6" h="full" colorScheme="green"
                                                  onPress={() =>{Toast.show({ title: "Copied address (id)"});this.clickCopyId()} }>Copy</Button>
                       }
                >{this.state.savedId}</Input>
              </InputGroup>
              <InputGroup w={{ base: "70%", md: "285", }}>
                <InputLeftAddon children={"Principal:       "} />
                <Input w={{ base: "65%", md: "100%", }}
                       placeholder=""
                       InputRightElement={<Button size="xs" rounded="xs" w="2/6" h="full" colorScheme="green"
                                                  onPress={() =>{Toast.show({ title: "Copied principal"}); this.clickCopyIdentity()} }>Copy</Button>
                       }
                >{this.state.savedIdentity}</Input>
              </InputGroup>
              <InputGroup w={{ base: "70%", md: "285", }}>
                <InputLeftAddon children={"Seed:              "} />
                <Input w={{ base: "65%", md: "100%", }}
                       placeholder=""
                       InputRightElement={<Button size="xs" rounded="xs" w="2/6" h="full" colorScheme="gray"
                                                  onPress={() =>{Toast.show({ title: "Copied mnemonic"}); this.clickCopyMnemonic()}}>Copy</Button>
                       }
                >{this.state.savedMnemonic}</Input>
              </InputGroup>
              <Input type="text" alignItems={"center"}
                // type="password"
                     w={{ base: "70%", md: "25%", }}
                     h={{ base: "20%", md: "25%", }}
                     InputLeftElement={<Button size="xs" rounded="sm" w="1/5" h="full" colorScheme="gray"
                                                onPress={() =>{this.clickPasteMnemonic()} }>Paste</Button>
                     }
                     InputRightElement={<Button size="xs" rounded="sm" w="1/5" h="full"
                                                onPress={() =>{this.clickRestoreAccount()} }>Restore</Button>
                     }
                     onChangeText={(i) => this.changeTextRestoreMnemonic(i)}
                     variant="rounded"
                     placeholder="">{this.state.inputMnemonic}
              </Input>

            </VStack>
        </Center>
      </NativeBaseProvider>
    );
  }
}
