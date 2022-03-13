import React, { useCallback, useEffect, useState } from 'react'
import { HighLightCard } from '../../components/HighLighCard'
import { ActivityIndicator } from 'react-native'
import { TransactionCard  } from '../../components/TransactionCard'
import  AsyncStorage  from '@react-native-async-storage/async-storage'
import {useFocusEffect} from '@react-navigation/native'
import { Data } from '../../components/TransactionCard'
import {
  Container,
  Header,
  Photo,
  UserGreeting,
  UserName,
  UserInfo,
  User,
  UserWrapper,
  Icon,
  HighLightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer
} from './styles'
import { longPressGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler'
import { useAuth } from '../../hooks/auth'

export interface DataListProps extends Data{
  id: string;
}

interface HighLightProps{
  amount: string,
  lastTransaction: string
}

interface HighLightData{
  entries:HighLightProps,
  expensive: HighLightProps
  total: HighLightProps
}

export function Dashboard(){
  const [isLoading, setIsLoading] = useState(true)
  const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData)
  const [data, setData] = useState<DataListProps[]>([])
  const {signOut, user} = useAuth()
  const collectionKey = `@gofinance:transactions_user:${user.id}`

  function getLastTransaction (
    collection: DataListProps[], 
    type: 'positive' | 'negative'){

    const lastTransaction= 
      new Date(
      Math.max.apply(Math,collection
      .filter((transaction) => transaction.type == type)
      .map((transaction) => new Date(transaction.date).getTime())  
    ))
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR',{month: 'long'})}`
  }

  async function loadTransation(){
    const response = await AsyncStorage.getItem(collectionKey)
    const allData = response ? JSON.parse(response) : []
    let entriesTotal = 0;
    let expensiveTotal = 0;
    

    const allDataFormatted : DataListProps[] = allData.map((item: DataListProps) =>{
      if(item.type == 'positive'){
        entriesTotal+= Number(item.amount)
      }else{
        expensiveTotal+= Number(item.amount)
      }

      const amount = Number(item.amount).toLocaleString('pt-BR',{
        style: 'currency',
        currency: 'BRL'
      })

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date))
      
      return{
        id: item.id,
        name: item.name,
        amount,
        date,
        type: item.type,
        category: item.category,
      }
    })

    setData(allDataFormatted)
    const lastTransactionEntries = getLastTransaction(allData, 'positive')
    const lastTransactionExpensive = getLastTransaction(allData, 'negative')
    const intervalTotal = `01 a ${lastTransactionExpensive}`
    const total = entriesTotal - expensiveTotal

    setHighLightData({
      expensive: {
        amount: expensiveTotal.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída ${lastTransactionEntries}`
      },
      entries:{
        amount: entriesTotal.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última entrada ${lastTransactionExpensive}`
      },
      total:{
        amount: total.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: intervalTotal
      }
    })
    setIsLoading(false)
  } 

  useEffect(()=>{
    loadTransation()
  },[])

  useFocusEffect(useCallback(()=>{loadTransation()}, []))

  return (
    <Container>
      {
        isLoading? <LoadContainer><ActivityIndicator size='large'/></LoadContainer>:
        <>
      <Header>
      <UserWrapper>
        <UserInfo>
            <Photo source={{uri:user.photo}}/>
            <User>
              <UserGreeting>Ola</UserGreeting>
              <UserName>{user.name}</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={signOut}>
             <Icon name="power"/>
          </LogoutButton>
          
      </UserWrapper> 
      </Header>

      <HighLightCards>
        <HighLightCard 
        title="Entradas" 
        amount={highLightData.entries.amount}
        lastTransaction={highLightData.entries.lastTransaction}
        type = "up"
        />
        <HighLightCard 
        title="Saidas" 
        amount= {highLightData.expensive.amount}
        lastTransaction={highLightData.expensive.lastTransaction}
        type = "down"
        />
        <HighLightCard 
        title="Total" 
        amount= {highLightData.total.amount} 
        lastTransaction={highLightData.total.lastTransaction}
        type = "total"
        />
      </HighLightCards>
      
      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          renderItem=
          {({item}) =>
             <TransactionCard data={item}/>
          }
          showsVerticalScrollIndicator = {false} 
        />
        
      </Transactions>
          </>
      }
    </Container>
  )
}

