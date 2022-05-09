import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import CalendarStrip from "react-native-calendar-strip"
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment"

import SportsTabs from './SportsTabs';
import GamesList from './GamesList';
import Loading from './Loading';
import { getFavourites } from '../Controller/FavouritesController';
import { getSportsList } from '../Controller/SportsController';
import RemotePushController from '../Controller/PushNotifController';



export default function Favourites({navigation}){
    let today = moment();
    const [sportsID, setSportsID] = useState();
    const [loaded, setLoaded] = useState(false);
    const [date, setDate] = useState(today)
    
    const user = useSelector(state=>state.user)
    const favs = useSelector(state=>state.favourites)
    const sportsList = useSelector(state=>state.sportsList)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getFavourites({}))
        if (sportsList.status=="succeeded"){
            setSportsID(Object.keys(sportsList.sportsList)[0])
            dispatch(getSportsList())
        }else{
            dispatch(getSportsList())
        }

        
        
    },[])


    useEffect(()=>{
        if(favs.status=="succeeded" & sportsList.status=="succeeded"){
            setSportsID(Object.keys(sportsList.sportsList)[0])
        }
    },[favs, sportsList])

    useEffect(()=>{
        if(sportsID!=undefined){
            setLoaded(true)
        }
    },[sportsID])

    const changeSports = (id)=>{
        setLoaded(false)
        setSportsID(id)
    }

    

    return(
    <View style={{flex:1}}>
        <RemotePushController navigation={navigation}/>
        {/* Loading */}
        <Loading loaded={loaded}/>

        <View style={{flexDirection: "row", justifyContent:"space-between", alignItems:"center", flexGrow:0}}>
            <Text style={styles.header}>Favourites</Text>
            <Pressable
            style={({pressed})=>[{
                backgroundColor: pressed? 'rgb(210, 230, 255)':"white"
            }, styles.button]}
            onPress={()=>navigation.reset({
                index:0,
                routes:[{name:"EditFavs", params:{sportsID}}]
              })}
            >
                <Text style={{color:"#636059"}}>
                    Edit Favourites
                </Text>

            </Pressable>
        </View>

            <View style={{flexGrow:0}}>
            {sportsList.status=="succeeded" && 
            <SportsTabs data = {sportsList.sportsList} onPress = {changeSports} curSportsID={sportsID}/>
            }
            </View>
            
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
            
            {(loaded)&&
                <View style={{flex:1, marginTop:0}}>
                    <GamesList leagues={favs.favourites[sportsID]["league"]} clubs={favs.favourites[sportsID]["club"]} sportsID={sportsID} navigation={navigation} date={date}/>
                </View>
            }
        

    </View>
    )
}
  

const styles = StyleSheet.create({
    header: {
        fontSize: 40,
        color:"#636059"
    },
    button :{
        margin : 5,
        borderRadius: 10,
        padding: 5,
        borderColor: "#000",
        borderWidth: 1
    },
    bodyText : {
        fontSize:20
    }
})