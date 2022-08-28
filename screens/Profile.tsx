import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';

import { Text, View } from '../components/Themed';
import { useSelector, useDispatch } from 'react-redux';
import {arrayUnion, arrayRemove} from 'firebase/firestore';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../core/fb-config';

export default function Profile() {

  const [userDoc, setUserDoc] = useState(null);

  const diu = useSelector(state => state);

  useEffect(()=>{
    Read();
  }, [userDoc])

  const Read = () => {

    const myDoc = doc(db, "PalabrasClave", `${diu.diu}`)

    getDoc(myDoc)
      .then((snapshot) => {
        if (snapshot.exists()) {
          //console.log(snapshot.data().words)
          setUserDoc(snapshot.data().words)
        }
        else {
          //console.log("nel")
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
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <Text style={[styles.title, {textAlign: 'left'}]}>Perfil</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <Text style={styles.subtitle}>Palabras clave guardadas</Text>
      </View>
      <FlatList
        data = {userDoc}
        ItemSeparatorComponent = { () => <View style={{marginVertical: 3, borderColor: "fff", borderWidth: 2,}}/>}
        //ListHeaderComponent = { () => <Text style = {{fontWeight: 'bold', marginBottom: 10,}}> Palabras clave guardadas </Text>}
        renderItem = {(item) => (
          <View style={styles.list}>
            <Text style={{color: "#000"}}> {item.item} </Text>

            <TouchableOpacity>
              <Text style={styles.deleteIcon} onPress={() => DeleteItem(item.item, true)}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        
      />
    </View>
  );
}
//<Pressable style={styles.button} onPress={() => Read()}></Pressable>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    backgroundColor: "#f1f2f1",
    borderRadius: 10,
    padding: 10,
    width: 350,
    justifyContent: 'space-between',
  },
  deleteIcon: {
    color: 'red',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    justifyContent: 'flex-start',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
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
  }
});
