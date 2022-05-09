import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, TextInput, FlatList, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux'

import SportsTabs from "./SportsTabs"
import {getSportsList} from "../Controller/SportsController"
import { clickThumbsDownComment, clickThumbsDownPost, clickThumbsUpComment, clickThumbsUpPost, getPostComments, getPosts, newComment, newPost, deleteComment, deletePost, editComment } from "../Controller/PostController"
import SearchBar from "./SearchBar"
import Loading from './Loading';
import { searchUserProfile } from '../Controller/UserController';




export default function Forum({navigation, route}){
    const posts = useSelector(state=>state.posts)
    const sportsList = useSelector(state=>state.sportsList)
    const user = useSelector(state=>state.user)

    const [sportsID, setSportsID] = useState()
    const [loaded, setLoaded] = useState(false)
    const [searchData, setSearchData] = useState()
    const [refreshing, setRefreshing] = useState()
    

    const dispatch = useDispatch()

    useEffect(()=>{
        if(sportsList.status=="Not Loaded"){
            dispatch(getSportsList())
        }

    },[])

    useEffect(()=>{
        if (sportsList.status=="succeeded"){
            setSportsID(Object.keys(sportsList.sportsList)[0])
        }
    },[sportsList])

    useEffect(()=>{
        if (sportsID!=undefined & posts.posts.hasOwnProperty(sportsID)==false){
            dispatch(getPosts({sportsID, UID:user["UID"]}))
        }else if(sportsID!=undefined & posts.posts.hasOwnProperty(sportsID)==true){
            setLoaded(true)
        }
    },[sportsID, posts])

    useEffect(()=>{
        if (posts.status=="succeeded"){
            setLoaded(true)
            setRefreshing(false)
        }
    }, [posts])

    const changeSports = (id)=>{
        setLoaded(false)
        setSportsID(id)
    }

    const search = async(text)=>{
        if(text.length==0){
            setSearchData()
        }else{
            const {results} = await searchUserProfile({username:text})
            if (results["code"]==100){
                setSearchData(results["response"])
            }else{   
                alert(results["response"])        
            }
        }
    }

    const newPost = () =>{
        navigation.navigate("EditPost", {sportsID:sportsID})
    }

    const refresh = ()=>{
        setRefreshing(true)
        dispatch(getPosts({sportsID, UID:user["UID"]}))
    }

    return(
        <View style={{flex:1}}>

            {/* Loading */}
            <Loading loaded={loaded}/>

            <View style={{flexDirection: "row", justifyContent:"space-between", alignItems:"center", flexGrow:0}}>
                <Text style={[styles.header,{color:"#636059"}]}>Forum</Text>
                <Pressable
                style={({pressed})=>[{
                    backgroundColor: pressed? 'rgb(210, 230, 255)':"#F9F9F9"
                }, styles.button]}
                onPress={newPost}
                >
                    <Text style={{color:"#636059"}}>
                        Create New Post
                    </Text>

                </Pressable>
            </View>

            <View>
                {sportsList.status=="succeeded" && 
                    <SportsTabs data = {sportsList.sportsList} onPress = {changeSports} curSportsID={sportsID}/>
                }
            </View>

            <SearchBar search={search} sportsID={sportsID} placeholder="Search profiles"/>


            {loaded &&
                <View style={{flex:1}}>
                <FlatList
                data={searchData==undefined?Object.entries(posts.posts[sportsID]) : Object.entries(searchData)}
                renderItem={searchData==undefined?({item})=><PostCard item={item} navigation={navigation} sportsID={sportsID}/>:({item})=><UserCard item={item} navigation={navigation} />}
                contentContainerStyle={{paddingTop:5, paddingBottom:5}}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item)=>item[0]}
                refreshing= {refreshing}
                onRefresh={searchData==undefined?refresh:undefined}
                />
            </View>
            }
                
            
        </View>
    )
}

