import React, {useState, createContext, useContext} from 'react';
import { loginRequest } from './authenticationService';

const AuthenticationContext = createContext();

const useActualContext = () => {
    return useContext(AuthenticationContext);
}

const AuthenticationContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const onLogin = (email, password) => {
        setIsLoading(true);
        loginRequest(email, password)
        .then((u) =>{
            setUser(u);
            setIsLoading(false);
        }).catch((e) => {
            setIsLoading(false);
            setError(e);
        });

    }

    return(
        <AuthenticationContext.Provider
            value={{
                user,
                isLoading,
                error,
                onLogin,
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
}

export {AuthenticationContext, useActualContext, AuthenticationContextProvider};