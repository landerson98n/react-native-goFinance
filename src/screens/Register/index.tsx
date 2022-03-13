import React, {useState} from 'react'
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import * as Yup from "yup"
import {yupResolver} from '@hookform/resolvers/yup'
import { Button } from '../../components/Forms/Button'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelect } from '../CategorySelect'
import { InputForm } from '../../components/Forms/InputForm'
import { useForm } from 'react-hook-form'
import uuid from 'react-native-uuid'
import {useNavigation} from '@react-navigation/native'
import  AsyncStorage  from '@react-native-async-storage/async-storage'

import { 
  Container,
  Title,
  Form,
  Header,
  Fields,
  TransactionsTypes
 } from './styles'
import { CategorySelectButton } from '../../components/CategorySelectButton'
import { useAuth } from '../../hooks/auth'

interface FormData{
  name: string;
  amount: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é Obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um número')
  .positive('O valor não pode ser negativo')
  .required('O valor é obrigatório')
})

export function Register(){
  const {user} = useAuth()
  const collectionKey = `@gofinance:transactions_user:${user.id}`
  const [category, setCategory] = useState({
    id: 'category',
    name: 'Categoria',
  })
  const navigation = useNavigation()
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const {control, handleSubmit, reset, formState: {errors}} =useForm ({resolver: yupResolver(schema)})

  function handleTransactionsTypeSelect(type: 'positive' | 'negative'){
    setTransactionType(type)
  }

  function handleOpenSelectCategory(){
    setCategoryModalOpen(true)
  }

  function handleCloseSelectCategory(){
    setCategoryModalOpen(false)
  }

  async function handleRegister(form: FormData){
    if (!transactionType){
      return Alert.alert('Selecione o tipo da transação')
    }
    if(category.id==='category'){
      return Alert.alert('Selecione a categoria')
    }
    const newTransaction = {
      id: String(uuid.v4()),
      name:form.name,
      amount: form.amount,
      type:transactionType,
      category: category.id,
      date: new Date()
    }
    
    try{
      const data = await AsyncStorage.getItem(collectionKey)
      const currentData = data ? JSON.parse(data) : []
      const dataFormatted = [
        ...currentData,
        newTransaction]
      
      await AsyncStorage.setItem(collectionKey, JSON.stringify(dataFormatted))
      reset()
      setTransactionType('')
      setCategory({
        id:'category',
        name: 'Categoria'
      })
      navigation.navigate('Listagem')
    }catch(error){

    }
  }
  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Container>
      
      <Header>
        <Title>Cadastro</Title>
      </Header>

    <Form>

      <Fields>
        <InputForm
          name="name"
          control = {control}
          placeholder='Nome'
          autoCapitalize='sentences'
          autoCorrect={false}
          error={errors.name && errors.name.message}
        />
        <InputForm
          name="amount"
          control = {control}
          placeholder='Preço'
          keyboardType='numeric'
          error={errors.amount && errors.amount.message}
        />
      <TransactionsTypes>
          <TransactionTypeButton 
          isActive = {transactionType === 'up'}
          onPress={() => handleTransactionsTypeSelect('positive')}
          title= "Income" 
          type='up'
          />
          <TransactionTypeButton 
          isActive = {transactionType === 'down'}
          onPress={() => handleTransactionsTypeSelect('negative')}
          title= "Outcome" 
          type='down'
          />
      </TransactionsTypes>
      <CategorySelectButton title={category.name} onPress={handleOpenSelectCategory}/>
      </Fields>
      

      <Button title="Enviar" onPress = {handleSubmit(handleRegister)}/>

    </Form>
    <Modal visible={categoryModalOpen}>
      <CategorySelect
        category = {category}
        setCategory={setCategory}
        closeSelectCategory={handleCloseSelectCategory}
      />
    </Modal>
    </Container>
    </TouchableWithoutFeedback>
  )
}