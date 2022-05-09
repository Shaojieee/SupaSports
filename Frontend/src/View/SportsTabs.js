
import React from 'react';
import { StyleSheet, Pressable, Text, FlatList } from 'react-native';



export default function SportsTabs ({data, onPress, curSportsID}){
    return(
        <FlatList
            showsHorizontalScrollIndicator = {false}
            horizontal={true}
            data={Object.entries(data)}
            renderItem = {({item})=><SportsTabButton 
                                        title={item[1]["title"]} 
                                        onPress={onPress} 
                                        sportsID={item[0]} 
                                        curSportsID = {curSportsID}
                                    />
                            }
            keyExtractor = {item=>item[0]}
            
        />
        
    )
}

function SportsTabButton ({title, onPress, sportsID, curSportsID}){

    return (
        <Pressable
            style={({pressed})=>[{
                backgroundColor: pressed? 'rgb(210, 230, 255)': (sportsID==curSportsID)?"#003366":"#F9F9F9",
                borderWidth : 1,
                borderColor: (sportsID==curSportsID)?"black":"#03003d"
            }, styles.button]}
            onPress = {()=>onPress(sportsID)}>
            <Text style={[styles.text, {color:(sportsID==curSportsID)?"#F9F9F9":"#636059"}]}>{title}</Text> 
        </Pressable>
    )
} 

const styles = StyleSheet.create({
    button :{
    margin : 5,
    borderRadius: 10,
    padding: 5,
    marginBottom:0
    },

    text : {
        fontSize:20
    }
})