import React from 'react';
import {
  Button,
  Center,
  Divider,
  Input,
  InputGroup,
  InputLeftAddon,
  NativeBaseProvider,
  Toast,
  VStack
} from "native-base";
import EncryptedStorage from "react-native-encrypted-storage";
import QRCode from "react-native-qrcode-svg";
import Clipboard from "@react-native-clipboard/clipboard";

import nodejs from "nodejs-mobile-react-native";

import {SECURE_STORAGE} from "../../../const/Crypto";
import {Server} from "../../../const/Server";

export default class AccountReceiveScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      savedId: '',
      savedMnemonic: '',
      savedIdentity: ''
    };

    this.listenerRefSavedAccount = null;

    this.getSavedAccount();
  }

  componentDidMount()
  {
    nodejs.start(Server.StartJsMobile);

    this.listenerRefSavedAccount = (msg) => {this.channelHandlerSavedAccount(msg);}
    nodejs.channel.addListener( Server.EventSavedAccount, this.listenerRefSavedAccount, this);
  }

  componentWillUnmount()
  {
    if (this.listenerRefSavedAccount) {
      nodejs.channel.removeListener(Server.EventSavedAccount, this.listenerRefSavedAccount);
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

  private async clickCopyId(){
    try {
      Clipboard.setString(this.state.savedId);
    }
    catch(error) {  console.log(error);  }
  }

  render() {
    let sw;
    if(this.state.savedId == ''){
      sw =
        <NativeBaseProvider>
          <Center flex={1} px="3">
          </Center>
        </NativeBaseProvider>
    }
    else{
      let logoFromFile = require('../../../assets/ic_foreground.png');
      sw =
        <NativeBaseProvider>
          <Center flex={2} px="3">
            <VStack space={10} alignItems="center">
              <QRCode value={this.state.savedId} logo={logoFromFile}size={150} logoSize={30} color='black' backgroundColor='transparent' logoBackgroundColor='transparent'>
              </QRCode>
              <Divider />
              <InputGroup w={{ base: "70%", md: "285", }}>
                <InputLeftAddon children={"Address:"} />
                <Input type="text" alignItems={"center"}
                       w={{ base: "85%", md: "25%", }}
                       h={{ base: "100%", md: "25%", }}
                       InputRightElement={<Button size="xs" rounded="xs" w="1/5" h="full" colorScheme="gray"
                                                  onPress={() =>  {Toast.show({ title: "Copied address id"}); this.clickCopyId()}}>Copy</Button>
                       }
                       placeholder="">{this.state.savedId}
                </Input>
              </InputGroup>
            </VStack>
          </Center>
        </NativeBaseProvider>
    }
    return ( sw );
  }
}


