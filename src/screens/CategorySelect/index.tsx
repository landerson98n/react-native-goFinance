import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { categorie } from "../../utils/categorie";
import { Button } from "../../components/Forms/Button";
import { 
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
 } from "./styles";

interface Category{
  id: string,
  name: string
}

interface Props{
  category: Category
  setCategory: (category: Category) => void
  closeSelectCategory: ()=>void
}

export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory
}:Props){
  function handleCategorySelect(item:Category){
    setCategory(item)
  }
  return(
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>
      <FlatList
        data={categorie}
        keyExtractor={(item)=>item.id}
        renderItem={({item})=>(
          <Category
            onPress={()=>handleCategorySelect(item)}
            isActive={category.id === item.id}
          >
            <Icon name={item.icon}/>
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={()=><Separator/>}
      />
      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategory}/>
      </Footer>
    </Container>
  )
}