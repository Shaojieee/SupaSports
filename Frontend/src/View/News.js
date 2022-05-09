import React, { useEffect, useState } from 'react'
import { FlatList, ImageBackground, StyleSheet, Text, View, Pressable, Linking, ScrollView, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Icon from "react-native-vector-icons/MaterialIcons"
import SportsTabs from "./SportsTabs"
import {getSportsList} from "../Controller/SportsController"
import {getSportsNews} from "../Controller/NewsController"
import Loading from './Loading'

export default function News({navigation}){
    const sportsList = useSelector(state=>state.sportsList)

    const [sportsID, setSportsID] = useState()
    const [loaded, setLoaded] = useState(false)
    const [news, setNews] = useState()
    const [pageNumber, setPageNumber] = useState(1)
    const [refreshing, setRefreshing] = useState(false)

    const dispatch = useDispatch()

    useEffect(()=>{
        if(sportsList.status=="Not loaded"){
            dispatch(getSportsList())
        }
    },[])

    useEffect(()=>{
        if(sportsList.status=="succeeded"){
            setSportsID(Object.keys(sportsList.sportsList)[0])
        }
    },[sportsList])

    useEffect(()=>{
        if(sportsID!=undefined){
            setLoaded(false)
            getNews()
        }
    },[sportsID])

    useEffect(()=>{
        if(news!=undefined){
            setLoaded(true)
        }
    },[news])

    const getNews= async()=>{
        const results = await getSportsNews({pageNumber, sportsID})
        setNews(results)
        setPageNumber(pageNumber+1)
        setRefreshing(false)
    }

    const changeSports=(id)=>{
        setLoaded(false)
        setSportsID(id)
    }

    const refresh = ()=>{
        setRefreshing(true)
        getNews()
    }

    
    return(
        <View style={{flex:1}}> 

            {/* Loading */}
            <Loading loaded={loaded}/>

            <View style={{flexDirection: "row", justifyContent:"space-between", alignItems:"center", flexGrow:0}}>
                <Text style={{fontSize:40, color:"#636059"}}>News</Text>
            </View>

            <View>
                {sportsList.status=="succeeded" && 
                <SportsTabs data = {sportsList.sportsList} onPress = {changeSports} curSportsID={sportsID}/>
                }
            </View>


            {loaded&&
                <FlatList
                data={news[1]}
                renderItem={({item, index})=><NewsCard data={item} navigation={navigation}/>}
                keyExtractor={(item)=>item.id}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={refresh}
                />
            }
        </View>
    )
}


function NewsCard({data, navigation}){

    const onPressPost=()=>{
        navigation.navigate("NewsArticle",{data:data})
    }

    return(
        <Pressable 
        style={{flex:1,borderRadius:5, borderWidth:1, borderColor:"black", 
                margin: 8,marginLeft:15, marginRight:15, backgroundColor:"white", justifyContent:"flex-end", height:160}}
        onPress={onPressPost}
        >
                <ImageBackground
                source = {{uri:data["media"]}}
                style={{flex:1}}
                >
                    <View style={{flex:1, backgroundColor:'rgba(52, 52, 52, 0.53)', justifyContent:"flex-end"}}>
                        <Text style={{fontSize:18, color:"#F9F9F9", marginLeft:5, marginBottom:2}}>{data["title"]}</Text>
                    </View>
                </ImageBackground>
        </Pressable>
    )
}

export function NewsArticle({navigation, route}){
    const data= route.params.data
    const [aspectRatio, setRatio] = useState(1.5)
    useEffect(()=>{
        Image.getSize(data["media"], (width,height)=>{setRatio(width/height)})
    },[])
    
    return(
        <View style={{flex:1}}>
            {/* Header */}
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Pressable
                style={{padding:10, paddingLeft: 5}}
                onPress={()=>navigation.goBack()}
                >
                <Icon
                    name="arrow-back"
                    size = {25}
                    color="#000"
                    backgroundColor="inherit"
                />
                </Pressable>
                
            </View>
            <ScrollView style={{margin:10, marginBottom:0}} showsVerticalScrollIndicator={false}>
                <Image
                source = {{uri:data["media"]}}
                style={{width:"100%",height:undefined, aspectRatio:aspectRatio}}
                />
                    
                <View style={{margin:5}}>
                    <View style={{marginBottom:8}}>
                        <Text style={{fontSize:27, color:"#636059"}}>{data["title"]}</Text>
                    </View>

                    <View style={{marginBottom:8}}>
                        <Text style={{color:"#636059"}}>{data["author"]}</Text>
                        <Text style={{color:"#636059"}}>{data["published_date"]}</Text>
                    </View>

                    

                    <View style={{marginBottom:8}}>
                        <Text style={{fontSize:18, color:"#636059"}}>{data["summary"]}</Text>
                    </View>

                    <View>
                        <Text style={{color:"#003366"}} onPress={()=>{Linking.openURL(data["link"])}}>To continue reading...</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})