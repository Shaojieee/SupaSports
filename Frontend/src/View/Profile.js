import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import Icon from "react-native-vector-icons/MaterialIcons"
import {follow, getUserFollowerFollowing, unfollow,getOtherUserDetails, deleteAccount,logout, getUser} from '../Controller/UserController';
import Loading from "./Loading"



export default function Profile({navigation, route}) {
  const curUser = useSelector(state=>state.user)
  const screenName = route.name
  const [user, setUser] = useState()
  const [ownUser, setOwnUser] = useState()
  const [loaded, setLoaded] = useState(false)
  const [follower, setFollower] = useState()
  const [following, setFollowing] = useState()
  const dispatch = useDispatch()


  useEffect(()=>{
    dispatch(getUser({UID:curUser["UID"]}))
    getData()
  },[])

  useEffect(()=>{
    if(ownUser==true && curUser.status=="succeeded"){
      setUser(curUser)
    }
  },[curUser])

  useEffect(()=>{
    if (user!=undefined & follower!=undefined & following!=undefined){
      setLoaded(true)
    }
  },[user, following, follower])


  useEffect(()=>{
    if(curUser.status=="succeeded" & ownUser==true){
      setUser(curUser)
      setLoaded(true)
    }
    if(curUser.status=="Not Loaded"){
      navigation.reset({
        index:0,
        routes:[{name:"Login"}]
      })
    }
  },[curUser, ownUser])

  const getData= async()=>{
    console.log(curUser["UID"])
    if (route["params"]!=undefined){
      const UID = route["params"]["UID"]
      
      getUserFollowerFollowing({UID}).then((followerFollowing)=>{
        setFollower(followerFollowing["follower"])
        setFollowing(followerFollowing["following"])
      })
      
      if(UID == curUser["UID"]){
        setOwnUser(true)
      }else{
        const result = await getOtherUserDetails({UID:curUser.UID, otherUID: UID})
        setUser(result)
        setOwnUser(false)
      }
    }else{
      const followerFollowing = await getUserFollowerFollowing({UID:curUser["UID"]})
      setFollower(followerFollowing["follower"])
      setFollowing(followerFollowing["following"])
      setOwnUser(true)
    }
  }

  const onPressFollow = ()=>{
    if (user["FollowedStatus"]==false){
      dispatch(follow({followeeUID:user["UID"], followerUID:curUser["UID"]}))
      const update = {}
      update[curUser["UID"]] = {"displayName":curUser["displayName"], "userName":curUser["userName"]}
      setFollower({...update,...follower})
      setUser({...user, NumFollowers: user["NumFollowers"]+1, FollowedStatus:true})
    }else{
      dispatch(unfollow({followeeUID:user["UID"], unFollowerUID:curUser["UID"]}))
      const update = {...follower}
      delete update[curUser["UID"]]
      setFollower({...update})
      setUser({...user, NumFollowers: user["NumFollowers"]-1, FollowedStatus:false})
    }
  }

  const logOut = async()=>{
    setLoaded(false)
    await logout()
  }

  const deleteAcc = async()=>{
    setLoaded(false)
    await deleteAccount({UID:curUser.UID})
    setLoaded(true)
  }
  
  return(
    <View style={{ flex: 1 }}>

      {/* Loading */}
      <Loading loaded={loaded}/>

      {(user!=undefined) &&
      <View style={{flex:1}}>
          {/* Header */}
          {(screenName=="OtherProfile")&&
            <View style={{flexDirection:"row"}}>
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
          }

          <Text style={[styles.name, {color:"#636059"}]}>{user["displayName"]}</Text>
          <Text style={[styles.username, {color:"#636059"}]}>@{user["userName"]}</Text>
    


          {(ownUser & screenName=="Profile")?
            <Pressable
            style={({ pressed }) => [{
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : "#F9F9F9"
            }, styles.button]}
            onPress={() => navigation.navigate("Settings")}
            >
              <Text style={{color:"#636059"}}>Settings</Text>
            </Pressable>
            :
            <View>
              {(!ownUser)&&
              <Pressable onPress={onPressFollow}
              style={({ pressed }) => [{ backgroundColor: pressed ? 'rgb(210, 230, 255)' : "#F9F9F9" },
              styles.button]}
              >
                <Text style={[styles.text, {color:"#003366"}]}>
                {user["FollowedStatus"] ? 'Unfollow' : 'Follow'}
                </Text>
              </Pressable>
              }
            </View>
          }
          

          <View style={styles.row}>
            <View style={styles.view}>
              <Text style={[styles.number, {color:"#636059"}]}>{user["NumFollowing"]}</Text>
            </View>
            <View style={styles.view}>
              <Text style={[styles.number, {color:"#636059"}]}>{user["NumFollowers"]}</Text>
            </View>
            
          </View>
          <View style={styles.row}>
            <View style={styles.view}>
              <Text style={[styles.text, {color:"#003366"}]}>FOLLOWING</Text>
            </View>
            <View style={styles.view}>
              <Text style={[styles.text, {color:"#003366"}]}>FOLLOWERS</Text>
            </View>
            
          </View>
          
          <View style={{margin:8, marginTop:10, height:150}}>
            <Text style={{fontSize:30, color:"#636059"}}>Followers</Text>
              {(follower!=undefined)&&
              <View style={{flex:1, borderWidth:1, borderColor:"black", borderRadius:5}}>
                <FlatList
                data={Object.entries(follower)}
                renderItem={({item})=><UserCard item={item} navigation={navigation}/>}
                keyExtractor={(item)=>item[0]}
                contentContainerStyle={{ flexGrow:1}}
                numColumns={2}
                />
                </View>
              }
          </View>

          <View style={{margin:8, marginTop:8, height:150}}>
            <Text style={{fontSize:30, color:"#636059"}}>Following</Text>
              {(following!=undefined)&&
              <View style={{flex:1,borderWidth:1, borderColor:"black", borderRadius:5}}>
                <FlatList
                data={Object.entries(following)}
                renderItem={({item})=><UserCard item={item} navigation={navigation}/>}
                keyExtractor={(item)=>item[0]}
                contentContainerStyle={{ flexGrow:1}}
                numColumns={2}
                />
              </View>
              }
          </View>

          {(screenName=="Profile") &&
          <View>
            <Pressable onPress={logOut}
            style={{margin:10,marginTop:15, marginBottom:0, 
              borderRadius:5, borderWidth:1, borderColor:"black", backgroundColor:"#e60000"}}
            >
              <Text style={{textAlign:"center", fontSize:20, padding:5,color:"white"}}>
                Log Out
              </Text>
            </Pressable>

            <Pressable onPress={deleteAcc}
            style={{margin:10, 
              borderRadius:5, borderWidth:1, borderColor:"black", backgroundColor:"#e60000"}}
            >
              <Text style={{textAlign:"center", fontSize:20, padding:5, color:"white"}}>
                Delete Account
              </Text>
            </Pressable>
          </View>
          }
      </View>
      }
    </View>
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
      style={{flexGrow:1,borderRadius:5, borderWidth:1, borderColor:"black", 
              margin: 8,marginLeft:15, marginRight:15, backgroundColor:"white", padding:8}}
      onPress={onPressUser}
      >
              <View style={{flexGrow:0}}>
                  <Text style={{fontSize:15, color:"#636059"}}>{data["displayName"]}</Text>  
                  <Text style={{fontSize:12, color:"#636059"}}>@{data["userName"]}</Text>
              </View>
          
      </Pressable>
  )
}



const styles = StyleSheet.create({
image: {
  width:100,
  height:100,
  position:'absolute',
  top:30,
  right:20,
},
posts:{
  fontSize:30,
  textDecorationLine:'underline',
  fontWeight: 'bold',
  marginTop:20,
  marginLeft:20
},
name:{
  flex:0,
  fontSize:30,
  fontWeight:'bold',
  marginTop:10,
  marginLeft:80,
  alignItems:'center'
},
username:{
  flex:0,
  fontSize:15,
  color:'black',
  marginLeft:90,
  alignItems:'center'
},
button: {
  width: 100,
  height: 20,
  alignItems:'center',
  borderWidth:1,
  borderColor:'#555',
  borderRadius:10,
  //position:'absolute',
  marginLeft:90,
  marginBottom:10
},
row:{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
view:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  borderBottomColor:'black',
},
text:{
  textAlign:'center',
  fontSize:15,
  
},
number:{
  fontWeight:'bold',
  fontSize:30,
  color:'black'
}

})
