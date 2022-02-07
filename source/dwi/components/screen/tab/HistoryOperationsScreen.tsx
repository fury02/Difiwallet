import React, { useState } from "react";
import { NativeBaseProvider, VStack, Box, Heading, FlatList, Spacer, Text, Fab, Icon } from "native-base";
import EncryptedStorage from "react-native-encrypted-storage";

import nodejs from "nodejs-mobile-react-native";

import {SECURE_STORAGE } from "../../../const/Crypto";
import HistoryOperations from "../../../utils/HistoryOperations";
import {Server } from "../../../const/Server";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


export default class HistoryOperationsScreen extends React.Component {
  private transactions: any;
  constructor(props){
    super(props);
    this.state = {
      usedMnemonic: '',
      usedId: '',
      usedIdentity: '',
      tableData: []
    };
    this.listenerRefHistoryTransactionsRestoreAccount = null;

    this.runDataUpdate();
  }

  componentDidMount()
  {
    nodejs.start(Server.StartJsMobile);
    this.listenerRefHistoryTransactionsRestoreAccount = (msg) => {this.channelHandlerHistoryTransactionsRestoreAccount(msg);}
    nodejs.channel.addListener( Server.EventRestoreAccount, this.listenerRefHistoryTransactionsRestoreAccount, this);
  }

  componentWillUnmount()
  {
    if (this.listenerRefHistoryTransactionsRestoreAccount) {
      nodejs.channel.removeListener(Server.EventRestoreAccount, this.listenerRefHistoryTransactionsRestoreAccount);
    }
  }

  private channelHandlerHistoryTransactionsRestoreAccount(msg: string){
    try {
      let account = JSON.parse(msg);
      this.setState({usedId: account.AccountId});
      this.setState({usedMnemonic: account.Mnemonic});
      this.setState({usedIdentity: account.Identity});

      this.restoreHistoryTransaction();
    }
    catch(error) {
      console.log(error);
    }
  }

  private async restoreHistoryTransaction(){
    try {
      const ho = new HistoryOperations(this.state.usedId);
      ho.getICPTransactions().then(i => {
        this.setState({tableData: i});
      });
    }
    catch(error) {
      console.log(error);
    }
  }

  private async runDataUpdate(){
    try {
      const mnemonic_json = await EncryptedStorage.getItem(SECURE_STORAGE);
      if (mnemonic_json !== undefined) {
        const mnemonic = JSON.parse(mnemonic_json).mnemonic;
        nodejs.channel.post(Server.EventRestoreAccount, mnemonic);
      }
      else { }
    }
    catch(error) {
      console.log(error);
    }
  }

  flatListRefresh = () => {
    const [refreshing, setrefreshing] = useState(false);

    const ho = new HistoryOperations(this.state.usedId);

    const onRefreshHandler = () => {
      setrefreshing(true);
      setTimeout(() => {
        //**For updating else new account**//
        this.runDataUpdate();
        setrefreshing(false);
      }, 5000);
    };

    return (
      <NativeBaseProvider>
        <Box w={{ base: "100%", md: "25%", }} >
          <Heading fontSize="xl" p="4" pb="3"> Transactions </Heading>
          <FlatList data={this.state.tableData}
                    refreshing={refreshing}
                    onRefresh={onRefreshHandler}
                    renderItem={({item}) => (
                      <Box borderBottomWidth="1" _dark={{ borderColor: "gray.600", }} borderColor="coolGray.200" pl="4" pr="5" py="2">
                        <VStack>
                          <Text color={item.type == 'SEND' ? "amber.900" : "green.900"}>
                            {item.type}
                          </Text>
                          <Text>
                            Status: {item.details.status}
                          </Text>
                          <Text fontStyle={'italic'}>
                            To: {item.details.to}
                          </Text>
                          <Text style={{fontWeight: "bold"}}>
                            Amount: {item.details.amount}
                          </Text>
                          <Text>
                            Fee: {item.details.fee.amount}
                          </Text>
                        </VStack>
                        <Spacer />
                      </Box>
                    )}
                    keyExtractor={(item) => item.hash}
          />
          <Fab
            colorScheme="yellow"
            size="sm"
            icon={ <Icon color="white" as={<MaterialIcons name="replay" />} size="4"/> }
            onPress={()=> this.runDataUpdate()}
          />
        </Box>
      </NativeBaseProvider>
    )
  }

  render() {
    return (<this.flatListRefresh/>);
  }
}
