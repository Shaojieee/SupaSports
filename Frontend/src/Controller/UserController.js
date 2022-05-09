import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {resetFavourites} from "./FavouritesController"
import {resetSports} from "./SportsController"
import {resetPosts} from "./PostController"
import auth from "@react-native-firebase/auth"
import {store} from "../redux/configureStore"

// BASE_URL is the endpoint for our backend
const BASE_URL = ""

const initialState = ()=>({
    UID:"",
    userName:"",
    displayName:"",
    NumFollowers:0,
    NumFollowing:0,
    status: "Not Loaded",
    error: ""
})

const userSlice = createSlice({
    name:"User",
    initialState:initialState(),

    reducers:{
        
        resetUser: (state)=>initialState()
    },

    extraReducers(builder){
        builder
            .addCase(getUser.fulfilled, (state,action)=>{
                const {results} = action.payload
                if(results["code"]==100){
                    state.status = "succeeded"
                    state.UID = results["response"]["UID"]
                    state.userName = results["response"]["Username"]
                    state.displayName = results["response"]["DisplayName"]
                    state.NumFollowers = results["response"]["NumFollowers"]
                    state.NumFollowing = results["response"]["NumFollowing"]
                }else{
                    state.status = "rejected"
                    alert(results["error"])
                } 
            })
            .addCase(getUser.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(getUser.rejected, (state,action)=>{
                state.status = "rejected"
                const {results} = action.payload
                alert(results["error"])
                
            })
            .addCase(follow.fulfilled, (state,action)=>{
                const {results} = action.payload
                state.status = "succeeded"
                if(results["code"]==100){
                    state.NumFollowing +=1
                }else{
                    alert(results["error"])
                }
            })
            .addCase(follow.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(follow.rejected, (state,action)=>{
                const {results} = action.payload
                state.status = "succeeded"
                alert(results["error"])
    
            })
            .addCase(unfollow.fulfilled, (state,action)=>{
                const {results} = action.payload
                state.status = "succeeded"
                if(results["code"]==100){
                    state.NumFollowing -=1
                }else{
                    alert(results["error"])
                }
            })
            .addCase(unfollow.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(unfollow.rejected, (state,action)=>{
                const {results} = action.payload
                state.status = "succeeded"
                alert(results["error"])
            })
            .addCase(changeDisplayName.fulfilled, (state,action)=>{
                state.status = "succeeded"
                const {results, displayName} = action.payload
                if(results["code"]==100){
                    state.displayName = displayName
                    alert("Successfully update display name")
                }else{
                    alert(results["error"])
                }
            })
            .addCase(changeDisplayName.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(changeDisplayName.rejected, (state,action)=>{
                state.status = "succeeded"
                const {results} = action.payload
                alert(results["error"])
            })
            .addCase(changeUsername.fulfilled, (state,action)=>{
                state.status = "succeeded"
                const {results, userName} = action.payload
                if(results["code"]==100){
                    state.userName = userName
                    alert("Successfully updated username")
                }else{
                    alert(results["error"])
                }
            })
            .addCase(changeUsername.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(changeUsername.rejected, (state,action)=>{
                state.status = "succeeded"
                const {results} = action.payload
                alert(results["error"])
            })
            .addCase(changeEmail.fulfilled, (state,action)=>{
                state.status = "succeeded"
                const {results} = action.payload
                if(results["code"]!=100){
                    alert(results["error"])
                }else{
                    alert("Sucessfully updated email")
                }
            })
            .addCase(changeEmail.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(changeEmail.rejected, (state,action)=>{
                state.status = "succeeded"
                const {results} = action.payload
                alert(results["error"])
            })
            .addCase(changePassword.fulfilled, (state,action)=>{
                state.status = "succeeded"
                const {results} = action.payload
                if(results["code"]!=100){
                    alert(results["error"])
                }else{
                    alert("Sucessfully updated password")
                }
            })
            .addCase(changePassword.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(changePassword.rejected, (state,action)=>{
                state.status = "succeeded"
                const {results} = action.payload
                alert(results["error"])
            })
            .addCase(login.fulfilled, (state,action)=>{
                const {results} = action.payload
                if(results["code"]!=100){
                    state.status = "rejected"
                    alert(results["error"])
                }else{
                    state.status = "loggedIn"
                    state.UID=results["response"]
                }
            })
            .addCase(login.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(login.rejected, (state,action)=>{
                state.status = "rejected"
                const {results} = action.payload
                alert(results["error"])
            })
            .addCase(registerAccount.fulfilled, (state,action)=>{
                const {results} = action.payload
                if(results["code"]!=100){
                    state.status = "rejected"
                    alert(results["error"])
                }else{
                    state.UID=results["response"]
                    state.status = "loggedIn"
                }
            })
            .addCase(registerAccount.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(registerAccount.rejected, (state,action)=>{
                state.status = "rejected"
                const {results} = action.payload
                alert(results["error"])
            })
            .addCase(storePushNotifToken.fulfilled, (state,action)=>{
                const {results, token} = action.payload
                if(results["code"]==100){
                    state.token = token["token"]
                }
            })
            .addCase(storePushNotifToken.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(storePushNotifToken.rejected, (state,action)=>{
                state.status = "rejected"
            })
    }
})



export const getUser = createAsyncThunk("user/getUser", async({UID}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/getUserDetails',
            params: {UID}
        }
        const results = await axios(options)
        return {results:results["data"]}
    }catch(error){
        console.log("Error in getUser()")
        console.log(error)
        return rejectWithValue({results:{"code":300,"error":'Error getting user details'}})
    }
})

export const changeDisplayName = createAsyncThunk("user/updateDisplayName", async({displayName, UID},{rejectWithValue})=>{
    if (displayName==""){
        return {results:{"code":200,"error":"Please enter a valid display name"}}
    }
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/changeDisplayname',
            data: {UID, newDisplayname:displayName}
        }
        const results = await axios(options)
        return {results:results["data"], displayName}
    }catch(error){
        console.log("Error in updateDisplayName()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error in updating display name"}})
    }

})

export const changeUsername = createAsyncThunk("user/updateUsername", async({userName, UID},{rejectWithValue})=>{
    if (userName==""){
        return {results:{"code":200,"error":"Please enter a valid username"}}
    }
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/changeUsername',
            data: {UID, newUsername:userName}
        }
        const results = await axios(options)
        return {results:results["data"], userName}
    }catch(error){
        console.log("Error in updateUsername()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error in updating username"}})
    }

})

