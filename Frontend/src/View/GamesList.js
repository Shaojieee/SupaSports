import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, FlatList, ImageBackground, RefreshControl, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { getFixtureByDate } from "../Controller/GameController";
import { useDispatch } from "react-redux";
import {getArticlesByClub} from "../Controller/NewsController"



export default function GamesList({leagues, clubs, sportsID, navigation, date}){
    const [refreshing, setRefreshing] = useState(false)
    const [reload, setReload] = useState(false)

    const refresh = ()=>{
        setRefreshing(true)
        setReload(!reload)
        setRefreshing(false)
    }
    
    return (
        <View style={{flex:1}}>


            

            {Object.keys(leagues).length+Object.keys(clubs).length>0?
                <View style={{flex:1}}>
                    
                    <FlatList
                    data={Object.entries(leagues).concat(Object.entries(clubs))}
                    renderItem={({item,index})=><Group id={item[0]} details={item[1]} type={index<Object.keys(leagues).length?"league":"club"}
                                                        navigation={navigation} date={date} sportsID={sportsID} reload={reload}/>}
                    showsVerticalScrollIndicator={false}
                    keyExtractor = {(item,index)=>item[0]+index}
                    extraData={[date, reload]}
                    refreshing={refreshing}
                    onRefresh={refresh}
                    />
                </View>
                :
                
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>} contentContainerStyle={{alignItems:"center", flexGrow:1}}>
                    <NoFavs sportsID={sportsID} navigation={navigation}/>
                </ScrollView>
            }
        </View>
    )
}

function Group({id, details, type, navigation, date, sportsID, reload}){
    const allGames = useSelector(state=>state.games.games)
    const status = useSelector(state=>state.games.status)
    const [news,setNews] = useState()
    const [loaded, setLoaded] = useState(false)
    const [games, setGames] = useState()
    const dispatch = useDispatch()
    

    useEffect(()=>{
        if(loaded==true){
            setGames([])
            getGame()
        }
    },[date])
    
    useEffect(()=>{
        if (loaded==true){
            
            dispatch(getFixtureByDate({id, sportsID, date:date.format("YYYY-MM-DD"), type}))
            if(type=="club"){
                getNews()
            }
        }
    },[reload])

    useEffect(()=>{
        if(type=="club"){
            getNews()
        }else{
            setNews([])
        }
        getGame()
    },[])

    useEffect(()=>{
        if(news!=undefined & games!=undefined){
            setLoaded(true)
            
        }
    },[news, games])

    useEffect(()=>{
        if(allGames.hasOwnProperty(sportsID)){
            if(allGames[sportsID].hasOwnProperty(type)){
                if(allGames[sportsID][type].hasOwnProperty(id)){
                    if(allGames[sportsID][type][id].hasOwnProperty(date.format("YYYY-MM-DD"))){
                        setGames(allGames[sportsID][type][id][date.format("YYYY-MM-DD")])
                    }
                }
            }
        }
    },[allGames, status])

    const getGame = async()=>{
            let temp = false
            if(allGames.hasOwnProperty(sportsID)){
                if(allGames[sportsID].hasOwnProperty(type)){
                    if(allGames[sportsID][type].hasOwnProperty(id)){
                        if(allGames[sportsID][type][id].hasOwnProperty(date.format("YYYY-MM-DD"))){
                            setGames(allGames[sportsID][type][id][date.format("YYYY-MM-DD")])
                            temp=true
                        }
                    }
                }
            }
            if(temp==false){
                dispatch(getFixtureByDate({id, sportsID, date:date.format("YYYY-MM-DD"), type}))
            }
    }

    const getNews= async()=>{
        const results = await getArticlesByClub("0", details.name, "Premier League")
        setNews(results)
    }

    const viewDetails = ()=>{
        if(type=="league"){
            navigation.navigate("LeagueDetails", {leagueID:id, sportsID:sportsID, leagueDetails:details})
        }else{
            navigation.navigate("TeamDetails",{clubID:id, sportsID:sportsID, teamDetails:details})
        }
    }

    return(
        <View>

            {loaded&&
            <View>
                <Pressable
                style= {{flexDirection:"row", alignItems:"center", marginTop:10, marginLeft:5}}
                onPress={viewDetails}
                >
                    <Image 
                    style = {styles.logo}
                    source={{uri: details.logo}}
                    />
                    <Text style={{color:"#636059", fontSize:18}}>{details.name}</Text>

                </Pressable>

                    {news!=undefined &&
                        <FlatList
                        horizontal={true}
                        data={news[1]}
                        renderItem = {({item})=><NewsCard data={item} navigation={navigation}/>}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item)=>item.id}
                        />
                    }
                    
                    {games!=undefined &&
                        <View>
                            {games.length!=0?
                                <View>
                                    {games.map((game)=>
                                        <GameCard data={game} key={game.game_id} navigation={navigation} sportsID={sportsID}/>  
                                    )}
                                </View>
                            :
                                <View style={[styles.margin, styles.marginCard,{borderRadius:5, borderColor:"#000", borderWidth:1, backgroundColor:"#F9F9F9"}]}>
                                    <Text style={{textAlign:"center", textAlignVertical:"center", fontSize:15,color:"#636059"}}>No Games</Text>
                                </View>
                            }
                        </View>
                    } 
                </View>   
                }
        </View>
    )
}

