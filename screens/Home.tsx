import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import { Modal, Pressable, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons'; 
import * as Linking from 'expo-linking';
import axios from "axios";
import {arrayUnion} from 'firebase/firestore';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../core/fb-config';
import { useSelector, useDispatch } from 'react-redux';
//import userReducer from '../redux/reducers';

export default function Home() {
  const [image, setImage] = useState("");
  const [original, setOriginal] = useState("https://herrmans.eu/wp-content/uploads/2019/01/765-default-avatar.png");
  const [edited, setEdited] = useState("https://herrmans.eu/wp-content/uploads/2019/01/765-default-avatar.png");
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const diu = useSelector(state => state);

  // Firestore Database
  //const myDoc = doc(db, "MyCollection", "MyDocument")

  const Create = (merge:boolean) => {
    // MARK: Creating New Doc in Firebase
    // Before that enable Firebase in Firebase Console
    const myDoc = doc(db, "PalabrasClave", `${diu.diu}`)
    //const docRef = db2.collection('PalabrasClave').doc('UsuarioXX');

      getDoc(myDoc)
      // Handling Promises
        .then((snapshot) => {
          // MARK: Success
          console.log(snapshot.exists());
          //console.log(diu);
          //var db = firestore();
          if (snapshot.exists()) {
            //setKword(snapshot.data().words);
            setDoc(myDoc, {'words':arrayUnion(text)}, { merge: merge })
            //setDoc(doc(db, "PalabrasClave", `${diu.diu}`), {'words':arrayUnion(text)}, { merge: merge })
            
          } else {
            //setKword(text)
            const docData = {
              'words': [text]
            }
            setDoc(myDoc, docData)
          }

          /*setText(kword+text);
          const docData = {
            "words": text
          }
          console.log(text)
          setDoc(myDoc, docData)
            // Handling Promises
            .then(() => {
              // MARK: Success
              alert("Saved Succesfully!")
            })
            .catch((error) => {
              // MARK: Failure
              alert(error.message)
            })*/
        })
        
      
      //var keywords:string  = value;
      
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const shareImage = () => {    
    Linking.openURL(edited);
  }; 

  const ValidateResults = (get_url: string, result: any, is_validate: boolean) => {
    if (result.status == "succeeded") {
      if (is_validate) {
        setModalVisible(false); setStep(2);
      } else {
        setModalVisible(false);
        setOriginal(image);
        setEdited(result.output[0].file);
        setStep(3);
      }
    } else if (result.status == "failed") {
      console.log(result);
      if (is_validate) {
        setLoading(false); setMessage("Imagen invalida");
      } else {
        setLoading(false); setMessage("Ha ocurrido un error");
      }
    } else {
      GetResult(get_url, is_validate);
    }
  }

  const GetResult = (get_url: string, is_validate: boolean) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token 4edbef7708ee3e9651803f6e79e6d121090aa463");
    var requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };

    fetch(get_url, requestOptions)
      .then(response => response.text())
      .then(result => ValidateResults(get_url, JSON.parse(result), is_validate))
      .catch(error => console.log('error', error));
  }

  const EditImage = (image_url: string, target_text: string, is_validate: boolean) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token 4edbef7708ee3e9651803f6e79e6d121090aa463");
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "version": "b6568e6bebca9b3f20e7efb6c710906efeb2d1ac6574a7a9d350fa51ee7daec4",
      "input": {
        "input": image_url,
        "neutral": "a face",
        "target": target_text,
        "manipulation_strength": "4.1",
        "disentanglement_threshold": "0.15"
      }
    });
    var requestOptions = { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://api.replicate.com/v1/predictions", requestOptions)
    .then(response => response.text())
    .then(result => GetResult(JSON.parse(result).urls.get, is_validate))
    .catch(error => console.log('error', error));
  }

  const validateImage = (target_text: string, is_validate: boolean) => {
    if (image == "") {
      setModalVisible(true); setLoading(false);
      setMessage("Debe subir una imagen para poder validarla");
      return;
    }
    setModalVisible(true); setLoading(true);
    const fileName = image.split('/').pop();
    const fileType = fileName.split('.').pop();
    var formdata = new FormData();
    formdata.append("image", {uri:image,name:fileName,type:`image/${fileType}`});
    var requestOptions = {method: 'POST', body: formdata, redirect: 'follow' };
    fetch("https://api.imgbb.com/1/upload?expiration=600&key=4581f1ac9b7e147c310527b051b60f14", requestOptions)
      .then(response => response.text())
      .then(result => EditImage(JSON.parse(result).data.url, target_text, is_validate))
      .catch(error => console.log('error', error));
  }

  const initProcess = () => {
    setStep(3);
    if (text == "") {
      setModalVisible(true); setLoading(false);
      setMessage("Debe ingresar un texto para poder realizar la edición");
      return;
    }
    setModalVisible(true); setLoading(true);
    const options = {
      method: 'GET',
      url: 'https://google-translate20.p.rapidapi.com/translate',
      params: {text: text, tl: 'en', sl: 'es'},
      headers: {
        'X-RapidAPI-Key': '4f8c6f07b5msh9ae37d4ed244e3cp1c0535jsn922b13f2d3cc',
        'X-RapidAPI-Host': 'google-translate20.p.rapidapi.com'
      }
    };
    axios.request(options).then(function (response) {
      validateImage(response.data.data.translation, false);
    }).catch(function (error) {
	    console.error(error);
      setLoading(false); setMessage("Ha ocurrido un error");
    });
  }

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true}
        visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible);}}>
        <View style={styles.centeredView}>
          {!loading && <View style={styles.modalView}>
            <Text style={styles.modalText}>{message}</Text>
            <Pressable style={styles.buttonClose} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Ok</Text>
            </Pressable>
          </View>}
          {loading && <View style={styles.modalView}>
            <Text style={styles.modalText}>Cargando...</Text>
          </View>}
        </View>
      </Modal>
      {step == 1 && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable style={styles.button} onPress={pickImage}><Text style={styles.buttonText}>Subir Imagen</Text></Pressable>
        {(image != "") && <View>
          <Text style={styles.imageText}>La imagen subida es la siguiente:</Text>
          <Image source={{ uri: image }} style={{ width: 200, height: 200, marginLeft:'auto', marginRight:'auto'}} />
        </View>}
      </View>}
      {step == 1 && <Pressable style={styles.validateButton} onPress={() => validateImage("a smiling face", true)}><Text style={styles.buttonText}>Validar imagen</Text></Pressable>}
      {step == 2 && <View>
        <Text style={styles.inputLabel}>Ingrese las palabras clave por voz o texto:</Text>
        {/*<Pressable style={styles.recordButton}>
          <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/190/190514.png" }} style={{ width: 132, height: 132, marginLeft:'auto', marginRight:'auto'}} />
        </Pressable>*/}
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="cara sonriente"
        />
        <View style={styles.editButtonWrapper}>
          <Pressable style={styles.button} onPress={() => initProcess()}><Text style={styles.buttonText}>Editar imagen</Text></Pressable>
        </View>
        <View style={styles.editButtonWrapper}>
          <Pressable style={styles.backButton} onPress={() => setStep(1)}>
            <View><AntDesign name="left" size={20} color="white" /></View>
            <View><Text style={{fontSize:16, marginLeft:4}}>Cambiar imagen</Text></View>
          </Pressable>
        </View>
      </View>}
      {step == 3 && <View>
        <Text style={styles.inputLabel}>Resultado para las palabras clave "{text}":</Text>
        <View style={styles.imagesWrapper}>
            <Image source={{ uri: original }} style={{ width: 200, height: 200, marginLeft:'auto', marginRight:'auto'}} />
            <Image source={{ uri: edited }} style={{ width: 200, height: 200, marginLeft:'auto', marginRight:'auto'}} />
          </View>
        <View style={styles.editButtonWrapper}>
          <Pressable style={styles.finalButton} onPress={() => shareImage()}><Text style={styles.buttonText}>Guardar imagen</Text></Pressable>
          <Pressable style={styles.finalButton} onPress={() => shareImage()}><Text style={styles.buttonText}>Compartir</Text></Pressable>
          <Pressable style={styles.finalButton} onPress={() => Create(true)}><Text style={styles.buttonText}>Guardar palabras clave</Text></Pressable>
          <Pressable style={styles.finalButton} onPress={() => setStep(1)}><Text style={styles.buttonText}>Editar otra imagen</Text></Pressable>
        </View> 
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 22
  },
  button: {
    backgroundColor: "#545755",
    borderRadius: 12,
    height: 42,
    width: 168,
    paddingTop: 10,
    marginBottom: 22
  },
  finalButton: {
    backgroundColor: "#545755",
    borderRadius: 12,
    height: 42,
    width: 200,
    paddingTop: 10,
    marginBottom: 22
  },
  validateButton: {
    backgroundColor: "#545755",
    borderRadius: 12,
    height: 42,
    width: 168,
    paddingTop: 10,
    marginBottom: 162
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
  imageText: {
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#95989c",
    borderRadius: 8,
    padding: 10,
    marginTop: 32,
    color: "white",
    fontSize: 14
  },
  inputLabel: {
    marginBottom: 16,
    marginTop: 70,
    textAlign: 'center',
  },
  recordButton: {
    marginTop: 16
  },
  editButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },
  backButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 32,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  modalText: {
    marginBottom: 32,
    color: "black",
    textAlign: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagesWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 120
  }
});
