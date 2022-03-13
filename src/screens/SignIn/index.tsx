import React, {useContext} from "react";
import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from "./styles";
import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { RFValue } from "react-native-responsive-fontsize";
import {SignInSocialButton} from '../../components/SignInSocialButton'
import { ActivityIndicator, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "../../hooks/auth";
import { useTheme } from "styled-components";

export function SignIn(){
  const [isLoading, setIsloading] = useState(false)
  const {signInWithGoogle, signInWithApple} = useAuth()
  const theme = useTheme()

  async function handleSignInWithGoogle(){
    try{  
      setIsloading(true)
      await signInWithGoogle()
    }catch(error){
      Alert.alert('Não foi possível conectar à conta google')
    }finally{
      setIsloading(false)
    }
  }

  async function handleSignInWithApple(){
    try{  
      setIsloading(true)
      await signInWithApple()
    }catch(error){
      Alert.alert('Não foi possível conectar à conta google')
    }finally{
      setIsloading(false)
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)}/>
          <Title>
          Controle suas {'\n'}
          finanças de forma {'\n'}
          muito simples {'\n'}
          </Title>

          <SignInTitle>
            Faça seu login com {'\n'}
            uma das contas abaixo
          </SignInTitle>

        </TitleWrapper>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton onPress={handleSignInWithGoogle} title='Entrar com Google' svg={GoogleSvg}/>
          <SignInSocialButton onPress={handleSignInWithApple} title='Entrar com Apple' svg={AppleSvg}/>
        </FooterWrapper>
        {isLoading && <ActivityIndicator color={theme.colors.shape}/>}
      </Footer>
    </Container>
  )
}