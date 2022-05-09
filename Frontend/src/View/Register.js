import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState, useEffect} from "react"
import { View, Pressable, Text, StyleSheet, TextInput, Modal, ScrollView, FlatList, Image } from "react-native"
import SportsTabs from "./SportsTabs"
import {useDispatch, useSelector} from "react-redux"
import {getUser, registerAccount} from '../Controller/UserController'
import {getFavourites, setUpFavourites, addFavourites, deleteFavourites} from '../Controller/FavouritesController'
import { getSportsList, searchClub, searchLeague } from "../Controller/SportsController"
import SearchBar from "./SearchBar"
import Loading from './Loading'



export default function RegisterAccount({navigation}){
    const user = useSelector(state=>state.user)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [username, setUsername] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [created, setCreated] = useState(false)
    const [loaded, setLoaded] = useState(true)

    const dispatch = useDispatch()

    useEffect(()=>{
        if(user.status=="succeeded"){
            setLoaded(true)
            setCreated(true)
            setTimeout(() => {
                navigation.reset({
                    index:1,
                    routes:[{name:"SelectFavouriteLeague"}]
                })
            }, 500);
        }else if(user.status=="loggedIn"){
            AsyncStorage.setItem("UID", user.UID)
            dispatch(getUser({UID:user.UID}))
        }else if(user.status=="rejected"){
            AsyncStorage.removeItem("UID")
            setLoaded(true)
        }
    },[user])

    const register = async ()=>{
        setLoaded(false)
        dispatch(registerAccount({displayName, username, email, password, rePassword}))
    }

    return (
        <ScrollView>
            

            {/* Loading */}
            <Loading loaded={loaded}/>
            <Modal 
            visible = {created}
            transparent= {true}
            >
                    <View 
                    style={{
                    flex:1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor : "rgba(52, 52, 52, 0.6)"
                    }}
                    >
                        <View
                        style = {{ 
                        backgroundColor: "#BAFB67",
                        borderRadius: 20,
                        padding: 25,
                        alignItems: "center",
                        justifyContent:"center"
                        }}
                        >   
                            <Text>Account Created!</Text>
                        </View>
                    </View>
            </Modal>
            
            {/* header */}
            <View style={styles.header}>
                <Text style={[styles.headerText, {color:"#636059"}]}>Welcome</Text>
                <Text style={[styles.subHeaderText, {color:"#636059"}]}>Create your account to chat with others!</Text>
            </View>
            <View
            style = {styles.body}>
                <View>
                    <Text style={[styles.text, {color:"#636059"}]}>Email</Text>
                    <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#A39D92"
                    onChangeText={(value)=>setEmail(value)}
                    style = {[styles.input, {color:"#636059"}]}
                    />
                </View>

                <View>
                    <Text style={[styles.text, {color:"#636059"}]}>Username</Text>
                    <TextInput
                    placeholder="Enter your username"
                    placeholderTextColor="#A39D92"
                    onChangeText={(value)=>setUsername(value)}
                    style = {[styles.input, {color:"#636059"}]}
                    />
                </View>

                <View>
                    <Text style={[styles.text, {color:"#636059"}]}>Display Name</Text>
                    <TextInput
                    placeholder="Enter your display name"
                    placeholderTextColor="#A39D92"
                    onChangeText={(value)=>setDisplayName(value)}
                    style = {[styles.input, {color:"#636059"}]}
                    />
                </View>

                <View>
                    <Text style={[styles.text, {color:"#636059"}]}>Password</Text>
                    <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#A39D92"
                    secureTextEntry={true}
                    onChangeText={(value)=>setPassword(value)}
                    style = {[styles.input, {color:"#636059"}]}
                    />
                </View>

                <View>
                    <Text style={[styles.text, {color:"#636059"}]}>Confirm Password</Text>
                    <TextInput
                    placeholder="Re-enter your password"
                    placeholderTextColor="#A39D92"
                    secureTextEntry={true}
                    onChangeText={(value)=>setRePassword(value)}
                    style = {[styles.input, {color:"#636059"}]}
                    />
                </View>

                <Pressable 
                onPress={register}
                style={[({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#BAFB67' }), styles.registerButton]}
                >
                    <Text 
                    style={[styles.registerText, {color:"#636059"}]}
                    >
                        Register
                    </Text>

                </Pressable>

                <Pressable 
                onPress={()=>navigation.reset({index:0, routes:[{name:"Login"}]})}
                style={[({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#BAFB67' }), styles.registerButton]}
                >
                    <Text 
                    style={[styles.registerText, {color:"#636059"}]}
                    >
                        Already have an account? Login
                    </Text>

                </Pressable>
            </View>

        </ScrollView>
    )
}

export function SelectFavouriteLeague({navigation}){
    const favourites = useSelector(state=>state.favourites)
    const user = useSelector(state=>state.user)
    const dispatch = useDispatch()



    const onPressNext = () =>{
        const favourite_dict ={...favourites.favourites}
        dispatch(setUpFavourites({favourite_dict, UID:user.UID}))
        navigation.navigate("SelectFavouriteClub")
    }
    return (
        <SelectFavourites type = {"league"} onPressNext={onPressNext}/>
    )
}

export function SelectFavouriteClub({navigation}){
    const favourites = useSelector(state=>state.favourites)
    const user = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const onPressNext = () =>{
        const favourite_dict ={...favourites.favourites}
        dispatch(setUpFavourites({favourite_dict, UID:user.UID}))
        
        navigation.reset({
            index:0,
            routes:[{name:"Main"}]
        })
        
        
    }
    return (
        <SelectFavourites type={"club"} onPressNext={onPressNext}/>
    )
}

function SelectFavourites({type, onPressNext}){
    const favourites = useSelector(state=>state.favourites)
    const sportsList = useSelector(state=>state.sportsList)
    const user = useSelector(state=>state.user)
    const [searchData, setsearchData] = useState([])
    const [sportsID, setSportsID] = useState()
    const [loaded, setLoaded] = useState(false)
    const [typeFavs, setFavs] = useState()
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSportsList())
        dispatch(getFavourites({UID:user.UID}))
    },[])

    useEffect(()=>{
        if(sportsList.status=="succeeded"){
            setSportsID(Object.keys(sportsList.sportsList)[0])
        }
    }, [sportsList])

    useEffect(()=>{
        if(favourites.status=="succeeded" & sportsID!=undefined){
            setFavs(favourites.favourites[sportsID][type])
        }
    },[favourites, sportsID])

    useEffect(()=>{
        if(typeFavs!=undefined){
            setLoaded(true)
        }
    },[typeFavs])

    const search = async (text)=>{
        if(text.length<3){
            setsearchData()
        }else if (text.length>=3){
            let results
            if (type=="league"){
                results = await searchLeague({text, sportsID})
            }else{
                results = await searchClub({text,sportsID})
            }
            setsearchData(results)
        }
    }

    const changeSports=(id)=>{
        setLoaded(false)
        setSportsID(id)
    }

    const update = ({id,value})=>{
        if (typeFavs.hasOwnProperty(id)){
            dispatch(deleteFavourites({id, type, sportsID}))
        }else{
            dispatch(addFavourites({id, type, sportsID, value}))
        }
    }

    return (
        <View style={{flex:1}}>

            {/* Loading */}
            <Loading loaded={loaded}/>

            {/* header */}
            <View style={styles.headerFavourites}>
                <Text style={[styles.headerFavouritesText, {color:"#636059"}]}>Choose your favourite {type}</Text>
            </View>

            {/* Sports Tab */}
            <View style={{marginTop:10}}>
                <SportsTabs data = {sportsList.sportsList} curSportsID = {sportsID} onPress={changeSports}/>
            </View>
            {/* Search Bar */}
           <SearchBar search={search} sportsID={sportsID} placeholder={"Search " + type}/>

            {loaded&&
                <View style={{flex:1}}>
                    {(searchData==undefined)?
                        <FlatList
                        data = {Object.entries(sportsList.sportsList[sportsID]["popular"][type])}
                        renderItem={({item})=><Card data={item} updateFavourites={update} selected={typeFavs.hasOwnProperty(item[0])} search={false}/>}
                        keyExtractor = {(item)=>"Popular"+item[0]}
                        showsVerticalScrollIndicator={false}
                        numColumns= {2}
                        contentContainerStyle = {{margin:15, marginTop:5, paddingBottom:10}}
                        columnWrapperStyle={{justifyContent:"space-evenly"}}
                        />
                        :
                        <FlatList
                        data = {searchData}
                        renderItem={({item})=><Card data={item} updateFavourites={update} selected={typeFavs.hasOwnProperty(item["id"])} search={true}/>}
                        keyExtractor={(item)=>"Search"+item["id"]}
                        showsVerticalScrollIndicator={false}
                        numColumns= {2}
                        contentContainerStyle = {{margin:15, marginTop:5, paddingBottom:10}}
                        columnWrapperStyle={{justifyContent:"space-evenly"}}
                        extraData={typeFavs}
                        />
                    }

                    <Pressable 
                    style={{backgroundColor:"#BAFB67", margin: 15 ,marginTop:0, borderRadius:5, borderWidth:1, borderColor: "black", padding:10}}
                    onPress={()=>onPressNext()}
                    >
                        <Text 
                        style={[styles.registerText, {color:"#636059"}]}
                        >
                            Next
                        </Text>
                    </Pressable>

                </View> 
            } 
          
        </View>
    )
}

function Card({data, updateFavourites, selected, search}){
    let id, value
    if(search){
        id = data["id"]
        value ={name:data["name"], logo:data["logo"]}
    }else{
        id = data[0]
        value = data[1]
    }
    
    return(
        <Pressable 
        style={[{backgroundColor:(selected)?"#BAFB67":"#F9F9F9"}
            ,{margin:8,borderWidth:2, borderColor:"#075", borderRadius:10, padding:10,flexGrow:1, flex:0.5, alignItems:"center"}]}
        onPress={()=>updateFavourites({id, value})}
        >
            <Image
            style={{width:70, height:70}}
            source={{uri:value["logo"]}}
            />
            <Text style={{textAlign:"center", fontSize:18, color:"#636059"}}>{value["name"]}</Text>
        </Pressable>
    )

}



const styles = StyleSheet.create({
    header:{
        alignItems:"center",
        justifyContent: "center"
    },
    headerText:{
        fontSize: 40
    },
    subHeaderText:{
        fontSize: 20,
        textAlign:"center"
    },
    body:{
        margin:10,
    },
    input:{
      borderWidth:1,
      borderColor:'#555',
      borderRadius:10,
      backgroundColor: '#ffffff',
      fontSize: 15,
      margin:2
    },
    text:{
        fontSize: 15,
        margin: 5
    },
    registerButton:{
        marginTop: 20,
        backgroundColor: "#BAFB67",
        textAlign: "center",
        borderRadius: 5,
        borderColor:"black",
        borderWidth: 1,
        padding: 10
    },
    registerText:{
        fontSize:20,
        textAlign: "center",
    },


    headerFavourites:{
        paddingTop:40,
        alignItems:"center",
        justifyContent: "center"
    },
    headerFavouritesText:{
        fontSize: 24
    }, 
    searchBox: {
        flexDirection: 'row',
        alignItems: "center",
        borderWidth:2,
        borderColor:'#000',
        borderRadius:10,
        backgroundColor: '#ffffff',
        marginTop:15,
        margin: 10,
        marginBottom:0,
        paddingLeft:8,
    },
    searchText:{
        fontSize: 17,
        marginLeft:8
    },

})