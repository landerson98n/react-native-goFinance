import React, {useCallback, useEffect, useState} from "react";
import { HistoryCard } from "../../components/HistoryCard";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {VictoryPie} from 'victory-native'
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs'
import {addMonths, subMonths, format} from 'date-fns'
import { ActivityIndicator } from "react-native";
import { ptBR } from 'date-fns/locale'
import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
  LoadContainer,

 } from "./style";
import { categorie } from "../../utils/categorie";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

 export interface Data{
  type: 'positive' | 'negative'
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface categoryData{
  key: string
  name: string,
  totalFormatted: string,
  total: number,
  color: string,
  percent: string
}
export function Resume(){
  const [isLoading, setIsLoading] = useState(true)
  const [totalByCategories, setTotalByCategories] = useState<categoryData[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const {user} = useAuth()
  const collectionKey = `@gofinance:transactions_user:${user.id}`

  function handleChangeData(action: 'next'|'prev'){
    if(action == 'next'){
     setSelectedDate(addMonths(selectedDate, 1))
    }else{
     setSelectedDate(subMonths(selectedDate, 1))
    }

  }

  async function loadData(){
    
    const response = await AsyncStorage.getItem(collectionKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expensives = responseFormatted
    .filter((expensive: Data) =>
     expensive.type ==='negative' &&
      new Date(expensive.date).getMonth() === selectedDate.getMonth()&&
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
     )

    const expensiveTotal = expensives.reduce((acumulator: number, expensive: Data)=>{
     return acumulator += Number(expensive.amount)
    }, 0)

    const totalByCategory: categoryData[] = []

    categorie.forEach(category =>{
      let categorySum = 0
      expensives.forEach((expensive: Data) =>{
        if(expensive.category == category.id){
          categorySum+= Number(expensive.amount)
        }
      })
      if(categorySum > 0 ){
        const totalFormatted = categorySum.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum/expensiveTotal*100).toFixed(0)}%`

        totalByCategory.push({
          key: category.id,
          name: category.name,
          total: categorySum,
          color: category.color,
          totalFormatted,
          percent
        })
      }
    })
    setTotalByCategories(totalByCategory)
    setIsLoading(false)
  }
  useEffect(()=>{
    loadData()
  }, [selectedDate])

  useFocusEffect(useCallback(()=>{
    loadData()
  }, [ ]))
  return(
    <Container>
     { isLoading ? <LoadContainer><ActivityIndicator size='large'/></LoadContainer>:
     <>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>

       <Content 
       showsVerticalScrollIndicator={false} 
       contentContainerStyle={{
         paddingHorizontal: 24,
         paddingBottom: useBottomTabBarHeight(),
       }}
       >
         <MonthSelect>
            <MonthSelectButton onPress={()=> handleChangeData('prev')}>
              <SelectIcon name = 'chevron-left'/>
            </MonthSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

            <MonthSelectButton onPress={()=> handleChangeData('next')}>
              <SelectIcon name = 'chevron-right'/>
            </MonthSelectButton>
         </MonthSelect>

         <ChartContainer>
            <VictoryPie 
                data={totalByCategories}
                colorScale={totalByCategories.map(category=>category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: 'white'
                  }
                }}
                labelRadius={50}
                x='percent'
                y='total'
              />
         </ChartContainer>
            {
              totalByCategories.map(item =>(
                <HistoryCard
                  key={item.key}
                  title={item.name}
                  amount={item.totalFormatted}
                  color={item.color}
                />
              ))
            }
        </Content>
        </>}
    </Container>
  )
}