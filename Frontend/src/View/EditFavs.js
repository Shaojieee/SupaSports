import React, { useEffect, useState } from "react";
import { View,Pressable, Text, StyleSheet, Image, FlatList, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import SportsTabs from "./SportsTabs";
import { useDispatch, useSelector } from "react-redux";
import { getFavourites, updateFavourite } from "../Controller/FavouritesController";
import {searchLeagueAndClub, getSportsList} from "../Controller/SportsController"
import SearchBar from "./SearchBar"
import Loading from "./Loading";



export default function EditFavs({navigation, route}){
    const [sportsID, setSportsID] = useState(route.params.sportsID)
    const [searchData, setsearchData] = useState()
    const [loaded, setLoaded] = useState(false)

    const user = useSelector(state=>state.user)
    const favs = useSelector(state=>state.favourites)
    const sportsList = useSelector(state=>state.sportsList)
    const dispatch = useDispatch()
    
    useEffect(()=>{
        dispatch(getFavourites({UID:user["UID"]}))
        dispatch(getSportsList())
    },[]);

    useEffect(()=>{
        if(favs.status=="succeeded" & sportsID!=undefined & sportsList.status=="succeeded"){
            setLoaded(true)
        }
    },[favs,sportsID, sportsList]);

    const changeSports=(id)=>{
        setLoaded(false)
        setSportsID(id)
    }

    const search = async(text)=>{
        if(text.length<3){
            setsearchData()
        }else if (text.length>=3){
            const results = await searchLeagueAndClub({text, sportsID})
            setsearchData(results)
        }
    }

    const update = (type, id, data, inFavs)=>{
        dispatch(updateFavourite({sportsID:sportsID, type:type, id:id, UID:user["UID"], data:data, inFavs}))
    }


    return(
    <View style={{flex:1}}>

        {/* Loading */}
        <Loading loaded={loaded}/>

        {/* Header */}
        <View style={{flexDirection:"row", alignItems:"center"}}>
            <Pressable
            style={{padding:10, paddingLeft: 5}}
            onPress={()=>navigation.reset({
                index:0,
                routes:[{name:"Main", params:{screen:"Favourites"}}]
              })}
            >
            <Icon
                name="arrow-back"
                size = {25}
                color="#000"
                backgroundColor="inherit"
            />
            </Pressable>
            <Text style={[styles.header,{color:"#636059"}]}>Edit Favourites</Text>
            
        </View>
        <View>
            {/* Sports Tab */}
            <SportsTabs data = {sportsList.sportsList} curSportsID = {sportsID} onPress={changeSports}/>

            {/* Search Bar */}
            <SearchBar search={search} sportsID={sportsID} placeholder="Search"/>
        </View>
        
        {/* Results Area */}
        {loaded&&
            <View style={{flex:1}}>
                {(searchData==undefined)?
                    <View>
                        {Object.keys(favs.favourites[sportsID]["league"]).length+Object.keys(favs.favourites[sportsID]["club"]).length>0?

                            <FlatList
                            data={Object.entries(favs.favourites[sportsID]["league"]).concat(Object.entries(favs.favourites[sportsID]["club"]))}
                            renderItem={({item, index})=><Card data={item[1]} key={item[0]} onPress={update}  type={index<Object.keys(favs.favourites[sportsID]["league"]).length?"league":"club"} id={item[0]} inFavs={true}/>}
                            showsVerticalScrollIndicator={false}
                            keyExtractor = {(item,index)=>{index<Object.keys(favs.favourites[sportsID]["league"]).length?"league"+item[0]:'club'+item[0]}}
                            exactData={favs}
                            contentContainerStyle={{marginTop:10, paddingBottom:10}}
                            />
                        :
                            <ScrollView contentContainerStyle={{alignItems:"center", flexGrow:1}}>
                                <NoFavs sportsID={sportsID} navigation={navigation}/>
                            </ScrollView>
                        
                        }
                    </View>
                    :
                    <View style={{flex:1}}>
                            <FlatList
                            data={searchData}
                            renderItem={({item, index})=><Card data={item} onPress={update} 
                                                                inFavs={favs.favourites[sportsID][item["type"]].hasOwnProperty(item["id"])}
                                                                type = {item["type"]} id={item["id"]}/>}
                            keyExtractor={(item)=>item["type"]+item["id"]}
                            contentContainerStyle={{marginTop:10, paddingBottom:15}}
                            />
                    </View>
                } 
            </View>
        }            
    </View>
    )
}

function NoFavs(){
    
    return(
        <View style = {styles.noFavs}>
            <Icon
                name="find-in-page"
                size = {100}
                color="#373b40"
                backgroundColor="inherit"
                style={{marginTop:100, marginBottom:10}}
            />

            <Text style = {[styles.noFavsText, {color:"#636059"}]}>You do not have any favourites</Text>
            <Text style = {[styles.noFavsText, {color:"#636059"}]}>Search to add some!</Text>
        </View>
    )
}
//data is a dictionary with id and type nested inside
function Card({data, onPress, inFavs, type, id}){
    const [aspectRatio, setRatio] = useState(1.5)

    useEffect(()=>{
        Image.getSize(data["logo"], (width,height)=>{setRatio(width/height)})
    },[])

    return (
        <View style={{  flexDirection:"row", alignItems:"center", justifyContent:"center",
                        backgroundColor:"#F9F9F9",
                        borderRadius:5, borderColor:"#000", borderWidth:1, 
                        margin:8, marginBottom:0,
                        padding:2}}
        >
            <Image
            style={{aspectRatio:aspectRatio, width:"100%", height:undefined, flex:2, maxWidth:70, maxHeight:70}}
            resizeMode="contain"
            source={{uri:data.logo}}
            />
            <Text style={{fontSize:17, paddingLeft:10, flex:9,color:"#636059"}}>
                {data.name}
            </Text>
            <Pressable
                style={{flex:2,  alignItems:"center"}}
                onPress={()=>onPress(type, id, data, inFavs)}
            >
                <Icon
                    name="favorite"
                    size={35}
                    color={inFavs?"#ff4dc6":"#000"}
                />
            </Pressable>
            
        </View>

    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 40
    },
    logo:{
        width:70,
        height:70
    },
    noFavs:{
        alignItems: 'center',
        justifyContent: "center",
    },
    noFavsText:{
        fontSize: 20,
        marginBottom:15
    },
})