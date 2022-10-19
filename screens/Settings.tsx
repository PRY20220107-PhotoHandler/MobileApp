import { StyleSheet, TextInput, TouchableHighlight, Modal, Alert, ActivityIndicator } from 'react-native';
import React, {useState, useEffect} from 'react';
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import { auth } from '../core/fb-config';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, deleteUser} from 'firebase/auth/react-native';

export default function Settings() {
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState('password');

  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordV2, setNewPasswordV2] = useState('');
  const [loading, setLoading] = useState(false);

  const reauthenticate = (currentPassword:string) => {
    var user = auth.currentUser;
    var cred = EmailAuthProvider.credential(
        user.email, currentPassword);
    return reauthenticateWithCredential(user, cred);
  }

  const validatePassword = () => {
    if(confirmPassword === '') return 'Contraseña no ingresada';
    if(newPassword === '') return 'Ingresar nueva contraseña';
    if(newPasswordV2 === '') return 'Ingresar nueva contraseña';
    if(newPassword !== newPasswordV2) return 'Las contraseñas no coinciden';
    return '';
  }

  const changePassword = () => {
    if(validatePassword().length === 0){
      setLoading(true);
      reauthenticate(confirmPassword).then((userCredential) => {
        updatePassword(userCredential.user, newPassword).then(() => {
          Alert.alert("Listo", "La constraseña se actualizó correctamente.")
          console.log("Password updated!");
        }).catch((error) => { console.log(error); });
      }).catch((error) => {
        console.log(error);
        Alert.alert('Error', 'Probablemente se ingresó una contraseña incorrecta.');
      }).then(()=> {
        setLoading(false);
      });
    } else {
      Alert.alert('Error', validatePassword());
    }
  }

  const deleteAccount = (currentPassword:string) => {
    reauthenticate(currentPassword).then((userCredential) => {
      deleteUser(userCredential.user).then(() => {
        console.log("User deleted!");
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
      if(modalType === 'delete') deleteAccount(confirmPassword)
    }
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
            <Text>Porfavor, ingresa tu contraseña actual para eliminar la cuenta </Text>
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
        <Text style={styles.subtitle}>Actualizar contraseña:</Text>
      </View>

      <View style={styles.inputs}>
        <View style={styles.bg_icon}>
            <Ionicons name="md-lock-closed" size={20} color={Colors.dark.text}/>
        </View>
        <TextInput onChangeText={(text) => setConfirmPassword(text.trim())} placeholderTextColor={'#fff'} secureTextEntry={true} style={styles.input} placeholder='Contraseña actual'/> 
      </View>

      <View style={styles.inputs}>
        <View style={styles.bg_icon}>
            <Ionicons name="md-lock-closed" size={20} color={Colors.dark.text}/>
        </View>
        <TextInput onChangeText={(text) => setNewPassword(text.trim())} placeholderTextColor={'#fff'} secureTextEntry={true} style={styles.input} placeholder='Nueva contraseña'/> 
      </View>

      <View style={styles.inputs}>
        <View style={styles.bg_icon}>
            <Ionicons name="md-lock-closed" size={20} color={Colors.dark.text}/>
        </View>
        <TextInput onChangeText={(text) => setNewPasswordV2(text.trim())} placeholderTextColor={'#fff'} secureTextEntry={true} style={styles.input} placeholder='Repita nueva contraseña'/>  
      </View>

      {
        confirmPassword && newPassword && newPasswordV2?
        <TouchableHighlight onPress={() => {changePassword()}} style={styles.btn_green} underlayColor={'#0AE147'}>
          {
            loading?
            <ActivityIndicator size="small" color={Colors.dark.text}></ActivityIndicator>
            :
            <Text style={styles.btn_text}>Actualizar</Text>
          }
        </TouchableHighlight>
        :
        <TouchableHighlight onPress={() => {}} style={styles.btn_green_d} disabled>
          <Text style={styles.btn_text}>Actualizar</Text>
        </TouchableHighlight>
      }

      <View style={styles.separator}></View>

      <TouchableHighlight onPress={() => {openModal('delete')}} style={styles.btn_red} underlayColor={'#CE2222'}>
        <Text style={styles.btn_text}>Eliminar cuenta</Text>
      </TouchableHighlight>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: Colors.dark.input,
  },
  updateText: {
    color: Colors.dark.success,
  },
  subtitle: {
    justifyContent: 'flex-start',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    color: '#C5C5C5'
  },
  btn_green: {
    marginVertical: 15,
    marginBottom: 30,
    backgroundColor: Colors.dark.success,
    width: 250,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  btn_green_d: {
    marginVertical: 15,
    marginBottom: 30,
    backgroundColor: '#B0B6B1',
    width: 250,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  btn_red: {
    marginVertical: 15,
    marginBottom: 30,
    backgroundColor: Colors.dark.error,
    width: 250,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
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
