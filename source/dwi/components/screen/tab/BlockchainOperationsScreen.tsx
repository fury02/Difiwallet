import React from "react";
import {useState} from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import {
  Button,
  Divider,
  Input,
  NativeBaseProvider,
  Toast,
  VStack,
  InputGroup,
  InputLeftAddon,
  Center,
  Modal,
} from "native-base";
import EncryptedStorage from "react-native-encrypted-storage";

import nodejs from "nodejs-mobile-react-native";

import { Server } from "../../../const/Server";
import { SECURE_STORAGE } from "../../../const/Crypto";

export default class BlockchainOperationsScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      accountBalance: '',
      sendingResult: '',
      addressSendingTo: '',
      balanceSendingTo: ''
    };

    this.listenerRefBalanceAccount = null;
    this.listenerRefSendBaseICP = null;

    this.getBalanceAccount();
  }

  componentDidMount()
  {
    nodejs.start(Server.StartJsMobile);

    this.listenerRefBalanceAccount = (msg) => {this.channelHandlerBalanceAccount(msg);}
    nodejs.channel.addListener(Server.EventBalanceAccount, this.listenerRefBalanceAccount, this);

    this.listenerRefSendBaseICP = (msg) => {this.channelHandlerSendBaseICP(msg);}
    nodejs.channel.addListener(Server.EventSendBaseICP, this.listenerRefSendBaseICP, this);
  }

  componentWillUnmount()
  {
    if (this.listenerRefBalanceAccount) {
      nodejs.channel.removeListener(Server.EventBalanceAccount, this.listenerRefBalanceAccount);
    }
    if (this.listenerRefSendBaseICP) {
      nodejs.channel.removeListener(Server.EventSendBaseICP, this.listenerRefSendBaseICP);
    }
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

  private channelHandlerSendBaseICP(msg: string){
    try {
      // let sendingResult = JSON.parse(msg);???
      // this.setState({sendingResult: sendingResult});???

      Toast.show({title: msg});
    }
    catch(error) {
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
      else {
        return '';
      }
    }
    catch(error) { console.log(error); }
  }

  private async getBalanceAccount() {
    try {
      const mnemonic = await this.getSavedAccount();
      nodejs.channel.post(Server.EventBalanceAccount, mnemonic);
    }
    catch(error) { console.log(error); }
  }

  private async sendTokenBaseICP() {
    try {
      const mnemonic = await this.getSavedAccount();
      const address = this.state.addressSendingTo;
      const balance = this.state.balanceSendingTo;
      const json = {Mnemonic: mnemonic, Address: address, Balance: balance};
      nodejs.channel.post(Server.EventSendBaseICP, json);
    }
    catch(error) { console.log(error); }
  }

  private changeTextAddressSendingTo(txt: string){
    try {
      this.setState({addressSendingTo: txt});
    }
    catch(error) { console.log(error); }
  }

  private changeTextBalanceSendingTo(txt: string){
    try {
      this.setState({balanceSendingTo: txt});
    }
    catch(error) { console.log(error); }
  }

  private async clickPasteId(){
    try {
      Clipboard.getString().then(i => this.setState({addressSendingTo: i}));
    }
    catch(error) {console.log(error);}
  }

  private async clickPasteCount(){
    try {
      Clipboard.getString().then(i => this.setState({balanceSendingTo : i}));
    }
    catch(error) {console.log(error);}
  }

  ConfirmOperation = () => {
    const [showModal, setShowModal] = useState(false);
    return (
      <>
        <Button onPress={() => setShowModal(true)}>Send</Button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{ _dark: { bg: "coolGray.800", }, bg: "warmGray.50", }} >
          <Modal.Content maxWidth="350" maxH="300">
            <Modal.CloseButton />
            <Modal.Header>Confirmation</Modal.Header>
            <Modal.Body>
              Sending ICP to address: {this.state.addressSendingTo}
              Amount: {this.state.balanceSendingTo}
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button variant="ghost" colorScheme="blueGray" onPress={() => {setShowModal(false) }}> Cancel </Button>
                <Button colorScheme="danger" onPress={() => { Toast.show({ title: "Sending"}); this.sendTokenBaseICP();
                  setShowModal(false) }}> Apply </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </>
    )
  }

  render() {
    return (
      <NativeBaseProvider>
        <Center flex={2} px="3">
          <VStack space={3} alignItems="center">
            <Divider />
            <InputGroup w={{ base: "70%", md: "285", }}>
              <InputLeftAddon children={"Send To:"} />
              <Input w={{ base: "65%", md: "100%", }}
                     placeholder=""
                     InputRightElement={<Button size="xs" rounded="xs" w="2/6" h="full" colorScheme="green"
                                                onPress={() =>{ this.clickPasteId()} }>Adress</Button>
                     }
                     onChangeText={(i) => this.changeTextAddressSendingTo(i)}
              >{this.state.addressSendingTo}</Input>
            </InputGroup>
            <InputGroup w={{ base: "70%", md: "285", }}>
              <InputLeftAddon children={"Balance:"} />
              <Input w={{ base: "65%", md: "100%", }}
                     placeholder=""
                     InputRightElement={<Button size="xs" rounded="xs" w="2/6" h="full" colorScheme="gray"
                                                onPress={() =>{this.clickPasteCount()} }>Count</Button>
                     }
                     onChangeText={(i) => this.changeTextBalanceSendingTo(i)}
              >{this.state.balanceSendingTo}</Input>
            </InputGroup>
            <Divider />

            <this.ConfirmOperation/>

          </VStack>
        </Center>
      </NativeBaseProvider>
    );
  }
}
