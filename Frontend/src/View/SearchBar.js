import React, { useEffect, useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"

export default function SearchBar({search, sportsID, placeholder}){

    const [searchText, setSearchText] = useState("")

    useEffect(()=>{
        clearSearch()
    },[sportsID])

    useEffect(()=>{
        if (searchText==""){
            search(searchText)
        }
        const timeOut = setTimeout(() => {
            search(searchText)
        }, 500);

        return ()=>clearTimeout(timeOut)
    }, [searchText])


    const clearSearch = ()=>{
        setSearchText("")
    }

    return (
        <View style={styles.searchBox}>
            <Icon
            name = "search"
            size={25}
            color="#636059"
            style={{flex:1}}
            />

            <TextInput 
            placeholder={placeholder}
            placeholderTextColor="#A39D92"
            style={[styles.searchText, {flex:9, color:"#636059"}]}
            onChangeText={(text)=>{setSearchText(text)}}
            value = {searchText}
            />

            <Pressable
            style={{padding:10, paddingLeft: 5, flex:1}}
            onPress={clearSearch}
            >
            <Icon
                name="clear"
                size = {25}
                color="#636059"
                backgroundColor="inherit"
            />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
        alignItems: "center",
        borderWidth:1,
        borderColor:'#000',
        borderRadius:10,
        backgroundColor: '#ffffff',
        paddingLeft:8,
        marginRight:8,
        marginLeft:8,
        marginTop: 5,
        marginBottom:0
      },
    searchText:{
        fontSize: 17,
        marginLeft:8
    },
})