export const changeEmail = createAsyncThunk("user/updateEmail", async({email, UID},{rejectWithValue})=>{
    if (email==""){
        return {results:{"code":200,"error":"Please enter a valid email"}}
    }
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/changeEmail',
            data: {UID, newEmail:email}
        }
        const results = await axios(options)
        return {results:results["data"]}
    }catch(error){
        console.log("Error in updateEmail()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error in updating email"}})
    }

})

export const changePassword = createAsyncThunk("user/updatePassword", async({password, rePassword, UID},{rejectWithValue})=>{
    if (password=="" | rePassword==""){
        return {results:{"code":200,"error":"Please enter a valid password"}}
    }
    if (password!=rePassword){
        return {results:{"code":200,"error":"Please make sure both passwords match"}}
    }
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/changePassword',
            data: {UID, newPassword:password}
        }
        const results = await axios(options)
        return {results:results["data"]}
    }catch(error){
        console.log("Error in updatePassword()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error in updating password"}})
    }

})

export const follow = createAsyncThunk("user/follow", async({followerUID, followeeUID}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/followUser',
            data: {followeeUID, followerUID}
        }
        const results = await axios(options)
        return  {results:results["data"] }
    }catch(error){
        console.log("Error in follow()")
        return rejectWithValue({results:{"code":300, "error":"Error in following user"}})
    }
    
})

export const unfollow = createAsyncThunk("user/unfollow", async({unFollowerUID, followeeUID}, {rejectWithValue})=>{

    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/unFollowUser',
            data: {followeeUID, unFollowerUID}
        }
        const results = await axios(options)
        return {results:results["data"]} 
    }catch(error){
        console.log("Error in unfollow()")
        console.log(error)
        return rejectWithValue({results: {"code":300, "error":"Error in unfollowing user"}})
    }

})