function PostCard({item, navigation, sportsID}){
    const data = item[1]
    const postID = item[0]
    const UID = useSelector(state=>state.user.UID)
    const posts = useSelector(state=>state.posts)
    const dispatch = useDispatch()
    const [disabled , setDisabled] = useState(false)

    useEffect(()=>{
        if(posts.status=="succeeded"){
            setDisabled(false)
        }
    },[posts])

    const onPressLike=()=>{
        setDisabled(true)
        dispatch(clickThumbsUpPost({postID:postID, sportsID:sportsID, UID, disliked: data["Disliked"], liked:data["Liked"]}))
    }

    const onPressDislike=()=>{
        setDisabled(true)
        dispatch(clickThumbsDownPost({postID:postID, sportsID:sportsID, UID, disliked: data["Disliked"], liked:data["Liked"]}))
    }

    const onPressComment=()=>{
        navigation.navigate("Post",{details: data, postID:postID, sportsID:sportsID, UID})
    }

    const onPressPost=()=>{
        navigation.navigate("Post",{details: data, postID:postID, sportsID: sportsID, UID})
    }

    const onPressUser=()=>{
        navigation.navigate("OtherProfile",{UID:data["UID"]})
    }


    return(
        <Pressable 
        style={{flex:1,borderRadius:5, borderWidth:1, borderColor:"black", 
                margin: 8,marginLeft:15, marginRight:15, backgroundColor:"#F9F9F9", justifyContent:"space-between", height:160}}
        onPress={onPressPost}
        >
                <View>
                    <View style={{flexDirection:'row', margin:8, marginBottom:3, justifyContent: 'space-between'}}>
                        <Pressable style={{marginBottom:5, paddingLeft:0, paddingRight:8}} onPress={onPressUser}>
                            <Text style={{fontSize:15, color:"#262626"}}>{data["DisplayName"]}</Text>
                        </Pressable>
                        <Text style={{fontSize:15, color:"#636059"}}>
                            {data["Date"]}
                        </Text>
                    </View>

                    <View style={{marginTop:0, marginBottom:0, marginLeft:14, marginRight:8}}>
                        <Text style={{fontSize:18,color:"#636059"}} numberOfLines={3} ellipsizeMode="tail">{data["Text"]}</Text>
                    </View>
                </View>

                <View style={{flexDirection:"row", justifyContent:"space-between", alignContent:"center", margin:8, marginBottom:3}}>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        
                        <Pressable 
                        style={{flexDirection:"row", alignItems:"center", marginRight:10}} 
                        onPress={onPressLike}
                        >
                            <Text style={{fontSize:20, color:"#636059"}}>{data["NumLikes"]}</Text>
                        
                            <Icon
                            name="thumb-up-off-alt"
                            color={data["Liked"]?"#00e600":"black"}
                            size={30}
                            />
                        </Pressable>
                        
                        <Pressable 
                        style={{flexDirection:"row", alignItems:"center", marginRight:10}} 
                        onPress={onPressDislike}
                        >
                            <Text style={{fontSize:20, color:"#636059"}}>{data["NumDislikes"]}</Text>
                            <Icon
                            name="thumb-down-off-alt"
                            color={data["Disliked"]?"#e60000":"black"}
                            size={30}
                            />
                        </Pressable>
                    </View>

                    <Pressable style={{flexDirection:"row", alignItems:"center"}} onPress={onPressComment}>
                        <Text style={{fontSize:20, color:"#636059"}}>{data["NumComments"]}</Text>
                        <Icon
                        name="comment"
                        size={30}
                        color="black"
                        />
                    </Pressable>

                    
                </View>
            
        </Pressable>
    )
}

function UserCard({item, navigation}){
    const data = item[1]
    const UID = item[0]

    const onPressUser=()=>{
        navigation.navigate("OtherProfile",{UID:UID})
    }


    return(
        <Pressable 
        style={{flex:1,borderRadius:5, borderWidth:1, borderColor:"black", 
                margin: 8,marginLeft:15, marginRight:15, backgroundColor:"white",padding:10}}
        onPress={onPressUser}
        >
                <View style={{flex:1}}>
                    <Text style={{fontSize:25, color:"#636059"}}>{data["Displayname"]}</Text>  
                    <Text style={{fontSize:23, color:"#636059"}}>@{data["Username"]}</Text>
                </View>
            
        </Pressable>
    )
}

