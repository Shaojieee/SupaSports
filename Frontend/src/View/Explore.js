import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Pressable, FlatList, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CalendarStrip from "react-native-calendar-strip"
import moment from "moment"

import SportsTabs from './SportsTabs'
import GamesList from './GamesList'
import {getSportsList, searchLeagueAndClub} from "../Controller/SportsController"
import SearchBar from './SearchBar'
import Loading from './Loading'

export default function Explore({navigation}){
    const today = moment()
    const sportsList = useSelector(state=>state.sportsList)
    const [sportsID, setSportsID] = useState()
    const [loaded, setLoaded] = useState(false)
    const [searchData, setsearchData] = useState()
    const [date, setDate] = useState(today)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSportsList())
    },[])

    useEffect(()=>{
        if(sportsList.status=="succeeded"){
            setSportsID(Object.keys(sportsList.sportsList)[0])
        }
    },[sportsList])

    useEffect(()=>{
        if(sportsID!=undefined){
            setLoaded(true)
        }
    },[sportsID])


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

    return(
        <View style={{flex:1}}>

            {/* Loading */}
            <Loading loaded={loaded}/>

            <View style={{flexDirection: "row", justifyContent:"space-between", alignItems:"center", flexGrow:0}}>
                <Text style={[styles.header, {color:"#636059"}]}>Explore</Text>
            </View>

            <View style={{flexGrow:0}}>
                {sportsList.status=="succeeded" && 
                <SportsTabs data = {sportsList.sportsList} onPress = {changeSports} curSportsID={sportsID}/>
                }
                
                <View style={{flexGrow:0}}>
                    <CalendarStrip
                    scrollable
                    onDateSelected={(date)=>setDate(date)}
                    selectedDate = {date}
                    startingDate = {date}
                    style={{height:70, margin:5, color:"#636059"}}
                    highlightDateContainerStyle={{borderWidth:2, borderColor:"#636059"}}
                    highlightDateNameStyle={{color:"#636059"}}
                    highlightDateNumberStyle={{color:"#636059"}}
                    dateNameStyle={{color:"#636059"}}
                    dateNumberStyle={{color:"#636059"}}
                    calendarHeaderStyle={{color:"#636059"}}
                    />
                </View>

                {/* Search Bar */}
                <SearchBar search={search} sportsID={sportsID} placeholder="Search"/>
            </View>

            {(loaded)&&
                <View style={{flex:1, marginTop:0}}>
                        
                    <View style={[{display:searchData?"none":"flex"},{flex:1, marginTop:0, marginLeft:8, marginRight:8}]} >
                        <GamesList leagues={sportsList.sportsList[sportsID]["popular"]["league"]} clubs={sportsList.sportsList[sportsID]["popular"]["club"]} sportsID={sportsID} navigation={navigation} date={date} />
                    </View>
                   {(searchData!=undefined)&&     
                    <FlatList
                    data={searchData}
                    renderItem={({item})=><ExploreResults data={item} navigation={navigation} sportsID={sportsID}/>}
                    keyExtractor={(item)=>item["type"]+item["id"]}
                    />
                    }
                </View>
            }
        </View>
    )
}

function ExploreResults({data, navigation, sportsID}){

    const goToDetails = ()=>{
        if (data['type']=="league"){
            navigation.navigate("LeagueDetails", {leagueDetails:data, leagueID: data["id"], sportsID})
        }else{
            navigation.navigate("TeamDetails", {teamDetails:data, clubID:data["id"] , sportsID})
        }
        
    }

    return (
        <Pressable 
        style={{  flexDirection:"row", alignItems:"center", justifyContent:"center",
                    backgroundColor:"white",
                    borderRadius:5, borderColor:"#000", borderWidth:1, 
                    margin:8, marginLeft:15, marginRight:15, marginBottom:0,
                    padding:5}}
        onPress={goToDetails}
        >
            <Image
            style={[styles.logo, {alignSelf:"stretch"}]}
            source={{uri:data.logo}}
            />
            <Text style={{fontSize:17, paddingLeft:10, flex:9, color:"#636059"}}>
                {data.name}
            </Text>
            
        </Pressable>

    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 40
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: "center",
        borderWidth:1,
        borderColor:'#000',
        borderRadius:10,
        backgroundColor: '#ffffff',
        paddingLeft:8,
        marginRight:8,
        marginTop: 5,
        marginBottom:0
      },
      searchText:{
          fontSize: 17,
          marginLeft:8
      },
      logo:{
        width:50,
        height:50
    }
})