export const registerAccount = createAsyncThunk("user/registerAccount", async({displayName,username,email,password, rePassword}, {rejectWithValue})=>{
    try{
        if(password!=rePassword){
            return {results:{"code":300, "error":"Please ensure the passwords entered are the same"}}
        }
        const options = {
            method: 'POST',
            url: BASE_URL+'/register',
            data: {displayName,username,email,password}
        }
        const results = await axios(options)
        return {results:results["data"]}
    }catch(error){
        console.log("Error in registerAccount()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error in registering account"}})
    }
})

export const searchUserProfile = async ({username})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/searchUserProfile',
            params: {username}
        }
        const results = await axios(options)
        return  {results: results["data"]}
    }catch(error){
        console.log("Error in searchUserProfile()")
    }
}

export const login = createAsyncThunk("user/login", async ({email, password}, {rejectWithValue})=>{
    try{
      if(email.length>0 & password.length>0){
        const userCredentials = await auth().signInWithEmailAndPassword(email,password);
        await AsyncStorage.setItem("UID", userCredentials.user.uid)
        return {results:{"code":100, "response": userCredentials.user.uid}}
      }else if(email.length==0 & password.length==0){
          return {results:{"code":300,"error":"Please enter an email and password"}}
      }else if(password.length==0){
        return {results:{"code":300,"error":"Please enter a password"}}
      }else if(email.length==0){
        return {results:{"code":300,"error":"Please enter an email "}}
      }
    }catch(error){
      var errorCode= error.code
      console.log(error)
      if (errorCode === 'auth/user-disabled'){
          return rejectWithValue({results:{"code":300,"error":"Account has been deleted"}})
      }else if(errorCode === 'auth/wrong-password'){
            return rejectWithValue({results:{"code":300,"error":"Wrong password"}})
      }else if(errorCode === 'auth/invalid-email'){
            return rejectWithValue({results:{"code":300,"error":"Invalid Email"}})
      }else{
            return rejectWithValue({results:{"code":300,"error":"Error logging in"}})
      }
    }
})

export const storePushNotifToken = createAsyncThunk("user/storePushNotifToken", async({token,UID})=>{

    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/storePushNotifToken',
            data: {token, UID}
        }
        
        const results = await axios(options)
        return {results:results["data"], token} 
    }catch(error){
        console.log("Error in storePushNotifToken()")
        console.log(error)
    }

})

export const deleteAccount = async({UID})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/deleteAccount',
            data: {UID}
        }
        let results = await axios(options)
        if (results["data"]["code"]==100){
            await AsyncStorage.removeItem("UID")
            store.dispatch(resetFavourites())
            store.dispatch(resetSports())
            store.dispatch(resetPosts())
            store.dispatch(resetUser())
        }else{
            alert(results["data"]["error"])
        }
    }catch(error){
        console.log("Error in deleteAccount()")
        alert("Error in deleting account")
    }
}

export const logout = async()=>{
    await AsyncStorage.removeItem("UID")
    store.dispatch(resetUser())
    store.dispatch(resetFavourites())
    store.dispatch(resetSports())
    store.dispatch(resetPosts())
}

export const getOtherUserDetails = async({UID, otherUID})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/getOtherUserDetails',
            params: {UID, otherUID}
        }
        let results = await axios(options)
        if(results["data"]["code"]==100){
            return results["data"]["response"]
        }else{
            alert(results["data"]["error"])
            console.log(results["data"]["response"])
            return results["data"]["response"]
        } 
    }catch(error){
        console.log("Error in getOtherUSerDetails()")
        alert("Error in getting user details")
        return {UID:otherUID,
            displayName: "Error",
            userName: "Error",
            NumFollowers:0,
            NumFollowing:0,
            FollowedStatus:false}
    }
}

export const getUserFollowerFollowing = async ({UID})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/getUserFollowerFollowing',
            params: {UID}
        }
        let results = await axios(options)
        if(results["data"]["code"]==100){
            return results["data"]["response"]
        }else{
            console.log("Error")
            alert(results["data"]["error"])
            return results['data']["response"]
        } 
    }catch(error){
        console.log("Error in getUserFollowerFollowing()")
        alert("Error in getting user followers and following")
        return {"following":{}, "follower":{}}
    }
}


export const {resetUser} = userSlice.actions;
export default userSlice.reducer