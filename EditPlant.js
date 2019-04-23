import React, {Component} from "react";
import { View, FlatList, List, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';
import { ListItem } from 'react-native-elements';
const { Map } = require('immutable');
import firebase from 'firebase';
import ModalSelector from 'react-native-modal-selector';

export default class EditPlant extends React.Component {
  state = {
    newName: '',
    newSpecies: ''
  }
  handleName = (text) => {
      this.setState({ newName: text })
  }
  changeInfo = (newName, newSpecies) => {
    key = this.props.navigation.getParam('key', 'Info')
    firebase.database().ref('/info/' + key.id).update({
      name: newName,
      species: newSpecies
    });
    Alert.alert(
      'Plant Data Changed',
      'newName Changed to: ' + newName + '\nSpecies Changed to: ' + newSpecies,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Info'),
      headerStyle: {
        backgroundColor: '#43a047',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
      },
    };
  };
  render(){
    const { navigation } = this.props;
    let index = 0;
    const data = [
      { key: index++, label: "African violet" },
      { key: index++, label: "Cactus" },
      { key: index++, label: "Daffodil" },
      { key: index++, label: "Orchid" },
      { key: index++, label: "Rose" },
      { key: index++, label: "Succulent" },
      { key: index++, label: "Spider plant" },
      { key: index++, label: "Wandering jew" },
    ]
    
    return(
      <View style = {styles.container}>
        <Text>    Edit Plant Data</Text>
        <TextInput style = {styles.input}
            underlineColorAndroid = "transparent"
            placeholder = "Name"
            placeholderTextColor = "#13771b"
            autoCapitalize = "none"
            onChangeText = {this.handleName}/>

        <ModalSelector
          data={data}
          initValue="Species"
          style={styles.input}
          onChange={(option)=>{ this.setState({newSpecies:option.label}) }}>
          <TextInput
            editable={false}
            placeholder="Species"
            placeholderTextColor = "#13771b"
            value={this.state.newSpecies} />
        </ModalSelector>

        <TouchableOpacity
            style = {styles.submitButton}
            onPress = {
            () => this.changeInfo(this.state.newName, this.state.newSpecies)
            }>
            <Text style = {styles.submitButtonText}> Submit Changes </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   container: {
      paddingTop: 23,
      color: 'white'
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#13771b',
      borderWidth: 1
   },
   submitButton: {
      backgroundColor: '#13771b',
      padding: 10,
      margin: 15,
      height: 40,
   },
   submitButtonText:{
      color: 'white'
   }
})
