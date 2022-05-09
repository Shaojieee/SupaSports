import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './Loading';
import { changeDisplayName, changeEmail, changePassword, changeUsername } from '../Controller/UserController';


export default function Settings({navigation}){
    const user = useSelector(state=>state.user)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [userName, setUserName] = useState("")
    const [loaded, setLoaded] = useState(true)

    const dispatch = useDispatch()

    useEffect(()=>{
      if(user.status=="succeeded"){
        setLoaded(true)
      }
    },[user])

    const updateDisplayName = ()=>{
      setLoaded(false)
      dispatch(changeDisplayName({displayName, UID:user.UID}))
      setDisplayName("")
    }

    const updateUsername = ()=>{
      setLoaded(false)
      dispatch(changeUsername({userName, UID:user.UID}))
      setUserName("")
    }

    const updateEmail = ()=>{
      setLoaded(false)
      dispatch(changeEmail({email, UID:user.UID}))
      setEmail("")
    }

    const updatePassword = ()=>{
      setLoaded(false)
      dispatch(changePassword({password, rePassword, UID:user.UID}))
      setPassword("")
      setRePassword("")
    }







    return(
        <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator={false}>

            <Loading loaded={loaded}/>

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

        <View style={styles.row}>
          <View style={styles.view}> 
            <Text style={[styles.number, {color:"#636059"}]}>Display Name</Text>
          </View>
            <TextInput 
            style={[styles.input, {color:"#636059"}]}
            placeholderTextColor="#A39D92"
            placeholder='Enter new display name'
            onChangeText={(value)=>setDisplayName(value)}
            value={displayName}
            />
        </View>

        <Pressable onPress={updateDisplayName}
          style={[({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#BAFB67' }),
        styles.button]}
          >
          <Text style={[styles.text, {color:"#636059"}]}>
            Update display name
          </Text>
        </Pressable>
  
      <View style={styles.row}>
        <View style={styles.view}>
          <Text style={[styles.number, {color:"#636059"}]}>Username</Text>
        </View>
        <TextInput 
            style={[styles.input, {color:"#636059"}]}
            placeholderTextColor="#A39D92"
            placeholder='Enter new username'
            onChangeText={(value)=>setUserName(value)}
            value={userName}
            />
      </View>

      <Pressable onPress={updateUsername}
        style={[({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#BAFB67' }),
      styles.button]}
        >
        <Text style={[styles.text, {color:"#636059"}]}>
          Update username
        </Text>
      </Pressable>

      <View style={styles.row}>
        <View style={styles.view}>
          <Text style={[styles.number, {color:"#636059"}]}>Email</Text>
        </View>
        <TextInput 
            style={[styles.input, {color:"#636059"}]}
            placeholderTextColor="#A39D92"
            placeholder='Enter new email'
            onChangeText={(value)=>setEmail(value)}
            value={email}
            />
      </View>

      <Pressable onPress={updateEmail}
        style={[({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#BAFB67' }),
      styles.button]}
        >
        <Text style={[styles.text, {color:"#636059"}]}>
          Update email
        </Text>
      </Pressable>

      <View style={styles.row}>
        <View style={styles.view}>
          <Text style={[styles.number, {color:"#636059"}]}>Password</Text>
        </View>
        <TextInput 
            style={[styles.input, {color:"#636059"}]}
            placeholderTextColor="#A39D92"
            placeholder='Enter new password'
            secureTextEntry={true}
            onChangeText = {(value)=>setPassword(value)}
            value={password}
            />
      </View>

      
      <View style={styles.row}>
        <View style={styles.view}>
          <Text style={[styles.number, {color:"#636059"}]}>Re-enter password</Text>
        </View>
        <TextInput 
            style={[styles.input, {color:"#636059"}]}
            placeholder='Enter new password'
            placeholderTextColor="#A39D92"
            secureTextEntry={true}
            onChangeText = {(value)=>setRePassword(value)}
            value={rePassword}
            />
      </View>

      <Pressable onPress={updatePassword}
          style={[({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#BAFB67' }),
        styles.button]}
          >
        <Text style={[styles.text, {color:"#636059"}]}>
          Update Password
        </Text>
        </Pressable>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
row:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin:5,
    marginRight:8,
    marginLeft:8
},
input: {
    flex:2.5,
    borderWidth:1,
    borderColor:'#555',
    borderRadius:10,
    textAlign: 'center',
    fontSize: 20,
    marginLeft:10,
    backgroundColor:"white"
  },
number:{
    fontSize:20,
    fontWeight:'bold',
    textAlignVertical:'center',
    textAlign:"right",
    color:'#000000',
},
text:{
    fontWeight:'bold',
    fontSize:20,
    textAlign:'center',
    textAlignVertical:"center",
    color:'#000000'
},
button:{
    alignItems:'center',
    borderWidth:1,
    borderColor:'#555',
    borderRadius:10,
    margin:10,
    padding:5,
    backgroundColor:"#BAFB67"
},
view:{
  alignItems:"flex-end",
  flex:1
}

})
