import {createContext, ReactNode, useContext, useEffect} from 'react'

import * as AuthSession from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'

export const AuthContext = createContext({} as IAuthContextData)

interface AuthProviderProps{
  children: ReactNode;
}

interface User{
  id: string,
  name: string,
  email: string,
  photo?: string
}

interface IAuthContextData{
  user:User,
  signInWithGoogle(): Promise<void> 
  signInWithApple(): Promise<void> 
  signOut(): Promise<void>
  isLoading: boolean
}

interface AuthorizationResponse{
  params:{
    access_token: string
  },
  type: string
}
function AuthProvider({children}: AuthProviderProps){
  const [user, setUser] = useState<User>({} as User)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    async function LoadStorageData(){
      const data = await AsyncStorage.getItem('@gofinances:user')
      if(data){
        const userLogged = JSON.parse(data) as User
        setUser(userLogged)
      }
      setIsLoading(false)
    }
    LoadStorageData()
  }, [])

  async function signInWithGoogle(){
    try{
      const RESPONSE_TYPE ='token'
      const SCOPE =encodeURI('profile email')
      const CLIENT_ID='534662510521-0a9dmjn8d9t0qqd2lfohdpld19fskra9.apps.googleusercontent.com'
      const REDIRECT_URI='https://auth.expo.io/@landerson98n/gofinances'
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
      const response = await AuthSession.startAsync({authUrl}) as AuthorizationResponse
      
      if(response.type === 'success'){
         const data = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${response.params.access_token}`)
         const userInfo = await data.json()
         const userLogged = {
          id: String(userInfo.id),
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture  
        }
         setUser(userLogged)
         await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }
    }catch(error){
      throw new Error()
    }
  }

  async function signInWithApple(){
    try{
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes:[
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
       ]
      })

      if(credential){
        const name  = credential.fullName?.givenName!
        const userLogged = {
          id: String(credential.user),
          name: name,
          email: credential.email!,
        }
        setUser(userLogged)
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }
     
    }catch(error){
      throw new Error
    }
  }

  async function signOut(){
    setUser({} as User)
    await AsyncStorage.removeItem('@gofinances:user')
  }

  return(
        <AuthContext.Provider value={{isLoading, user, signInWithGoogle, signInWithApple, signOut }}>
          {children}
        </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext)
  return context
}

export {AuthProvider, useAuth}