function NewsCard({data, navigation}){

    const onPressPost = ()=>{
        navigation.navigate("NewsArticle", {data:data})
    }


    return(
        <Pressable 
        style={{flex:1,borderRadius:5, borderWidth:2, borderColor:"black", 
                margin: 8, marginRight:15, backgroundColor:"white", justifyContent:"flex-end", height:100, width:150}}
        onPress={onPressPost}
        >
                <ImageBackground
                source = {{uri:data["media"]}}
                style={{flex:1}}
                >
                    <View style={{flex:1, backgroundColor:'rgba(52, 52, 52, 0.53)', justifyContent:"flex-end"}}>
                        <Text 
                        style={{fontSize:18, color:"#F9F9F9", marginLeft:5, marginBottom:2}}
                        numberOfLines={2}
                        >
                            {data["title"]}
                            </Text>
                    </View>
                </ImageBackground>
        </Pressable>

    )
}

export function GameCard({data, navigation, sportsID}){
    const today = moment().format('DD/MM')
    const date= moment(data["dateTime"]).format('DD/MM')
    const time = moment(data["dateTime"]).format('HH:mm')
    const statusOfMatch = data["fixture"]["status"]["short"]
    let status
    if (statusOfMatch=='NS' || statusOfMatch=='PST'||statusOfMatch=='TBD'){
        status = "Not started"
    }else if (statusOfMatch=="1H" || statusOfMatch=="2H"){
        status="Ongoing"
    }else if(statusOfMatch=="FT" || statusOfMatch=="AET" || statusOfMatch=="PEN" || statusOfMatch=="HT"){
        status="Completed"
    }else{
        status="Special"
    }
    const sameDate = (today===date)

    return (
        <Pressable
        style={({pressed})=>[{
            backgroundColor: pressed? 'rgb(210, 230, 255)': '#F9F9F9',
            flexDirection:"row"
        }, {margin:6, marginBottom:8, padding:5, borderRadius:5, borderColor:"#000", borderWidth:1}]}
        onPress={()=>navigation.navigate("GameDetails", {gameID:data["fixture"]["id"], sportsID:sportsID})}
        >
                <View style={{flex:1, alignContent:"center", justifyContent:"center", flexDirection:"column"}}>
                    {(!sameDate && status=="Not started")?
                        <View style={{alignContent:"center", justifyContent:"center"}}>
                            <Text style={{textAlign:"center", color:"#636059"}}>{date}</Text>
                        </View>
                        :
                        <View></View>
                    }
                    <View style={{alignContent:"center", justifyContent:"center"}}>
                    {status=="Not started"&&
                        <Text style={{textAlign:"center", color:"#636059"}}>{time}</Text> 
                    }

                    {status=="Ongoing"&&
                        <Text style={{textAlign:"center", color:"#636059"}}>{data["fixture"]["status"]["elapsed"]}</Text>
                    }

                    {status=="Completed"&&
                        <Text style={{textAlign:"center", color:"#636059"}}>{data["fixture"]["status"]["short"]}</Text>
                    }

                    {status=="Special"&&
                        <Text style={{textAlign:"center", color:"#636059"}}>{data["fixture"]["status"]["short"]}</Text>
                    }
                    </View>
                    
                </View>

                <View style={{flex:6.3}}>

                    <View style={{flexDirection:"row", alignItems:"center", marginBottom:3}}>
                        <Image
                        style={styles.logo}
                        source={{uri: data["teams"]["home"]["logo"]}}/>
                        
                        <Text style={{textAlign:"center", fontSize:17, color:"#636059"}}>{data["teams"]["home"]["name"]}</Text>
                    </View>

                    <View style={{flexDirection:"row", alignItems:"center", marginTop:3}}> 
                        <Image
                        style={styles.logo}
                        source={{uri: data["teams"]["away"]["logo"]}}/>

                        <Text style={{textAlign:"center", fontSize:17, color:"#636059"}}>{data["teams"]["away"]["name"]}</Text>
                    </View> 
                </View>

                {(status=="Completed" || status=="Ongoing")&&
                    <View style={{justifyContent:"space-evenly", paddingRight:5}}>
                        <Text style={{textAlign:"center", fontSize:20, marginBottom:3, color:"#636059"}}>{data["goals"]["home"]}</Text>
                        <Text style={{textAlign:"center", fontSize:20, marginTop:3, color:"#636059"}}>{data["goals"]["away"]}</Text>
                    </View>
                }
        </Pressable>
    )
}

function NoFavs ({navigation, sportsID}){

    const handlePress= ()=>{
        navigation.navigate("EditFavs", {sportsID: sportsID})
    }
    return(
        <View style = {{alignItems:"center", justifyContent:"center", flexGrow:1}}>
            <Text style = {{fontSize:20, marginBottom:15, color:"#636059"}}>You do not have any favourites</Text>
            <Pressable
                onPress={handlePress} 
                style={({pressed})=>[{
                    backgroundColor: pressed? 'rgb(210, 230, 255)': '#F9F9F9'
                }, {margin:5, borderRadius:10, padding:5, borderWidth:1}]}>
                <Text style={{fontSize:20, color:"#636059"}}>Add some here!</Text> 
            </Pressable> 
        </View>
    )
}


const styles = StyleSheet.create({
    logo:{
        width:30,
        height:30
    },
    margin:{
        margin:8
    },
    marginCard:{
        marginBottom: 5
    }

})

