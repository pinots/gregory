import { useState, useEffect } from 'react'
import { authentication } from '../../config/firebase-config'
import { 
    GoogleAuthProvider,
    signInWithRedirect,
    signOut,
    onAuthStateChanged
    } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


export const Auth = () => {
    const [auth, setAuth] = useState(false || window.localStorage.getItem('auth') === 'true')
    const [token, setToken] = useState('')
    const navigate = useNavigate()
    useEffect( () => {
        onAuthStateChanged(authentication, (user) => {
            if(user) {
                window.localStorage.setItem('auth', 'true')
                setAuth(true);
                user.getIdToken().then((mytoken) => {
                    setToken(mytoken)
                    window.localStorage.setItem('token', token)
                })
            }
        })
    },[token])
    const userLogin = () => {
        if(token !== undefined){
            navigate('/test')
        }
    }
    
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        setAuth(true)
        signInWithRedirect(authentication, provider)
        window.localStorage.setItem('auth', 'true')
        userLogin()
    }
    const signOutWithGoogle = () => {
        signOut(authentication)
        .then(() => {
            setAuth(false)
            window.localStorage.setItem('auth', 'false')
            navigate('/')
        })
    }
    return(
        <>
        {auth ? (
            <button onClick={signOutWithGoogle}> Signout</button>
        ): (
            <button onClick={signInWithGoogle}> SignIn</button>
        )}
        </>
    )
}
