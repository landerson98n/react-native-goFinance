import React from 'react'
import { HighLightCard } from '../../components/HighLighCard'
import { TransactionCard  } from '../../components/TransactionCard'
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
  TransactionsList
} from './styles'

export function Dashboard(){
  const data = [{
    type: 'positive',
    title: "Desenvolvimento de Site",
    amount: "R$ 19.000,00",
    category:{
      name:'Vendas',
      icon:'dollar-sign'  
    },
    date: "08/03/2022",
  },
  {
    type: 'negative',
    title: "Desenvolvimento de Site",
    amount: "R$ 19.000,00",
    category:{
      name:'Vendas',
      icon:'dollar-sign'  
    },
    date: "08/03/2022",
  },
  {
    type: 'positive',
    title: "Desenvolvimento de Site",
    amount: "R$ 19.000,00",
    category:{
      name:'Vendas',
      icon:'dollar-sign'  
    },
    date: "08/03/2022",
  }
]
  return (
    <Container>

      <Header>

      <UserWrapper>
        <UserInfo>
            <Photo source={{uri:'https://avatars.githubusercontent.com/u/65116968?v=4'}}/>
            <User>
              <UserGreeting>Ola</UserGreeting>
              <UserName>Landerson</UserName>
            </User>
          </UserInfo>
          <Icon name="power"/>
      </UserWrapper> 

      </Header>

      <HighLightCards>
        <HighLightCard 
        title="Entradas" 
        amount= "R$ 14.000,00" 
        lastTransaction='Ultima transação dia 13'
        type = "up"
        />
        <HighLightCard 
        title="Saidas" 
        amount= "R$ 2.000,00" 
        lastTransaction='Ultima transação dia 13'
        type = "down"
        />
        <HighLightCard 
        title="Total" 
        amount= "R$ 12.000,00" 
        lastTransaction='Ultima transação dia 13'
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

    </Container>
  )
}

