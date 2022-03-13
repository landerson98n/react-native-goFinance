import React from 'react'
import { categorie } from '../../utils/categorie';

import { 
  Container,
  Title,
  Amount,
  Category,
  Icon,
  CategoryName,
  Date,
  Footer,

} from './style'

export interface Data{
    type: 'positive' | 'negative'
    name: string;
    amount: string;
    category: string;
    date: string;
}

export interface TransactionCardProps{
  data : Data
}

export function TransactionCard({data}:TransactionCardProps){
  const category = categorie.filter(
    item => item.id === data.category
  )[0]
  return(
    <Container>
      <Title>{data.name}</Title>
      <Amount type={data.type}>
        {data.type === 'negative' && '-' }
        {data.amount}
        </Amount>
      <Footer>  
        <Category>
          <Icon name={category ? category.icon : ''}/>
          <CategoryName>{category ? category.name:''}</CategoryName>
        </Category>
        <Date>{data.date}</Date>
      </Footer>
    </Container>
  )
}