import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { store } from "../redux/configureStore";

// BASE_URL is the endpoint for our backend
const BASE_URL = ""

const initialState = ()=>({
    status: "Not Loaded",
    favourites:{}
})


const favouritesSlice = createSlice({
    name:"Favourites",
    initialState:initialState(),

    reducers:{
        addFavourites:(state,action)=>{
            const {id,type,sportsID, value} = action.payload
            state.favourites[sportsID][type][id] = value
        },
        deleteFavourites:(state,action)=>{
            const {id, type, sportsID} = action.payload
            delete state.favourites[sportsID][type][id]
        },
        resetFavourites: (state)=>initialState()
    },

    extraReducers(builder){
        builder
            .addCase(getFavourites.fulfilled, (state,action)=>{
                const {results} = action.payload
                if (results["code"]==100){
                    state.status = "succeeded"
                    state.favourites = results["response"]
                }else{
                    state.status = "succeeded"
                    state.favourites = results["response"]
                    alert(results["error"])
                }
            })
            .addCase(getFavourites.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(getFavourites.rejected, (state,action)=>{
                const {results} = action.payload
                state.status = "succeeded"
                state.favourites = results["response"]
                alert(results["error"])
                
            })
            .addCase(updateFavourite.fulfilled, (state,action)=>{
                const {results, sportsID, type, id, data, inFavs} = action.payload
                if (results["code"]!=100){
                    if(inFavs==true){
                        alert(results["error"])
                        state.favourites[sportsID][type][id] = data
                    }else{
                        delete state.favourites[sportsID][type][id]
                    } 
                }
                state.status="succeeded"
            })
            .addCase(updateFavourite.pending, (state,action)=>{
                const {sportsID, type, id, data, inFavs} = action["meta"]["arg"]
                if(inFavs==false){
                    state.favourites[sportsID][type][id] = data
                }else{
                    delete state.favourites[sportsID][type][id]
                }
                
                state.status = "loading"
            })
            .addCase(updateFavourite.rejected, (state,action)=>{
                const {results, sportsID, type, id, data, inFavs} = action.payload
                if (results["code"]!=100){
                    if(inFavs==true){
                        alert(results["error"])
                        state.favourites[sportsID][type][id] = data
                    }else{
                        delete state.favourites[sportsID][type][id]
                    } 
                }
                state.status="succeeded"
            })
            .addCase(setUpFavourites.fulfilled, (state,action)=>{
                const {results} = action.payload
                if (results["code"]==100){
                    state.status="succeeded"
                }else{
                    state.status = "succeeded"
                    state.favourites = results["response"]
                    alert(results["error"])
                }
            })
            .addCase(setUpFavourites.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(setUpFavourites.rejected, (state,action)=>{
                const {results} = action.payload
                state.status = "succeeded"
                state.favourites = results["response"]
                alert(results["error"])
                
            })
    }
})



export const getFavourites = createAsyncThunk("favourites/getFavourites", async({}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/retrieveFavourites',
            params: {UID:store.getState().user.UID}
        }
        const results = await axios(options)
        return {results:results["data"]}
    }catch(error){
        console.log("Error in getFavourites()")
        
        return rejectWithValue({results:{"code":300, "response":{"0":{league:{},club:{}},"1":{league:{},club:{}},"2":{league:{},club:{}},"3":{league:{},club:{}}}, "error": "Error in retrieving favourites!"}})
    }
})

export const updateFavourite = createAsyncThunk("favourites/updateFavourite", async({sportsID, type, id, UID, data, inFavs}, {rejectWithValue})=>{
    try{
        let details = JSON.parse(JSON.stringify(data))
        
        if(details.hasOwnProperty("id")){
            delete details["id"]
        }
        if(details.hasOwnProperty("type")){
            delete details["type"]
        }
        const options = {
            method: 'POST',
            url: BASE_URL+'/updateFavourites',
            data: {sportsID,UID,type,id,data:details}
        }
        let results = await axios(options)
        return {sportsID, type, id, data, results:results["data"], inFavs}
    }catch(error){
        console.log("Error in updateFavourites()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error updating favourites!"},sportsID, type, id, data, inFavs})
    }

})

export const setUpFavourites = createAsyncThunk("favourites/setUpFavavourites", async({favourite_dict, UID}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/setUpFavourites',
            data: { favouriteDict: favourite_dict, UID}
        }
        const results = await axios(options)
        return {results:results["data"]}
    }catch(error){
        console.log("Error in setUpFavourites()")
        return rejectWithValue({results:{"code":300, "response":{"0":{league:{},club:{}},"1":{league:{},club:{}},"2":{league:{},club:{}},"3":{league:{},club:{}}},"error":"Error in setting up favourites"}})
    }
})

export const { resetFavourites, addFavourites, deleteFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer