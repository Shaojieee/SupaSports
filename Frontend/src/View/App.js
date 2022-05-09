/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {StyleSheet} from 'react-native';
 
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Provider } from 'react-redux';
import { store } from '../redux/configureStore';
import LoginPage from './Login';
import Profile from './Profile';
import Settings from './Settings';
import Forum, { EditPost, Post } from './Forum';
import News, { NewsArticle } from './News';
import Explore from './Explore';
import RegisterAccount, { SelectFavouriteClub, SelectFavouriteLeague } from './Register';
import EditFavs from './EditFavs';
import GameDetails from './GameDetails';
import TeamDetails from './TeamDetails';
import LeagueDetails from "./LeagueDetails";
import Favourites from './Favourites';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
 

 function Tabs() {

   return(
     <Tab.Navigator
     initialRouteName='Favourites'
     labeled = {true}
     shifting= {false}
     screenOptions={
       ({route}) => ({
         tabBarIcon:({focused, size, color}) => {
           let iconName;
           if(route.name === 'Favourites'){
             iconName = 'heart';
             size = focused ? 22 : 20;
             color=focused? '#000000':'#555';
           } else if(route.name ==='Profile'){
             iconName = 'laugh';
             size = focused ? 22 : 20;
             color=focused? '#000000':'#555';
           } else if(route.name ==='Explore'){
             iconName = 'search';
             size = focused ? 22 : 20;
             color=focused? '#000000':'#555';
           } else if(route.name ==='News'){
             iconName = 'newspaper';
             size = focused ? 22 : 20;
             color=focused? '#000000':'#555';
           } else if(route.name ==='Forum'){
             iconName = 'comments';
             size = focused ? 22 : 20;
             color=focused? '#000000':'#555';
           }
           return(
             <FontAwesome5 
             name={iconName}
             size={size}
             color={color}
             />
           )
          }, 
          headerShown : false, 
          unmountOnBlur : true,
          tabBarHideOnKeyboard : true
       })
     }
     
     >
       <Tab.Screen name='Favourites' component={Favourites}/>
       <Tab.Screen name='News' component={News}/>
       <Tab.Screen name='Explore' component={Explore}/>
       <Tab.Screen name='Forum' component={Forum}/>
       <Tab.Screen name='Profile' component={Profile} />
     </Tab.Navigator>
   )
 }
 
 
 function App(){

  return(
    <Provider store={store}>
      
      <NavigationContainer>
        
        <RootStack.Navigator
          initialRouteName='Login'
        >

          <RootStack.Screen
            name="Login"
            component={ LoginPage }
            options={{
              headerShown: false,
            }}
          /> 

          <RootStack.Screen
            name="Register"
            component={ RegisterAccount }
            options={{
              headerShown: false,
            }}
          />

          <RootStack.Screen
            name = 'SelectFavouriteLeague'
            component = {SelectFavouriteLeague}
            options={{
                headerShown:false,
            }}
          />

          <RootStack.Screen
            name = 'SelectFavouriteClub'
            component = {SelectFavouriteClub}
            options={{
                headerShown:false,
            }}
          />

          <RootStack.Screen
            name="Main"
            component={ Tabs }
            options={{
              headerShown: false,
            }}
          />

          <RootStack.Screen
            name="NewsArticle"
            component={ NewsArticle }
            options={{
              headerShown: false,
            }}
          />

          <RootStack.Screen
            name="EditFavs"
            component={ EditFavs }
            options={{
              headerShown: false,
            }}
          />

          <RootStack.Screen
            name = 'GameDetails'
            component = {GameDetails}
            options={{
                headerShown:false,
            }}
            getId = {({params})=>params.gameID}
          />

          <RootStack.Screen
            name = 'TeamDetails'
            component = {TeamDetails}
            options={{
                headerShown:false,
            }}
            getId = {({params})=>params.clubID}
          />

          <RootStack.Screen
            name = 'LeagueDetails'
            component = {LeagueDetails}
            options={{
                headerShown:false,
            }}
            getId = {({params})=>params.leagueID}
          />
          
          <RootStack.Screen
            name = 'Post'
            component = {Post}
            options={{
                headerShown:false,
            }}
          />

          <RootStack.Screen
            name = 'EditPost'
            component = {EditPost}
            options={{
                headerShown:false,
            }}
          />

          <RootStack.Screen
            name = 'OtherProfile'
            component = {Profile}
            options={{
                headerShown:false,
            }}
            getId={({params})=>params.UID}
          />

          <RootStack.Screen
            name = 'Settings'
            component = {Settings}
            options={{
                headerShown:false,
            }}
          />

        </RootStack.Navigator>

        
        

      </NavigationContainer>
    </Provider>
  )
 }
 
 const styles = StyleSheet.create({
   body: {
     flex: 1,
     backgroundColor: '#ffffff',
     flexDirection:'column',
     alignItems: 'center',
     justifyContent: 'center',
     //borderWidth:10,
     //borderColor:'#ff00ff',
     //borderRadius:10,
     //margin:30,
   },
   item: {
     backgroundColor:'#4ae1fa',
     justifyContent:'center',
     alignItems:'center',
   },
   text:{
     //color:'#000000',
     fontSize:40,
     fontWeight:'bold', 
     fontStyle:'italic',
     margin:10,
     textTransform:'uppercase'
   },
   button:{
     width: 200,
     height: 60,
   }
 });
 
 export default App;