export function Post({navigation, route}){
    const postID = route.params.postID
    const sportsID = route.params.sportsID
    const details = useSelector(state=>state.posts.posts[sportsID][postID])
    const posts = useSelector(state=>state.posts)
    const UID = useSelector(state=>state.user.UID)
    const [commentText, setCommentText] = useState("")
    const [hide, setHide] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [disabled, setDisabled] = useState(false)
    
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getPostComments({postID, sportsID, UID}))
    },[])

    useEffect(()=>{
        if(posts.status=="succeeded"){
            setRefreshing(false)
            setDisabled(false)
        }
    },[posts])


    const onPressLike=()=>{
        setDisabled(true)
        dispatch(clickThumbsUpPost({postID:postID, sportsID:sportsID, UID, disliked: details["Disliked"], liked:details["Liked"]}))
    }

    const onPressDislike=()=>{
        setDisabled(true)
        dispatch(clickThumbsDownPost({postID:postID, sportsID:sportsID, UID, disliked: details["Disliked"], liked:details["Liked"]}))
    }

    const onPressUser=()=>{
        navigation.navigate("OtherProfile",{UID:details["UID"]})
    }

    const onPressComment=()=>{
        if(commentText.length!=0){
            dispatch(newComment({text:commentText, postID, sportsID, UID}))
            setCommentText("")
        }else{
            alert("Please enter comment!")
        }
        
    }

    const edit=()=>{
        navigation.navigate("EditPost", {details:details, postID:postID, sportsID})
    }

    const delPost = ()=>{
        Alert.alert("Delete Post","Are you sure you want to delete this post?",
            [
                {text:"Yes", onPress:()=>{dispatch(deletePost({postID:postID, sportsID:sportsID, UID:UID}));setTimeout(() => {navigation.goBack()}, 500); }},
                {text:"No"}
            ])
    }

    const refresh = ()=>{
        setRefreshing(true)
        dispatch(getPostComments({postID, sportsID, UID}))
    }

    if (details!=undefined){
        return(
            <View style={{flex:1}}>

                    {/* Header */}
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
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
                    

                    {details["ownUser"]&&
                    <View style={{flexDirection:"row", alignItems:"center", marginRight:8}}>

                        {/* Edit Post */}
                        <Pressable 
                        style={({pressed})=>[{backgroundColor: pressed? 'rgb(210, 230, 255)':"#F9F9F9"}, styles.button]}
                        onPress={edit}
                        >
                            <Text style={{fontSize:15,color:"#636059"}}>Edit Post</Text>
                        </Pressable>

                        {/* Delete Post */}
                        <Pressable 
                        style={{marginLeft:5, marginRight:8}}
                        onPress={delPost}
                        >
                            <Icon
                            name="delete"
                            size={25}
                            color="#262626"
                            />
                        </Pressable>
                    </View>
                    }
                
                </View>

                {/* Post  */}
                <View>
                    
                        <View>
                        <View style={{flexDirection:'row', margin:8, marginBottom:3, justifyContent: 'space-between'}}>
                            <Pressable style={{marginBottom:5, paddingLeft:0, paddingRight:8}} onPress={onPressUser}>
                                <Text style={{fontSize:15,color:"#262626"}}>{details["DisplayName"]}</Text>
                            </Pressable>
                        </View>

                        <View style={{marginTop:0, marginBottom:8, marginLeft:14, marginRight:8}}>
                            <Text style={{fontSize:18,color:"#636059"}}>{details["Text"]}</Text>
                        </View>
                    </View>
                    

                    <View style={{flexDirection:"row", justifyContent:"space-between", alignContent:"center", margin:8, marginBottom:3}}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            
                            <Pressable style={{flexDirection:"row", alignItems:"center", marginRight:10}} onPress={onPressLike} disabled={disabled}>
                                <Text style={{fontSize:20, color:"#636059"}}>{details["NumLikes"]}</Text>
                            
                                <Icon
                                name="thumb-up-off-alt"
                                color={details["Liked"]?"#00e600":"black"}
                                size={30}
                                />
                            </Pressable>
                            
                            <Pressable style={{flexDirection:"row", alignItems:"center", marginRight:10}} onPress={onPressDislike} disabled={disabled}>
                                <Text style={{fontSize:20, color:"#636059"}}>{details["NumDislikes"]}</Text>
                                <Icon
                                name="thumb-down-off-alt"
                                color={details["Disliked"]?"#e60000":"black"}
                                size={30}
                                />
                            </Pressable>

                            
                        </View>

                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <Text style={{fontSize:20, color:"#636059"}}>{details["NumComments"]}</Text>
                            <Icon
                            name="comment"
                            size={30}
                            color="#262626"
                            />
                        </View>

                    </View>
                </View>
    
                <View style={{flex:1, paddingTop:10, paddingBottom:10}}>
                    {/* Comments */}
                    <FlatList
                    data={Object.entries(details["Comments"])}
                    renderItem={({item})=><Comment details={item[1]} commentID={item[0]} postID={postID} navigation={navigation} sportsID={sportsID} setHide={(value)=>setHide(value)}/>}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item)=>item[0]}
                    contentContainerStyle={{marginTop:10, paddingBottom:15}}
                    extraData={details["Comments"]}
                    refreshing={refreshing}
                    onRefresh={refresh}
                    />
                    
                    {/* Input Comments */}
                    {(!hide)&&
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center",
                                    marginLeft:10, marginRight:10, marginBottom:5,
                                    borderWidth:1, borderColor:"black", borderRadius:5,
                                    backgroundColor:"white"}}>
                            <TextInput 
                            placeholder='Enter Comment'
                            placeholderTextColor="#A39D92"
                            multiline={true}
                            style={{flex:1, color:"#636059"}}
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
                                color="#262626"
                                />
                            </Pressable>
                        </View>
                    }
                </View>
                
            </View>
        )
    }else{
        return(
            <View></View>
        )
    }
        
    
}

