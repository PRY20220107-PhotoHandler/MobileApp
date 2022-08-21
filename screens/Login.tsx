import { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, StyleSheet, TextInput, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { RootStackScreenProps } from '../types';

import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../core/fb-config';

export default function Login({ navigation}: RootStackScreenProps<'Login'>){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // const handleSignIn = () => {
    //     setIsLoading(true);
    //     signInWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         console.log('Signed In!');
    //         const user = userCredential.user;
    //         console.log(user);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     }).finally(() => {
    //         setIsLoading(false);
    //     })
    // }


    const onHandleLogIn = () => {
        if(email !== "" && password !== ""){
            signInWithEmailAndPassword(auth, email, password)
            .then(() => console.log("Login success"))
            .catch((err) => Alert.alert("Login error:", err.message));
        }
    }


    const goToRegister = () => {
        console.log('Presionado');
        Alert.alert('Ir a Registrar');
    }

    return(
      <View style={styles.container}>

        <Text style={styles.title}>Iniciar Sesión</Text>

        <View style={styles.inputs}>
            <View style={styles.bg_icon}>
                <Ionicons name="md-mail" size={20} color={Colors.dark.text}/>
            </View>
            <TextInput onChangeText={(text) => setEmail(text)} placeholderTextColor={'#fff'} style={styles.input} placeholder='Email'/>
        </View>
        <View style={styles.inputs}>
            <View style={styles.bg_icon}>
                <Ionicons name="md-lock-closed" size={20} color={Colors.dark.text}/>
            </View>
            <TextInput onChangeText={(text) => setPassword(text)} placeholderTextColor={'#fff'} style={styles.input} secureTextEntry={true} placeholder='Contraseña'/>
        </View>

        <TouchableHighlight onPress={onHandleLogIn} style={styles.btn} underlayColor={'#DEDEDE'}>
            {
                isLoading?
                <ActivityIndicator size="small" color={Colors.light.text} ></ActivityIndicator>
                :
                <Text style={styles.btn_text}>Ingresar</Text>
            }
        </TouchableHighlight>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.btn_light}>Regístrate</Text>
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