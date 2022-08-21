import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

import { auth } from '../core/fb-config';
import { signOut } from 'firebase/auth';

export default function Logout() {
    const onSignOut = () => {
        console.log('Logout');
        signOut(auth).catch(error => console.log(error));
    }

    return(
        <TouchableOpacity onPress={onSignOut} style={{marginRight: 18}}>
              <AntDesign name='logout' size={24} color={Colors.dark.text}/>
        </TouchableOpacity>
    );
}