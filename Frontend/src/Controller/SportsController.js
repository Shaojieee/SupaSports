import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// BASE_URL is the endpoint for our backend
const BASE_URL = ""

const initialState = ()=>({
    status: "Not Loaded",
    sportsList:{}
})


const sportsSlice = createSlice({
    name:"sportsList",
    initialState: initialState(),

    reducers:{
        resetSports: (state)=>initialState()
    },

    extraReducers(builder){
        builder
            .addCase(getSportsList.fulfilled, (state,action)=>{
                const {results} = action.payload
                if(results["code"]==100){
                    state.status = "succeeded"
                    state.sportsList = results["response"]
                }else{
                    state.status = "rejected"
                    alert(results["error"])
                } 
            })
            .addCase(getSportsList.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(getSportsList.rejected, (state,action)=>{
                const {results} = action.payload
                state.status = "rejected"
                alert(results["error"])
            })
    }
})



export const getSportsList = createAsyncThunk("sports/getSportsList", async(temp,{rejectWithValue})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/retrieveAllSportsID',
            params:{}
        }
        const results = await axios(options)
        return {results:results["data"]}
    }catch(error){
        console.log("Error in getSportsList()")
        return rejectWithValue({results:{"code":300, "error":"Error in retrieving sports data"}})
    }
    
})

export const searchLeagueAndClub = async({text, sportsID})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/searchLeagueAndClub',
            params: {text,sportsID}
        }
        const results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
        }
        return results["data"]["response"]
    }catch(error){
        console.log("Error in searchLeagueAndClub()")
        console.log(error)
        alert("Error in searching leagues and clubs")
        return []
    }
}

export const searchLeague = async({text,sportsID})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/searchLeague',
            params: {text,sportsID}
        }
        const results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
        }
        return results["data"]["response"]
    }catch(error){
        console.log("Error in searchLeague()")
        alert("Error in searching leagues")
        return []
    }
}

export const searchClub = async({text,sportsID})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/searchClub',
            params: {text,sportsID}
        }
        const results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
        }
        return results["data"]["response"]
    }catch(error){
        console.log("Error in searchClub()")
        alert("Error in searching club")
        return []
    }
}

export const { resetSports } = sportsSlice.actions;

export default sportsSlice.reducer