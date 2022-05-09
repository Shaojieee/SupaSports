import React, { useEffect, useState } from "react";
import { View, Pressable, Image, Text, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { getTeamFixture, getTeamResults } from "../Controller/GameController";
import {GameCard} from "./GamesList"
import Loading from "./Loading";
import {useSelector, useDispatch} from "react-redux"
import {updateFavourite} from "../Controller/FavouritesController"


//Upcoming games and past results
export default function TeamDetails({navigation, route}){
    const {clubID, sportsID, teamDetails} = route.params
    const favourites = useSelector(state=>state.favourites)
    const UID = useSelector(state=>state.user.UID)
    const [fixtures, setFixtures] = useState()
    const [results, setResults] = useState()
    const [tab, setTab] = useState("Fixtures")
    const [loaded, setLoaded] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const dispatch = useDispatch()

    useEffect(()=>{
        getFixtures()
        getResults()
    },[])

    useEffect(()=>{
        if(fixtures==undefined & tab=="Fixtures"){
            setLoaded(false)
            getFixtures()
        }else if(results==undefined & tab=="Results"){
            setLoaded(false)
            getResults()
        }else if(fixtures!=undefined & tab=="Fixtures"){
            setLoaded(true)
            setRefreshing(false)
        }else if(results!=undefined & tab=="Results"){
            setLoaded(true)
            setRefreshing(false)
        }
    },[tab, fixtures, results])



    const getFixtures = async()=>{
        const results = await getTeamFixture({sportsID, clubID})
        setFixtures(results)
        
    }

    const getResults = async()=>{
        const results = await getTeamResults({sportsID, clubID})
        setResults(results)
        
    }

    const refresh = ()=>{
        setRefreshing(true)
        if(tab=="Results"){
            getResults()
        }else if(tab=="Fixtures"){
            getFixtures()
        }
    }

    const pressFavourite=()=>{
        dispatch(updateFavourite({sportsID, type:"club", id:clubID, UID, data:teamDetails, inFavs:favourites.favourites[sportsID]["club"].hasOwnProperty(clubID)}))
    }

    return(
        <View style={{flex:1}}>

            {/* Loading */}
            <Loading loaded={loaded}/>

           {/* Header */}
           <View style={{flexDirection:"row", alignItems:"center", flexGrow:0}}>
                <Pressable
                style={{padding:10, paddingLeft: 5}}
                onPress={()=>navigation.goBack()}
                >
                <Icon
                    name="arrow-left"
                    size = {25}
                    color="#000"
                    backgroundColor="inherit"
                />
                </Pressable>
              
            </View>

            
            <View style={{margin:10, flexGrow:0, marginBottom:0}}>
                {/* Header Information */}
                <View style={{flexDirection:"row", flexGrow:0, alignItems:"center", justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row", flexGrow:0, alignItems:"center"}}>
                        <Image
                        source = {{uri:teamDetails["logo"]}}
                        style= {{height:50, width:50}}
                        />
                        <Text style={{fontSize:20, padding:5, color:"#636059"}}>{teamDetails["name"]}</Text>
                    </View>
                    <Pressable
                        onPress={pressFavourite}
                        style={{marginRight:8}}
                    >
                        <Icon
                        name="heart"
                        size={35}
                        color={favourites.favourites[sportsID]["club"].hasOwnProperty(clubID)?"#ff4dc6":"#000"}
                        />
                    </Pressable>
                </View>

                {/* Tabs Bar */}
                <View style={{flexDirection:'row', flexGrow:0, justifyContent:"space-evenly"}}>

                    <Pressable onPress={()=>setTab("Fixtures")}
                    style = {({pressed})=>[{
                        backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Fixtures")?"#003366":"#F9F9F9",
                        borderWidth : 1,
                        borderColor: (tab=="Fixtures")?"black":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                    >
                        <Text style={[{color:(tab=="Fixtures")?"#F9F9F9":"#636059"},{fontSize:20, textAlign:"center", textAlignVertical:"center"}]}>
                            Fixtures
                        </Text>
                    </Pressable>

                    <Pressable onPress={()=>setTab("Results")}
                    style = {({pressed})=>[{
                        backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Results")?"#003366":"#F9F9F9",
                        borderWidth : 1,
                        borderColor: (tab=="Results")?"black":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                    > 
                        <Text style={[{color:(tab=="Results")?"#F9F9F9":"#636059"},{fontSize:20, textAlign:"center", textAlignVertical:"center"}]}>
                            Results
                        </Text>
                    </Pressable>

                </View>
            </View>


            <View style={{flex:1}}>
                <FlatList
                data={tab=="Fixtures"?fixtures:results}
                renderItem={({item})=><GameCard data={item} navigation={navigation} sportsID={sportsID}/>}
                keyExtractor={(item)=>item["fixture"]["id"]}
                contentContainerStyle={{marginTop:10, paddingBottom:15}}
                showsVerticalScrollIndicator={false}
                refreshing ={refreshing}
                onRefresh = {refresh}
                />
            </View>
        
            
        </View>
    )
}