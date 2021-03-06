import React, {Component} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
const { Map } = require('immutable');
import firebase from 'firebase';
import ModalSelector from 'react-native-modal-selector';
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob';
import { firebaseApp } from './App.js';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const uploadImage = (uri, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios'? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null
    const imageRef = firebaseApp.storage().ref('images').child(`${sessionId}`)

    fs.readFile(uploadUri, 'base64')
    .then((data) => {
      return Blob.build(data, { type: `${mime};BASE64`} )
    })
    .then((blob) => {
      uploadBlob = blob
      return imageRef.put(blob, { contentType: mime })
    })
    .then(() => {
      uploadBlob.close()
      return imageRef.getDownloadURL()
    })
    .then((url) => {
      resolve(url)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export default class EditPlant extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newName: '',
      newSpecies: '',
      uploadURL: '',
    }
  }

  handleName = (text) => {
      this.setState({ newName: text })
  }
  changeInfo = (newName, newSpecies, newImageURL) => {
    key = this.props.navigation.getParam('key', 'Info')
    firebase.database().ref('/info/' + key.id).update({
      name: newName,
      species: newSpecies,
      img: newImageURL,
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
  chooseImage() {
    this.setState({ uploadURL: '' })

    ImagePicker.showImagePicker({}, response => {
      console.log('Response: ', response);

      if(response.didCancel) {
        console.log('User cancelled picker');
      }
      else if(response.error) {
        console.log('ImagePicker error: ', response.error);
      }
      else if(response.customButton) {
        console.log('Pressed custom button: ', response.customButton);
      }

      uploadImage(response.uri)
        .then(url => this.setState({ uploadURL: url} ))
        .catch(error => console.log(error))
    })
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
          style = {styles.photoButton}
          onPress = {
            () => this.chooseImage()
          }>
          <Text style = {styles.submitButtonText}> Choose Image </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style = {styles.submitButton}
            onPress = {
            () => this.changeInfo(this.state.newName, this.state.newSpecies, this.state.uploadURL)
            }>
            <Text style = {styles.submitButtonText}> Submit Changes </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   container: {
      paddingTop: 23
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#13771b',
      borderWidth: 1
   },
   photoButton: {
      backgroundColor: '#4a9b51',
      padding: 10,
      margin: 15,
      height: 40,
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
