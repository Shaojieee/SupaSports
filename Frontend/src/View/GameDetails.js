import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, FlatList, Pressable, Image, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import {createGameComments, deleteGameComments, dislikeGameComments, displayGameComments, editGameComment, likeGameComments} from "../Controller/GameCommentController"
import {getGameDetails} from "../Controller/GameController"
import Loading from "./Loading"


    
export default function GameDetails ({navigation, route}){
    const {gameID, sportsID} = route.params
    const user = useSelector(state=>state.user)
    const [gameDetails, setGameDetails] = useState()
    const [loaded, setLoaded] = useState(false)
    const [tab, setTab] = useState("Info")
    const [comments, setComments] = useState()
    const [hide, setHide] = useState(false)
    const [commentText, setCommentText] = useState("")
    const [homeTeamName, setHomeTeamName] = useState()
    const [awayTeamName, setAwayTeamName] = useState()
    const [refreshing, setRefreshing] = useState(false)
    const [reload, setReload] = useState(true)

    useEffect(()=>{
        getGame()
        getGameComments()
    },[])

    useEffect(()=>{
        if(gameDetails!=undefined & comments!=undefined){
            setLoaded(true)
            setRefreshing(false)
        }
    },[gameDetails, comments])

    const getGameComments = async()=>{
        const results = await displayGameComments({gameID, sportsID, UID:user.UID})
        setComments(results)
        setRefreshing(false)
    }

    const getGame = async()=>{
        const results = await getGameDetails({sportsID, gameID})
        if (results!=undefined){
            setGameDetails(results)
            setHomeTeamName(results["teams"]["home"]["name"])
            setAwayTeamName(results["teams"]["away"]["name"])
            setRefreshing(false)
        }else{
            setLoaded(true)
            setRefreshing(false)
        }
    }

    const deleteComment= async({commentID})=>{
        const results = await deleteGameComments({gameID, sportsID, commentID})
        if(results){
            delete comments[commentID]
            setReload(!reload)
        }
    }

    const likeComment = async({commentID, liked, disliked})=>{
        if (liked==true){
            comments[commentID]["Liked"]=false
            comments[commentID]["NumLikes"] -=1
        }else if (disliked==true){
            comments[commentID]["Disliked"]=false
            comments[commentID]["NumDislikes"] -=1
            comments[commentID]["Liked"]=true
            comments[commentID]["NumLikes"] +=1
        }else{
            comments[commentID]["Liked"] = true
            comments[commentID]["NumLikes"] +=1
        }
        setReload(!reload)
        const results = await likeGameComments({gameID, sportsID, commentID, UID:user.UID})
        if (results==undefined){
            if (liked==true){
                comments[commentID]["Liked"]=true
                comments[commentID]["NumLikes"] +=1
            }else if (disliked==true){
                comments[commentID]["Disliked"]=true
                comments[commentID]["NumDislikes"] +=1
                comments[commentID]["Liked"]=false
                comments[commentID]["NumLikes"] -=1
            }else{
                comments[commentID]["Liked"] = false
                comments[commentID]["NumLikes"] -=1
            }
            setReload(!reload)
        }
    }

    const dislikeComment = async({commentID, liked, disliked})=>{
        
        if (liked==true){
            comments[commentID]["Liked"]=false
            comments[commentID]["NumLikes"] -=1
            comments[commentID]["Disliked"]=true
            comments[commentID]["NumDislikes"] +=1
        }else if (disliked==true){
            comments[commentID]["Disliked"]=false
            comments[commentID]["NumDislikes"] -=1
        }else{
            comments[commentID]["Disliked"] = true
            comments[commentID]["NumDislikes"] +=1
        }
        setReload(!reload)
        const results = await dislikeGameComments({gameID, sportsID, commentID, UID:user.UID})
        if (results==undefined){
            if (liked==true){
                comments[commentID]["Liked"]=true
                comments[commentID]["NumLikes"] +=1
                comments[commentID]["Disliked"]=false
                comments[commentID]["NumDislikes"] -=1
            }else if (disliked==true){
                comments[commentID]["Disliked"]=true
                comments[commentID]["NumDislikes"] +=1
            }else{
                comments[commentID]["Disliked"] = false
                comments[commentID]["NumDislikes"] -=1
            }
            setReload(!reload)
        }
    }
        
    const editComment = async({commentID, text})=>{
        const oldText = comments[commentID]["Text"]
        comments[commentID]["Text"] = text
        setReload(!reload)
        const results = await editGameComment({gameID, sportsID, commentID, text})
        if(!results){
            comments[commentID]["Text"] = oldText
            setReload(!reload)
        }
        
    }

    const onPressComment= async()=>{
        const results = await createGameComments({gameID, sportsID, text:commentText, UID:user.UID})
        if(results!=undefined){
            setComments({...results,...comments})
            setCommentText("")
        }
    }

    const refresh = ()=>{
        setRefreshing(true)
        if (tab=="Info" | tab=="Events" | tab=="Stats"){
            getGame()
        }else if(tab=="Comments"){
            getGameComments()
        }
    }

    return (
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
                    name="arrow-left"
                    size = {25}
                    color="#000"
                    backgroundColor="inherit"
                />
                </Pressable>
              
            </View>

            {(gameDetails!=undefined)&&
                <View style={{flex:1}}>
                    {/* Header Information */}
                    <View style={{flexDirection:"row", justifyContent:"space-between", flexGrow:0}}>
                        {/* Home Team */}
                        <Pressable 
                        style={{alignItems:"center", flex:1}}
                        onPress={()=>{navigation.navigate("TeamDetails", {clubID:gameDetails["teams"]["home"]["id"], sportsID:sportsID, teamDetails:gameDetails["teams"]["home"]})}}>
                            <Image
                            source={{uri:gameDetails["teams"]["home"]["logo"]}}
                            style={{width:80, height:80}}
                            />
                            <Text style={{fontSize:20, textAlign:"center",color:"#636059"}}>{gameDetails["teams"]["home"]["name"]}</Text>
                        </Pressable>
                        {/* Score and Status */}
                        <View style={{justifyContent:"center", alignItems:"center", flex:1}}>
                            <View style={{}}>
                                {gameDetails["goals"]["home"]!=null &&
                                    <Text style={{fontSize:30,color:"#636059"}}>{gameDetails["goals"]["home"]}-{gameDetails["goals"]["away"]}</Text>
                                }
                            </View>
                            <Text style={{fontSize:19,color:"#636059"}}> {gameDetails["fixture"]["status"]["long"]}</Text>
                        </View>
                        {/* Away Team */}
                        <Pressable 
                        style={{alignItems:"center", flex:1}}
                        onPress={()=>{navigation.navigate("TeamDetails", {clubID:gameDetails["teams"]["away"]["id"], sportsID:sportsID, teamDetails:gameDetails["teams"]["away"]})}}>
                            <Image
                            source={{uri:gameDetails["teams"]["away"]["logo"]}}
                            style={{width:80, height:80}}
                            />
                            <Text style={{fontSize:20, textAlign:"center",color:"#636059"}}>{gameDetails["teams"]["away"]["name"]}</Text>
                        </Pressable>
                    </View>

                    
                    {/* Tabs Bar */}
                    <View style={{flexDirection:'row', flexGrow:0, justifyContent:"space-evenly"}}>

                        <Pressable 
                        onPress={()=>setTab("Info")}
                        style = {({pressed})=>[{
                            backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Info")?"#003366":"#F9F9F9",
                            borderWidth : 1,
                            borderColor: (tab=="Info")?"black":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                        >
                            <Text style={[{color:(tab=="Info")?"#F9F9F9":"#636059"},{fontSize:20, textAlign:"center", textAlignVertical:"center"}]}>
                                Info
                            </Text>
                        </Pressable>

                        {gameDetails.hasOwnProperty("events")&&
                        <Pressable onPress={()=>setTab("Events")}
                         style = {({pressed})=>[{
                            backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Events")?"#003366":"#F9F9F9",
                            borderWidth : 1,
                            borderColor: (tab=="Events")?"black":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                        >
                            <Text style={[{color:(tab=="Events")?"#F9F9F9":"#636059"},{fontSize:20}]}>
                                Events
                            </Text>
                        </Pressable>
                        }

                         {gameDetails.hasOwnProperty("statistics")&&
                        <Pressable onPress={()=>setTab("Stats")}
                         style = {({pressed})=>[{
                            backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Stats")?"#003366":"#F9F9F9",
                            borderWidth : 1,
                            borderColor: (tab=="Stats")?"black":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                        >
                            <Text style={[{color:(tab=="Stats")?"#F9F9F9":"#636059"},{fontSize:20}]}>
                                Stats
                            </Text>
                        </Pressable>
                        }
                        <Pressable onPress={()=>setTab("Comments")}
                         style = {({pressed})=>[{
                            backgroundColor: pressed? 'rgb(210, 230, 255)': (tab=="Comments")?"#003366":"#F9F9F9",
                            borderWidth : 1,
                            borderColor: (tab=="Comments")?"black":"#03003d"},{margin:5, borderRadius:10, padding:5, marginBottom:0}]}
                        >
                            <Text style={[{color:(tab=="Comments")?"#F9F9F9":"#636059"},{fontSize:20}]}>
                                Comments
                            </Text>
                        </Pressable>
                    </View>

                    {(tab=="Info") &&
                        <View style={{alignItems:"center", justifyContent:"center", margin:10}}>
                            {gameDetails["fixture"].hasOwnProperty("venue")&&
                            <Text style={{margin:10, fontSize:20,color:"#636059"}}>{gameDetails["fixture"]["venue"]["name"]}</Text>
                            }
                             {gameDetails["fixture"].hasOwnProperty("date")&&
                            <Text style={{margin:10, fontSize:20,color:"#636059"}}>{gameDetails["date"]}</Text>
                            }
                            {gameDetails["fixture"].hasOwnProperty("referee")&&
                            <Text style={{margin:10, fontSize:20,color:"#636059"}}>{gameDetails["fixture"]["referee"]}</Text>
                            }
                        </View>
                    }

                    {(tab=="Events") &&
                        <View style={{flex:1, marginLeft:10, marginRight:10}}>
                            <FlatList
                            data={gameDetails["events"]}
                            renderItem={({item})=><Event item={item} homeTeam={homeTeamName==item["team"]["name"]}/>}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{marginTop:10, paddingBottom:15}}
                            refreshing={refreshing}
                            onRefresh={refresh}
                            />
                        </View>
                    }

                    {(tab=="Stats") &&
                    <View style={{flex:1, marginLeft:10, marginRight:10}}>    
                        <FlatList
                        data={gameDetails["statistics"]}
                        renderItem={({item})=><Stats item={item}/>}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{marginTop:10, paddingBottom:15}}
                        refreshing={refreshing}
                        onRefresh={refresh}
                        />
                    </View>
                    }   

                    {(tab=="Comments") &&
                    <View style={{flex:1}}>
                        <FlatList
                        data={Object.entries(comments)}
                        renderItem={({item})=><Comment commentID={item[0]} commentDetails={item[1]}  
                                                        setHide={(value)=>setHide(value)} 
                                                        deleteComment = {deleteComment} likeComment={likeComment} 
                                                        dislikeComment={dislikeComment} editComment = {editComment}
                                                        navigation={navigation}
                                                        />}
                        contentContainerStyle={{marginTop:10, paddingBottom:15}}
                        extraData={reload}
                        keyExtractor={(item)=>item[0]}
                        refreshing={refreshing}
                        onRefresh={refresh}
                        />

                        {(!hide)&&
                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center",
                                        marginLeft:10, marginRight:10, marginBottom:5,
                                        borderWidth:1, borderColor:"black", borderRadius:5,
                                        backgroundColor:"#F9F9F9"}}>
                                <TextInput 
                                placeholder='Enter Comment'
                                placeholderTextColor="#A39D92"
                                multiline={true}
                                style={{flex:1,color:"#636059"}}
                                onChangeText={(text)=>setCommentText(text)}
                                value={commentText}
                                />
                                <Pressable
                                onPress = {onPressComment}
                                >
                                    <Icon
                                    name="send"
                                    size={25}
                                    style={{marginRight:5, marginLeft:5}}
                                    color="#636059"
                                    />
                                </Pressable>
                            </View>
                        }

                    </View>
                    }
                </View>
            }
        </View>
    )
}

function Event({item, homeTeam}){
    let iconName
    let iconColor
    if(item["type"]=="subst"){
        iconName = "swap-horizontal"
        iconColor="black"
    }else if(item["type"]=="Goal"){
        iconName = "soccer"
        if(item["detail"]=="Own Goal"){
            iconColor="red"
        }else{
            iconColor="black"
        }
    }else if(item["type"]=="Card"){
        iconName="card"
        if (item["detail"]=="Yellow Card"){
            iconColor="yellow"
        }else{
            iconColor="red"
        }

    }

    return(
        <View style={{flexDirection:"row", alignItems:"center", marginBottom:10, borderBottomWidth:2, borderBottomColor:"black"}}>
            <Text style={{fontSize:20, marginRight:5, color:"#636059"}}>{item["time"]["elapsed"]}</Text>
            <View style={{flex:1}}>
            <Text style={{fontSize:20, textAlign:"right", marginRight:5, color:"#636059"}}>{homeTeam?item["player"]["name"]: ""}</Text>
            </View>
            <Icon
            name={iconName}
            color={iconColor}
            size={20}
            />
            <View style={{flex:1}}>
            <Text style={{fontSize:20, marginLeft:5, color:"#636059"}}>{!homeTeam?item["player"]["name"]: ""}</Text>
            </View>
        </View>
    )
}

function Stats({item}){
    
    const type = item["type"]
    const home = item["home"]
    const away = item["away"]
    let homeRatio
    let awayRatio
    if(home+away==0){
        homeRatio=0
        awayRatio=0
    }else{
        homeRatio = home/(home+away)
        awayRatio = away/(home+away)
    }

    return(
        <View style={{marginBottom:5}}>
            <View style={{flexDirection:"row", justifyContent:"space-between", flexGrow:0, marginLeft:10, marginRight:10}}>
                <Text style={{fontSize:18, color:"#636059"}}>
                    {home}
                </Text>
                <Text style={{fontSize:18, color:"#636059"}}>
                    {type}
                </Text>
                <Text style={{fontSize:18, color:"#636059"}}>
                    {away}
                </Text>
            </View>

            <View style={{flexDirection:"row", height:30}}>

                <View style={{flexDirection:"row", backgroundColor:"rgba(84, 81, 74,0.8)", flex:1, marginRight:2,borderRadius:10, borderWidth:1, borderColor:1}}>
                    <View style={{flex:awayRatio}}/>
                    <View style={{flex:homeRatio, backgroundColor:"#BAFB67", borderRadius:10}}/>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"rgba(84, 81, 74,0.8)", flex:1, marginLeft:2, borderRadius:10, borderWidth:1, borderColor:1}}>
                    <View style={{flex:awayRatio, backgroundColor:"#BAFB67", borderRadius:10}}/>
                    <View style={{flex:homeRatio}}/>
                </View>
                
                
            </View>
        </View>
    )
}

function Comment({commentID, commentDetails, deleteComment, setHide, likeComment, dislikeComment, editComment, navigation}){
    const [commentOptions, setCommentOptions] = useState(false)
    const [editText, setEditText] = useState(commentDetails["Text"])
    const [editing, setEditing] = useState(false)

    const onPressUser=()=>{
        navigation.navigate("OtherProfile", {UID:commentDetails["UID"]})
    }

    const edit = async()=>{
        if(editing==false){
            setEditing(true)
            setHide(true)
            setEditText(commentDetails["Text"])
        }else{
            if(editText.length==0){
                alert("Please enter a comment")
            }else{
                editComment({commentID, text:editText})
                setEditing(false)
                setHide(false)
            }
        }
    }

    const toggleOption = ()=>{
        if(commentOptions==true){
            setCommentOptions(false)
            setEditing(false)
            setHide(false)
        }else{
            setCommentOptions(true)
        }
    }
    
    return(
        <View 
        style={{flex:1,borderRadius:5, borderWidth:1, borderColor:"black", 
                margin: 8,marginLeft:15, marginRight:15, backgroundColor:"#F9F9F9", justifyContent:"space-between"}}
        >
             
            <View>
                <View style={{flexDirection:'row', margin:8, marginBottom:3, justifyContent: 'space-between'}}>
                    <Pressable style={{marginBottom:5, paddingLeft:0, paddingRight:8}} onPress={onPressUser}>
                        <Text style={{fontSize:15, color:"#636059"}}>{commentDetails["DisplayName"]}</Text>
                    </Pressable>

                    {commentDetails["ownUser"]&&
                        <Pressable onPress={toggleOption}>
                            <Icon
                            name="dots-vertical"
                            size={25}
                            color="#262626"
                            />
                        </Pressable>
                    }
                </View>

                <View style={{marginTop:0, marginBottom:0, marginLeft:14, marginRight:8}}>
                    {editing?
                        <TextInput 
                        style={{fontSize:18, color:"#636059"}}
                        placeholderTextColor="#A39D92"
                        value={editText}
                        placeholder={"Edit Comments"}
                        onChangeText={(text)=>setEditText(text)}
                        />
                    :
                        <Text style={{fontSize:18,color:"#636059"}}>{commentDetails["Text"]}</Text>
                    }
                </View>
            </View>

            <View style={{flexDirection:"row", justifyContent:"space-between", alignContent:"center", margin:8, marginBottom:3}}>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    
                    <Pressable style={{flexDirection:"row", alignItems:"center", marginRight:10}} onPress={()=>likeComment({commentID, liked:commentDetails["Liked"], disliked:commentDetails["Disliked"]})}>
                        <Text style={{fontSize:20,color:"#636059"}}>{commentDetails["NumLikes"]}</Text>
                    
                        <Icon
                        name="thumb-up-outline"
                        color={commentDetails["Liked"]?"#00e600":"black"}
                        size={30}
                        />
                    </Pressable>
                    
                    <Pressable style={{flexDirection:"row", alignItems:"center", marginRight:10}} onPress={()=>dislikeComment({commentID, liked:commentDetails["Liked"], disliked:commentDetails["Disliked"]})}>
                        <Text style={{fontSize:20,color:"#636059"}}>{commentDetails["NumDislikes"]}</Text>
                        <Icon
                        name="thumb-down-outline"
                        color={commentDetails["Disliked"]?"#e60000":"black"}
                        size={30}
                        />
                    </Pressable>
                </View>

            </View>

            { commentOptions &&   
                <View>
                    <Pressable 
                    style={{margin:10, borderWidth:1, borderColor:"black", backgroundColor:"#0f0"}}
                    onPress={edit}
                    >
                        <Text style={{fontSize:20, textAlign:"center", textAlignVertical:"center",color:"#636059"}}>
                            {editing?"Save":"Edit Comment"}
                        </Text>
                    </Pressable>
                    <Pressable 
                    style={{margin:10, borderWidth:1, borderColor:"black", backgroundColor:"#f00"}}
                    onPress={()=>deleteComment({commentID})}
                    >
                        <Text style={{fontSize:20, textAlign:"center", textAlignVertical:"center",color:"#636059"}}>
                            Delete Comment
                        </Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}