export function Comment({details, commentID, postID, sportsID, setHide, navigation}){
    const dispatch = useDispatch()
    const posts = useSelector(state=>state.posts)
    const UID = useSelector(state=>state.user.UID)
    const [commentOptions, setCommentOptions] = useState(false)
    const [editing, setEditing] = useState(false)
    const [editText, setEditText] = useState(details["Text"])
    const [disabled, setDisabled] = useState(false)

    useEffect(()=>{
        if(posts.status=="succeeded"){
            setDisabled(false)
        }
    },[posts])

    const onPressLike=()=>{
        setDisabled(true)
        dispatch(clickThumbsUpComment({postID:postID, commentID:commentID, UID, sportsID, disliked: details["Disliked"], liked:details["Liked"]}))
    }

    const onPressDislike=()=>{
        setDisabled(true)
        dispatch(clickThumbsDownComment({postID:postID, commentID:commentID, UID, sportsID, disliked: details["Disliked"], liked:details["Liked"]}))
    }

    const onPressUser=()=>{
        navigation.navigate("OtherProfile",{UID:details["UID"]})
    }

    const delComment=()=>{
        dispatch(deleteComment({postID:postID, commentID:commentID, sportsID: sportsID}))
        
    }

    const edit=()=>{
        if(editing==false){
            setEditText(details["Text"])
            setEditing(true)
            setHide(true)
        }else{
            if(editText.length==0){
                alert("Please enter a comment")
            }else{
                dispatch(editComment({postID,commentID,text:editText, sportsID, oldText: details["Text"]}))
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
                margin: 8,marginLeft:15, marginRight:15, backgroundColor:"white", justifyContent:"space-between"}}
        >
             
            <View>
                <View style={{flexDirection:'row', margin:8, marginBottom:3, justifyContent: 'space-between'}}>
                    <Pressable style={{marginBottom:5, paddingLeft:0, paddingRight:8}} onPress={onPressUser}>
                        <Text style={{fontSize:15,color:"#262626"}}>{details["DisplayName"]}</Text>
                    </Pressable>

                    {details["ownUser"]&&
                        <Pressable onPress={toggleOption}>
                            <Icon
                            name="more-vert"
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
                        value={editText}
                        placeholder={"Edit Comments"}
                        placeholderTextColor="#A39D92"
                        onChangeText={(text)=>setEditText(text)}
                        />
                    :
                        <Text style={{fontSize:18, color:"#636059"}}>{details["Text"]}</Text>
                    }
                </View>
            </View>

            <View style={{flexDirection:"row", justifyContent:"space-between", alignContent:"center", margin:8, marginBottom:3}}>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    
                    <Pressable style={{flexDirection:"row", alignItems:"center", marginRight:10}} onPress={onPressLike} disabled={disabled}>
                        <Text style={{fontSize:20, color:"#636059"}}>{details["NumLikes"]}</Text>
                    
                        <Icon
                        name="thumb-up-off-alt"
                        color={details["Liked"]?"#0f0":"black"}
                        size={30}
                        />
                    </Pressable>
                    
                    <Pressable style={{flexDirection:"row", alignItems:"center", marginRight:10}} onPress={onPressDislike} disabled={disabled}>
                        <Text style={{fontSize:20, color:"#636059"}}>{details["NumDislikes"]}</Text>
                        <Icon
                        name="thumb-down-off-alt"
                        color={details["Disliked"]?"#f00":"black"}
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
                        <Text style={{fontSize:20, textAlign:"center", textAlignVertical:"center", color:"white"}}>
                            {editing?"Save":"Edit Comment"}
                        </Text>
                    </Pressable>
                    <Pressable 
                    style={{margin:10, borderWidth:1, borderColor:"black", backgroundColor:"#f00"}}
                    onPress={delComment}
                    >
                        <Text style={{fontSize:20, textAlign:"center", textAlignVertical:"center", color:"white"}}>
                            Delete Comment
                        </Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}

export function EditPost({navigation, route}){
    
    const oldPost = route.params.hasOwnProperty("details")
    const UID = useSelector(state=>state.user.UID)
    let postID = null
    let details = null
    let sportsID = null
    if (oldPost){
        details = route.params.details
        postID = route.params.postID
        sportsID = route.params.sportsID
    }else{
        sportsID = route.params.sportsID
    }   

    const [text,setText] = useState()
    const dispatch = useDispatch()

    useEffect(()=>{
        if(oldPost){
            setText(details["Text"])
        }else{
            setText("")
        }
    },[])

    const submit = ()=>{
        if(text.length!=0){
            const oldText = (oldPost)?details["Text"]:""
            dispatch(newPost({text, oldPost, postID, sportsID, UID, oldText}))
            navigation.goBack()
        }else{
            alert("Please enter post!")
        }   
    }
    
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
                <Text style={{fontSize:25, textAlignVertical:"center", color:"#636059"}}>
                    {oldPost?"Edit post" : "Create New Post"}
                </Text>
            </View>

            <View style={{flex:1, margin:10}}>
                <TextInput 
                style = {{flexGrow:1, borderWidth:1, borderRadius:5, borderColor:"black", textAlignVertical:"top", fontSize:23, backgroundColor:"#F9F9F9", color:"#636059"}}
                defaultValue={oldPost?details["Text"]:""}
                placeholder = "Enter your post here"
                placeholderTextColor="#A39D92"
                onChangeText={(input)=>setText(input)}
                value= {text}
                multiline={true}
                />

                <Pressable 
                style={{borderWidth:1, borderRadius:5, borderColor:"black", margin:10, padding:10, backgroundColor:"#BAFB67"}}
                onPress={submit}
                >
                    <Text style={{textAlign:"center", textAlignVertical:"center", fontSize:18, color:"#636059"}}>
                        Confirm
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 40
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