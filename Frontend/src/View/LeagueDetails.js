import React, { useEffect, useState } from "react";
import { View, Pressable, Image, Text, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"
import { useDispatch, useSelector } from "react-redux";
import { getLeagueStandings, getLeagueFixture, getLeagueResults } from "../Controller/GameController";
import {GameCard} from "./GamesList"
import {updateFavourite} from "../Controller/FavouritesController"
import Loading from "./Loading";



//League table and future games and past games
export default function LeagueDetails({navigation, route}){
    const {leagueID, sportsID, leagueDetails} = route.params
    const favourites = useSelector(state=>state.favourites)
    const UID = useSelector(state=>state.user.UID)
    const [fixtures, setFixtures] = useState()
    const [results, setResults] = useState()
    const [table, setTable] = useState()
    const [tab, setTab] = useState("Table")
    const [loaded, setLoaded] = useState(false)
    const [refreshing,setRefreshing] = useState(false)

    const dispatch = useDispatch()

    useEffect(()=>{
        getFixtures()
        getResults()
        getTable()
    },[])

    useEffect(()=>{
        if(fixtures==undefined & tab=="Fixtures"){
            setLoaded(false)
        }else if(results==undefined & tab=="Results"){
            setLoaded(false)
        }else if(table==undefined & tab=="Table"){
            setLoaded(false)
        }else if(fixtures!=undefined & tab=="Fixtures"){
            setLoaded(true)
        }else if(results!=undefined & tab=="Results"){
            setLoaded(true)
        }else if(table!=undefined & tab=="Table"){
            setLoaded(true)
        }
    },[tab, fixtures, results, table])


    const getFixtures = async()=>{
        const results = await getLeagueFixture({sportsID, leagueID})
        setFixtures(results)
        setRefreshing(false)
    }

    const getResults = async()=>{
        const results = await getLeagueResults({sportsID, leagueID})
        setResults(results)
        setRefreshing(false)
    }

    const getTable = async()=>{
        const results = await getLeagueStandings({sportsID, leagueID})
        setTable(results)
        setRefreshing(false)
    }

    const refresh = ()=>{
        setRefreshing(true)
        if (tab=="Table"){
            getTable()
        }else if(tab=="Results"){
            getResults()
        }else if(tab=="Fixtures"){
            getFixtures()
        }
    }

    const pressFavourite=()=>{
        dispatch(updateFavourite({sportsID, type:"league", id:leagueID, UID, data:leagueDetails, inFavs:favourites.favourites[sportsID]["league"].hasOwnProperty(leagueID)}))
    }
    

    return(
        <View style={{flex:1}}>

            {/* Loading */}
            <Loading loaded={loaded}/>

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

            
            {/* Header Information */}
            
            <View style={{flexDirection:"row", flexGrow:0, alignItems:"center", justifyContent:"space-between"}}>
                <View style={{flexDirection:"row", flexGrow:0, alignItems:"center"}}>
                    <Image
                    source = {{uri:leagueDetails["logo"]}}
                    style= {{height:50, width:50}}
                    />
                    <Text style={{fontSize:20, padding:5, color:"#636059"}}>{leagueDetails["name"]}</Text>
                </View>
                <Pressable
                    onPress={pressFavourite}
                    style={{marginRight:8}}
                >
                    <Icon
                    name="favorite"
                    size={35}
                    color={favourites.favourites[sportsID]["league"].hasOwnProperty(leagueID)?"#ff4dc6":"#000"}
                    />
                </Pressable>
            </View>

            
            {/* Tabs Bar */}
            <View style={{flexDirection:'row', flexGrow:0, justifyContent:"space-evenly"}}>

            
                <Pressable onPress={()=>setTab("Table")}
                style = {({pressed})=>[{
                    backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Table")?"#03003d":"white",
                    borderWidth : 1,
                    borderColor: (tab=="Table")?"white":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                >
                    <Text style={[{color:(tab=="Table")?"white":"black"},{fontSize:20, textAlign:"center", textAlignVertical:"center"}]}>
                        Table
                    </Text>
                </Pressable>

                <Pressable onPress={()=>setTab("Fixtures")}
                style = {({pressed})=>[{
                    backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Fixtures")?"#03003d":"white",
                    borderWidth : 1,
                    borderColor: (tab=="Fixtures")?"white":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                >
                    <Text style={[{color:(tab=="Fixtures")?"white":"black"},{fontSize:20, textAlign:"center", textAlignVertical:"center"}]}>
                        Fixtures
                    </Text>
                </Pressable>

                <Pressable onPress={()=>setTab("Results")}
                style = {({pressed})=>[{
                    backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Results")?"#03003d":"white",
                    borderWidth : 1,
                    borderColor: (tab=="Results")?"white":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                > 
                    <Text style={[{color:(tab=="Results")?"white":"black"},{fontSize:20, textAlign:"center", textAlignVertical:"center"}]}>
                        Results
                    </Text>
                </Pressable>

            </View>

            {tab=="Table"&&
                <FlatList
                data={table}
                renderItem={({item})=><Table data={item} navigation={navigation} sportsID={sportsID}/>}
                contentContainerStyle={{marginTop:10, paddingBottom:15}}
                refreshing = {refreshing}
                onRefresh={refresh}
                />
            }

            {tab=="Fixtures"&&

                <FlatList
                data={fixtures}
                renderItem={({item})=><GameCard data={item} navigation={navigation} sportsID={sportsID}/>}
                keyExtractor={(item)=>item["fixture"]["id"]}
                refreshing = {refreshing}
                onRefresh={refresh}
                />
           
            }

            {tab=="Results"&&

                <FlatList
                data={results}
                renderItem={({item})=><GameCard data={item} navigation={navigation} sportsID={sportsID}/>}
                keyExtractor={(item)=>item["fixture"]["id"]}
                refreshing = {refreshing}
                onRefresh={refresh}
                />
            }

        </View>
    )
}


function Table({data, navigation ,sportsID}){

    return(
        <View style={{marginLeft:8,marginRight:8, marginBottom:5, borderWidth:2, borderColor:"black"}}>
            <View style={{flexDirection:"row", borderBottomWidth:2, borderColor:"black"}}>
                <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", color:"#262626"}}>#</Text>
                <Text style={{flex:6, color:"#262626"}}>{data[0]["group"]["name"]}</Text>
                <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", color:"#262626"}}>P</Text>
                <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", color:"#262626"}}>W</Text>
                <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", color:"#262626"}}>L</Text>
            </View>
            {data.map((item)=>(
                    <Pressable 
                    style={{padding:5, flexDirection:"row", borderBottomWidth:1, borderColor:"black"}}
                    onPress={()=>{navigation.navigate("TeamDetails", {clubID:item["team"]["id"], sportsID:sportsID, teamDetails:item["team"]})}}
                    >
                        <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", color:"#636059"}}>{item["position"]}</Text>
                        <View style={{flex:6, flexDirection:"row", alignItems:"center"}}>
                            <Image
                            source={{uri:item["team"]["logo"]}}
                            style={{width:25, height:25, marginRight:3}}
                            />
                            <Text style={{color:"#636059"}}>{item["team"]["name"]}</Text>
                        </View>
                        <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", color:"#636059"}}>{item["games"]["played"]}</Text>
                        <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", color:"#636059"}}>{item["games"]["win"]["total"]}</Text>
                        <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", color:"#636059"}}>{item["games"]["lose"]["total"]}</Text>
                    </Pressable>
                )
            )}
        </View>
    )
}