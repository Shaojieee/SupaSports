
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput
} from 'react-native';
import { getUser, login } from '../Controller/UserController';
import { useDispatch, useSelector } from 'react-redux';
import Loading from "./Loading"

export default function LoginPage({navigation}){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector(state=>state.user)

    useEffect(()=>{
      getData()
    },[])

    useEffect(()=>{
      if(user.status=="loggedIn"){
        dispatch(getUser({UID:user.UID}))
        
      }else if(user.status=="rejected"){
        AsyncStorage.removeItem("UID")
        setLoaded(true)
      }else if(user.status=="succeeded"){
        navigation.reset({
          index:0,
          routes:[{name:"Main"}]
        })
      }
    },[user])

    const getData = () => {
      AsyncStorage.getItem("UID")
        .then(UID=>{
          if (UID){
            dispatch(getUser({UID}))
          }else{
            setLoaded(true)
          }
        })
    
    }

    const onPressLogin = async ()=>{
      setLoaded(false)
      dispatch(login({email,password}))
    }

    const onPressRegister = ()=>{
      navigation.reset({
        index:0,
        routes:[{name:"Register"}]
      })
    }


    return(
        <View style={styles.body}>

          {/* Loading */}
          <Loading loaded={loaded}/>

          {loaded&&
            <View>
              <Text style={[styles.text, {marginBottom:40,fontSize:50, color:"#636059", fontStyle:"italic"}]}>
                SupaSports
              </Text>

              <TextInput 
              style={[styles.input, {color:"#636059"}]}
              placeholderTextColor="#A39D92"
              placeholder='Enter your email'
              onChangeText={(value)=>setEmail(value)}
              value={email}
              />

              <TextInput 
              style={[styles.input, {color:"#636059"}]}
              placeholderTextColor="#A39D92"
              placeholder='Enter your password'
              onChangeText={(value)=>setPassword(value)}
              value={password}
              secureTextEntry={true}
              />

              <Pressable onPress={onPressLogin}
                style={[({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#BAFB67' }),
              styles.button]}
                >
              <Text style={[styles.text, {color:"#636059"}]}>
                Log In
              </Text>
              </Pressable>

              <Pressable onPress={onPressRegister}
                style={[({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#BAFB67' }),
              styles.button]}
                >
              <Text style={[styles.text, {color:"#636059"}]}>
                Register
              </Text>
              </Pressable>
            </View>
          }
          
      </View>
    )
  }

  const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#f0f4fd',
    },
    text: {
        textAlign:'center',
        fontSize: 30,
        fontWeight: 'bold',
        margin: 10,
    },
    input: {
      width: 300,
      borderWidth:1,
      borderColor:'#555',
      borderRadius:10,
      backgroundColor: '#ffffff',
      textAlign: 'center',
      fontSize: 20,
      marginTop: 30,
    },
    button: {
      backgroundColor:'#BAFB67',
      alignItems:'center',
      borderRadius:10,
      marginTop: 50,
    }
})
