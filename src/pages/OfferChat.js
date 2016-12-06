 'use strict';

  import React, { Component } from 'react';
  import {
     Platform,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Dimensions,
    TouchableOpacity,
    ScrollView
  } from 'react-native';
  import Routes from 'funshare/Routes';
  import style from '../styles/common-styles.js';
  import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';
  import IcoButton from 'funshare/src/components/icobutton';
  import Firebase from 'firebase';
  import CustomActions from 'funshare/src/CustomActions';
  import CustomView from 'funshare/src/CustomView';

  export default class OfferChat extends Component {

   constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;
      var self=this;
    var i = 0;
    var num=0;
    var currentMessages = [];
      Firebase.database()
      .ref('messages')
      .child(self.props.iteminfo.offerKey)
      .once('value')
      .then(function(snapshot) {
       num =snapshot.numChildren();
        
        snapshot.forEach(function(childSnapshot) {

         Firebase.database()
         .ref('messages')
         .child(childSnapshot.key).once('value').then(function(snapshot) {
          
              
             currentMessages.push(snapshot.val());
             console.log(currentMessages);
    
    

            i++;
            if (i==num){

             if (currentMessages!= null){
                  self.setState({
                    messages:currentMessages
                  })
                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            
          }

        });

      })

   
    });
  
  }

  componentWillUnmount() {
    this._isMounted = false;
    console.log(this.state.messages);
  }
   componentDidMount() {
    var self=this;
    
  
  }


  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('funshare/src/data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {
    var self=this;
    this.setState((previousState) => {

      Firebase.database().ref('messages').child(self.props.iteminfo.offerKey).set(GiftedChat.append(previousState.messages, messages));
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

  
  }


  onReceive(text) {
    this.setState((previousState) => {
      
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
           avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
    //Firebase.database().ref('messages').set(previousState);
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        console.log('option 1');
      },
      'Action 2': (props) => {
        console.log('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}

        user={{
          _id: 1, // sent messages should have same user._id
        }}

        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
      />
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

AppRegistry.registerComponent('OfferChat', () => OfferChat);