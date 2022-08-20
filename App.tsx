import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
// import Login from './screens/Login';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } 
  // if(true){
  //   return(
  //     <SafeAreaProvider>
  //       <Login />
  //     </SafeAreaProvider>
  //   );
  // }
  else {
    return (
       <SafeAreaProvider>
         <Navigation colorScheme={colorScheme} />
         <StatusBar />
       </SafeAreaProvider>
    );
  }
}
