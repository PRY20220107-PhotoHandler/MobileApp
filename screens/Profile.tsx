import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <ActivityIndicator size='large' color='#fff' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  white: {
    color: '#fff'
  }
});