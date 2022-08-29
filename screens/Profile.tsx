import { StyleSheet, FlatList, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native';
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
import { getAuth, updateProfile, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword} from 'firebase/auth/react-native';

export default function Profile() {

  const [userDoc, setUserDoc] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

  const changeEmail = (currentPassword:string) => {
    reauthenticate(currentPassword).then((userCredential) => {
      updateEmail(userCredential.user, newEmail).then(() => {
        console.log("Email updated!");
      }).catch((error) => { console.log(error); });
    }).catch((error) => { console.log(error); });
  }

  const changePassword = (currentPassword:string) => {
    reauthenticate(currentPassword).then((userCredential) => {
      updatePassword(userCredential.user, newPassword).then(() => {
        console.log("Password updated!");
      }).catch((error) => { console.log(error); });
    }).catch((error) => { console.log(error); });
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
      <View style={styles.inputs}>
        <View style={styles.bg_icon}>
            <Ionicons name="md-mail" size={20} color={Colors.dark.text}/>
        </View>
        <TextInput onChangeText={(text) => setNewEmail(text.trim())} placeholderTextColor={'#fff'} style={styles.input} placeholder='Email'/>
        <TouchableHighlight>
          <Text style={styles.deleteIcon} onPress={() => changeEmail('admin123')}>Actualizar</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.inputs}>
        <View style={styles.bg_icon}>
            <Ionicons name="md-lock-closed" size={20} color={Colors.dark.text}/>
        </View>
        <TextInput onChangeText={(text) => setNewPassword(text.trim())} placeholderTextColor={'#fff'} style={styles.input} placeholder='Contraseña'/>
        <TouchableHighlight>
          <Text style={styles.deleteIcon} onPress={() => changePassword('admin0123')}>Actualizar</Text>
        </TouchableHighlight>
      </View>

      <View style={{width: '90%', flexDirection: 'row', marginTop: 40, marginBottom: 15}}>
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
//<Pressable style={styles.button} onPress={() => Read()}></Pressable>

/*
<TouchableOpacity>
              <Text style={styles.deleteIcon} onPress={() => DeleteItem(item.item, true)}>Delete</Text>
            </TouchableOpacity>
*/

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
  deleteIcon: {
    color: Colors.dark.success,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    justifyContent: 'flex-start',
    fontSize: 20,
    marginBottom: 5,
    color: '#fff'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  white: {
    color: '#fff'
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 42,
    width: 168,
    paddingTop: 10,
    marginBottom: 22
  },
  inputs: {
    marginVertical: 15,
    backgroundColor: Colors.dark.input,
    width: 290,
    paddingVertical: 13,
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
});
