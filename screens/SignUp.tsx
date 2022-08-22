import { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, StyleSheet, TextInput, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { RootStackScreenProps } from '../types';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../core/fb-config';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../core/fb-config';
import { useSelector, useDispatch } from 'react-redux';
import { setDiu } from '../redux/actions';


export default function SignUp({navigation}: RootStackScreenProps<'SignUp'>){

    //const diu = useSelector(state=>state.userReducer);
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    //const [diu, setDiu] = useState('');

    const validateRules = (email:string, password:string) => {
        let msgs: Array<string>= [];
        let validEmail = /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/

        if(email === "") msgs.push("No se ingresó el Email.")
        if(email.length > 0 && !validEmail.exec(email)) msgs.push("No se ingresó un correo válido.")
        if(password === "") msgs.push("No se ingresó la Contraseña.")
        if(password.length > 0 && password.length < 6) msgs.push("La contraseña tiene menos de 6 caractéres.")

        return msgs;
    }

    const onHandleSignUp = () => {
        setIsLoading(true);
        if(validateRules(email, password).length === 0){
            createUserWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                console.log("SignUp success");
                //const myDoc = doc(db, "PalabrasClave", cred.user.uid)
                //setDoc(myDoc, {'words': []})
                //setDiu(cred.user.uid)
                dispatch(setDiu(cred.user.uid));
            })
            .catch((err) => {
                setIsLoading(false);
                Alert.alert("SignUp error:", err.message);
            });
        } else {
            setIsLoading(false);
            Alert.alert("SignUp error:", validateRules(email, password).join('\n'));
        }
    }

    return(
        <View style={styles.container}>
  
          <Text style={styles.title}>Regístrate</Text>
  
          <View style={styles.inputs}>
              <View style={styles.bg_icon}>
                  <Ionicons name="md-mail" size={20} color={Colors.dark.text}/>
              </View>
              <TextInput onChangeText={(text) => setEmail(text.trim())} placeholderTextColor={'#fff'} style={styles.input} placeholder='Email'/>
          </View>
          <View style={styles.inputs}>
              <View style={styles.bg_icon}>
                  <Ionicons name="md-lock-closed" size={20} color={Colors.dark.text}/>
              </View>
              <TextInput onChangeText={(text) => setPassword(text.trim())} placeholderTextColor={'#fff'} style={styles.input} secureTextEntry={true} placeholder='Contraseña'/>
          </View>
  
          <TouchableHighlight onPress={onHandleSignUp} style={styles.btn} underlayColor={'#DEDEDE'}>
              {
                  isLoading?
                  <ActivityIndicator size="small" color={Colors.light.text}></ActivityIndicator>
                  :
                  <Text style={styles.btn_text}>Crear</Text>
              }
          </TouchableHighlight>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("Login")}>
              <Text style={styles.btn_light}>Iniciar Sesión</Text>
          </TouchableWithoutFeedback>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 20
    },
    inputs: {
        marginVertical: 15,
        backgroundColor: Colors.dark.input,
        width: 250,
        paddingVertical: 15,
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
    btn: {
        marginVertical: 15,
        marginBottom: 60,
        backgroundColor: Colors.light.background,
        width: 250,
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    btn_text: {
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    btn_light: {
        borderBottomWidth: 1,
        borderColor: Colors.dark.text
    }
});