import { StyleSheet, FlatList, TouchableOpacity, TextInput, TouchableHighlight, Modal, Alert, ActivityIndicator } from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import { Text, View } from '../components/Themed';
import { useSelector, useDispatch } from 'react-redux';
import {arrayUnion, arrayRemove} from 'firebase/firestore';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../core/fb-config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../core/fb-config';
import { getAuth, updateProfile, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth/react-native';

export default function Profile() {

  const [userDoc, setUserDoc] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState('email');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [loading, setLoading] = useState(false);

  const diu = useSelector(state => state);

  useEffect(()=>{
    Read();
    //console.log(diu);
    //console.log('hola');
  }, [userDoc])

  const reauthenticate = (currentPassword:string) => {
    var user = auth.currentUser;
    var cred = EmailAuthProvider.credential(
        user.email, currentPassword);
    return reauthenticateWithCredential(user, cred);
  }

  const changeUsername = (currentPassword:string) => {
    reauthenticate(currentPassword).then((userCredential) => {
      updateProfile(userCredential.user, {
        displayName: newName
      }).then(() => {
        console.log("Name updated!");
        Alert.alert('Listo', 'Se actualizaron los datos correctamente.');
        setModal(false);
      }).catch((error) => { console.log(error); });
    }).catch((error) => {
      console.log(error);
      Alert.alert('Error', 'Probablemente se ingresó una contraseña incorrecta.');
    }).then(()=> {
      setLoading(false);
    });
  }

  const changeEmail = (currentPassword:string) => {
    reauthenticate(currentPassword).then((userCredential) => {
      updateEmail(userCredential.user, newEmail).then(() => {
        console.log("Email updated!");
        Alert.alert('Listo', 'Se actualizaron los datos correctamente.');
        setModal(false);
      }).catch((error) => { console.log(error); });
    }).catch((error) => {
      console.log(error);
      Alert.alert('Error', 'Probablemente se ingresó una contraseña incorrecta.');
    }).then(()=> {
      setLoading(false);
    });
  }

  const openModal = (type:string) => {
    setModalType(type);
    setModal(true);
  }

  const handleChangeProfile = () => {
    setLoading(true);
    if(confirmPassword.length < 6) {
      Alert.alert('Contraseña Incorrecta', 'Ingresa una contraseña válida');
      setLoading(false);
      console.log('Ingresa una contraseña válida');
    } else {
      if(modalType === 'name') changeUsername(confirmPassword)
      if(modalType === 'email') changeEmail(confirmPassword)
    }
  }


  const Read = () => {

    const myDoc = doc(db, "PalabrasClave", `${diu.diu}`) //`${diu.diu}`

    getDoc(myDoc)
      .then((snapshot) => {
        if (snapshot.exists()) {
          //console.log(snapshot.data().words)
          setUserDoc(snapshot.data().words)
        }
        else {
          console.log("nel")
        }
      })
  }

  const DeleteItem = (itemString:string, merge:boolean) => {

    const myDoc = doc(db, "PalabrasClave", `${diu.diu}`)

    getDoc(myDoc)
    // Handling Promises
    .then((snapshot) => {
        // MARK: Success
      console.log(snapshot.exists());
        if (snapshot.exists()) {

          setDoc(myDoc, {'words':arrayRemove(itemString)}, { merge: merge })
          /*db2.doc('PalabrasClave/UsuarioXX').update({
            'words': arrayUnion([text])
          })*/
        } 
      })
  }

  return (
    <View style={styles.container}>
      <Modal transparent={true} visible={modal}>
        <View style={{backgroundColor: '#000000aa', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{backgroundColor: '#292929', justifyContent: 'center', alignItems: 'center', width: 300, paddingHorizontal: 30, paddingBottom:30, borderRadius: 10}}>
            <View style={{width: 280, backgroundColor: 'transparent',alignItems: 'flex-end', marginVertical: 10}}>
              <TouchableHighlight style={{backgroundColor: Colors.dark.background, borderRadius: 20, padding: 4}} onPress={() => setModal(false)}>
                <Ionicons name="md-close" size={20} color={Colors.dark.text}/>
              </TouchableHighlight>
            </View>
            {
              modalType === 'delete'?
              <Text>Porfavor, ingresa tu contraseña actual para eliminar la cuenta </Text>
              :
              <Text>Porfavor, ingresa tu contraseña actual para realizar el cambio: </Text>
            }
            <View style={styles.m_inputs}>
              <View style={styles.m_bg_icon}>
                  <Ionicons name="md-lock-closed" size={20} color={Colors.dark.text}/>
              </View>
              <TextInput onChangeText={(text) => setConfirmPassword(text.trim())} secureTextEntry={true} placeholderTextColor={'#fff'} style={styles.m_input} placeholder='Contraseña'/>
            </View>
            {
              loading?
              <ActivityIndicator size="small" color={Colors.dark.text}></ActivityIndicator>
              :
              <TouchableHighlight onPress={() => {handleChangeProfile()}}>
                <Text style={styles.updateText}>Confirmar</Text>
              </TouchableHighlight>
            }
          </View>
        </View>
      </Modal>

      <View style={{width: '90%', flexDirection: 'row', marginTop: 30, marginBottom: 10}}>
        <Text style={styles.subtitle}>Hola{auth.currentUser?.displayName && `, ${auth.currentUser?.displayName}`}!</Text>
      </View>
      <View style={styles.inputs}>
        <View style={styles.bg_icon}>
            <Ionicons name="md-person" size={20} color={Colors.dark.text}/>
        </View>
        <TextInput onChangeText={(text) => setNewName(text.trim())} placeholderTextColor={'#fff'} style={styles.input} placeholder='Nombre'/>
        {
          newName !=='' &&
          <TouchableHighlight onPress={() => openModal('name')}>
            <Text style={styles.updateText}>Actualizar</Text>
          </TouchableHighlight>
        }
      </View>

      <View style={styles.inputs}>
        <View style={styles.bg_icon}>
            <Ionicons name="md-mail" size={20} color={Colors.dark.text}/>
        </View>
        <TextInput onChangeText={(text) => setNewEmail(text.trim())} placeholderTextColor={'#fff'} style={styles.input} placeholder='Email'/>
        {
          newEmail !=='' &&
          <TouchableHighlight onPress={() => openModal('email')}>
            <Text style={styles.updateText}>Actualizar</Text>
          </TouchableHighlight>
        }
      </View>

      <View style={{width: '90%', flexDirection: 'row', marginVertical: 15}}>
        <Text style={styles.subtitle}>Mis palabras clave</Text>
      </View>
      <FlatList
        data = {userDoc}
        ItemSeparatorComponent = { () => <View style={{marginVertical: 3, borderColor: "fff", borderWidth: 2,}}/>}
        //ListHeaderComponent = { () => <Text style = {{fontWeight: 'bold', marginBottom: 10,}}> Palabras clave guardadas </Text>}
        renderItem = {(item) => (
          <View style={styles.list}>
            <Text style={{color: "#FFF"}}> {item.item} </Text>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color={Colors.dark.error} onPress={() => DeleteItem(item.item, true)}/>
          </View>
        )}
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    backgroundColor: "#000",
    borderBottomColor: "#292929",
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 15,
    width: 350,
    justifyContent: 'space-between',
  },
  updateText: {
    color: Colors.dark.success,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    justifyContent: 'flex-start',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    color: '#C5C5C5'
  },
  white: {
    color: '#fff'
  },
  btn_text: {
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  inputs: {
    marginVertical: 13,
    backgroundColor: Colors.dark.input,
    width: 290,
    paddingVertical: 11,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bg_icon: {
    backgroundColor: Colors.dark.input,
    paddingHorizontal: 10
  },
  input: {
    backgroundColor: Colors.dark.input,
    width: 165,
    color: Colors.dark.text,
    paddingVertical: 7
  },
  m_inputs: {
    marginVertical: 25,
    paddingVertical: 13,
    backgroundColor: Colors.dark.background,
    width: 240,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  m_bg_icon: {
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 10
  },
  m_input: {
    backgroundColor: Colors.dark.background,
    width: 165,
    color: Colors.dark.text,
    paddingVertical: 7
  }
});
