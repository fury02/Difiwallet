import React from 'react';
import {
  Center,
  NativeBaseProvider,
  VStack,
  Text, ScrollView, Divider, Heading, Box, Flex, Link, Container
} from "native-base";

export default class WalletLicenseScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text_1: 'GENERAL STATEMENT',
      text_2: 'This is open source software. By installing and using this software, you automatically agree and accept all the conditions described in this document. The source code of this application is distributed under the MIT license.',
      text_3: 'LIMITATION OF LIABILITY & DISCLAIMER OF WARRANTIES',
      text_4: 'You understand and agree that we have no control over, and no duty to take any action regarding: Failures, disruptions, errors, or delays in processing Virtual Currency that you may experience while using the Services; The risk of failure of hardware, software, and Internet connections; The risk of malicious software being introduced or found in the software underlying Difiwallet; The risk that third parties may obtain unauthorized access to information stored within your Wallet, including, but not limited to your Wallet address, private key, and mnemonic (backup) phrase; and The risk of unknown vulnerabilities in or unanticipated changes to the Internet Computer Network. You release us from all liability related to any losses, damages, or claims arising from:  user error such as forgotten passwords, incorrectly constructed transactions, or mistyped Virtual Currency addresses;  server failure or data loss; unauthorized access to the Difiwallet application; bugs or other errors in the Difiwallet software; and  any unauthorized third party activities, including, but not limited to, the use of viruses, phishing, brute forcing, or other means of attack against Difiwallet. We make no representations concerning any Third Party Content contained in or accessed through our Services. Any other terms, conditions, warranties, or representations associated with such content, are solely between you and such organizations and/or individuals.',
      text_5: 'INFORMATION APP',
      text_6: 'Version: 0.1.0',
      text_7: 'License: MIT',
    };
  }

  componentDidMount() {  }

  componentWillUnmount()  {  }

  render() {
    return(
      <NativeBaseProvider>
        <Center flex={2} px="3">
          <ScrollView>
            <Divider></Divider>
            <Heading textAlign="center" size={"xs"} bold> {this.state.text_1}</Heading>
            <Text italic> {this.state.text_2}</Text>
            <Divider></Divider>
            <Heading textAlign="center" size={"xs"} bold> {this.state.text_3}</Heading>
            <Text italic> {this.state.text_4}</Text>
            <Divider></Divider>
            <Heading textAlign="center" size={"xs"} bold> {this.state.text_5}</Heading>
            <Container>
              <Link mt={4} href="https://github.com/fury02/Difiwallet">
                Source: github.com
              </Link>
              <Text mt="3" size={"xs"} bold> {this.state.text_7}</Text>
            </Container>
          </ScrollView>
        </Center>
      </NativeBaseProvider>)
  }
}
