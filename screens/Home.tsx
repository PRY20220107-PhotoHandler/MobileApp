import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import { Button, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Home() {
  const [image, setImage] = useState("");
  const [step, setStep] = useState("");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable style={styles.button} onPress={pickImage}><Text style={styles.buttonText}>Subir Imagen</Text></Pressable>
        {(image != "") && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
      <Pressable style={styles.button} onPress={() => console.log("xd")}><Text style={styles.buttonText}>Validar imagen</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 148
  },
  button: {
    backgroundColor: "#545755",
    borderRadius: 12,
    height: 42,
    width: 168,
    paddingTop: 10,
    marginBottom: 22
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  }
});
