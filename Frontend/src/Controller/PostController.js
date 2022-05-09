import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import * as RNLocalize from "react-native-localize";

// BASE_URL is the endpoint for our backend
const BASE_URL = ""

const initialState = ()=>({
    status: "Not Loaded",
    posts:{}
})


const postSlice = createSlice({
    name:"Posts",
    initialState:initialState(),

    reducers:{
        resetPosts: (state)=>initialState()
    },

    extraReducers(builder){
        builder
            .addCase(getPosts.fulfilled, (state,action)=>{
                const {sportsID, results} = action.payload
                if (results["code"]==100){
                    state.status = "succeeded"
                    state.posts[sportsID] = results["response"]
                }else{
                    alert(results["error"])
                    state.posts[sportsID] = results["response"]
                }
            })
            .addCase(getPosts.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(getPosts.rejected, (state,action)=>{
                const {sportsID, results} = action.payload
                state.status = "succeeded"
                alert(results["error"])
                state.posts[sportsID] = results["response"]
                
            })
            .addCase(getPostComments.fulfilled, (state,action)=>{
                state.status = "succeeded"
                const {sportsID, postID, results} = action.payload
                if(results["code"]==100){
                    state.posts[sportsID][postID]["Comments"] = results["response"]
                }else{
                    alert(results["error"])
                    state.posts[sportsID][postID]["Comments"] = results["response"]
                }
                
            })
            .addCase(getPostComments.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(getPostComments.rejected, (state,action)=>{
                state.status = "succeeded"
                const {sportsID, postID, results} = action.payload
                state.posts[sportsID][postID]["Comments"] = results["response"]
                alert(results["error"])
            })
            .addCase(newPost.pending, (state,action)=>{
                const { postID, sportsID, oldPost,text } = action["meta"]["arg"]
                if(oldPost){
                    state.posts[sportsID][postID]["Text"] = text
                }
                state.status = "loading"
            })
            .addCase(newPost.fulfilled, (state,action)=>{
                const { postID, sportsID, results, oldPost, oldText } = action.payload
                if (!oldPost){
                    if(results["code"]==100){
                        state.posts[sportsID] = {...results["response"],...state.posts[sportsID]}
                    }else{
                        alert(results["error"])
                    }
                }else{
                    if (results["code"]!=100){
                        alert(results["error"])
                        state.posts[sportsID][postID]["Text"] = oldText
                        
                    }
                }
                state.status = "succeeded"
            })
            .addCase(newPost.rejected, (state,action)=>{
                const {results, oldPost, oldText, postID, sportsID} = action.payload
                alert(results["error"])
                if(oldPost){
                    state.posts[sportsID][postID]["Text"] = oldText
                }
                state.status= "succeeded"

            })
            .addCase(newComment.pending, (state,action)=>{
                state.status = "loading"
            })
            .addCase(newComment.fulfilled, (state,action)=>{
                const {sportsID,postID,results} = action.payload
                if(results["code"]==100){
                    state.status = "succeeded"
                    state.posts[sportsID][postID]["Comments"] = {...results["response"], ...state.posts[sportsID][postID]["Comments"]}
                }else{
                    alert(results["error"])
                }
            })
            .addCase(newComment.rejected, (state,action)=>{
                const {results} = action.payload
                alert(results["error"])
                
            })
            .addCase(clickThumbsUpPost.pending, (state,action)=>{
                state.status = "loading"
                const {postID, sportsID, disliked, liked} = action["meta"]["arg"]
                if (liked==true){
                    state.posts[sportsID][postID]["Liked"]=false
                    state.posts[sportsID][postID]["NumLikes"] -= 1
                }else if (disliked==true){
                    state.posts[sportsID][postID]["Disliked"]=false
                    state.posts[sportsID][postID]["NumDislikes"] -= 1
                    state.posts[sportsID][postID]["Liked"]=true
                    state.posts[sportsID][postID]["NumLikes"] += 1
                }else{
                    state.posts[sportsID][postID]["Liked"] = true
                    state.posts[sportsID][postID]["NumLikes"] += 1
                }
            })
            .addCase(clickThumbsUpPost.fulfilled, (state,action)=>{
                const {results, sportsID, postID, liked, disliked} = action.payload
                state.status = "succeeded"
                if(results["code"]!=100){
                    alert(results["error"])
                    if (liked==true){
                        state.posts[sportsID][postID]["Liked"]=true
                        state.posts[sportsID][postID]["NumLikes"] += 1
                    }else if (disliked==true){
                        state.posts[sportsID][postID]["Disliked"]=true
                        state.posts[sportsID][postID]["NumDislikes"] += 1
                        state.posts[sportsID][postID]["Liked"]=false
                        state.posts[sportsID][postID]["NumLikes"] -= 1
                    }else{
                        state.posts[sportsID][postID]["Liked"] = false
                        state.posts[sportsID][postID]["NumLikes"] -= 1
                    }
                }
            })
            .addCase(clickThumbsUpPost.rejected, (state,action)=>{
                const {results, sportsID, postID, liked, disliked} = action.payload
                state.status = "succeeded"
                if(results["code"]!=100){
                    alert(results["error"])
                    if (liked==true){
                        state.posts[sportsID][postID]["Liked"]=true
                        state.posts[sportsID][postID]["NumLikes"] += 1
                    }else if (disliked==true){
                        state.posts[sportsID][postID]["Disliked"]=true
                        state.posts[sportsID][postID]["NumDislikes"] += 1
                        state.posts[sportsID][postID]["Liked"]=false
                        state.posts[sportsID][postID]["NumLikes"] -= 1
                    }else{
                        state.posts[sportsID][postID]["Liked"] = false
                        state.posts[sportsID][postID]["NumLikes"] -= 1
                    }
                }
            })
            .addCase(clickThumbsDownPost.pending, (state,action)=>{
                state.status = "loading"
                const {sportsID, postID, disliked, liked} = action["meta"]["arg"]
                if (liked==true){
                    state.posts[sportsID][postID]["Liked"]=false
                    state.posts[sportsID][postID]["NumLikes"] -= 1
                    state.posts[sportsID][postID]["Disliked"]=true
                    state.posts[sportsID][postID]["NumDislikes"] += 1
                }else if (disliked==true){
                    state.posts[sportsID][postID]["Disliked"]=false
                    state.posts[sportsID][postID]["NumDislikes"] -= 1
                }else{
                    state.posts[sportsID][postID]["Disliked"] = true
                    state.posts[sportsID][postID]["NumDislikes"] += 1
                }
            })
            .addCase(clickThumbsDownPost.fulfilled, (state,action)=>{
                const {results, sportsID, postID, liked, disliked} = action.payload
                state.status = "succeeded"
                if(results["code"]!=100){
                    alert(results["error"])
                    if (liked==true){
                        state.posts[sportsID][postID]["Liked"]=true
                        state.posts[sportsID][postID]["NumLikes"] += 1
                        state.posts[sportsID][postID]["Disliked"]=false
                        state.posts[sportsID][postID]["NumDislikes"] -= 1
                    }else if (disliked==true){
                        state.posts[sportsID][postID]["Disliked"]=true
                        state.posts[sportsID][postID]["NumDislikes"] += 1
                    }else{
                        state.posts[sportsID][postID]["Disliked"] = false
                        state.posts[sportsID][postID]["NumDislikes"] -= 1
                    }
                }
            })
            .addCase(clickThumbsDownPost.rejected, (state,action)=>{
                state.status = "succeeded"
                const {results, sportsID, postID, liked, disliked} = action.payload
                state.status = "succeeded"
                if(results["code"]!=100){
                    alert(results["error"])
                    if (liked==true){
                        state.posts[sportsID][postID]["Liked"]=true
                        state.posts[sportsID][postID]["NumLikes"] += 1
                        state.posts[sportsID][postID]["Disliked"]=false
                        state.posts[sportsID][postID]["NumDislikes"] -= 1
                    }else if (disliked==true){
                        state.posts[sportsID][postID]["Disliked"]=true
                        state.posts[sportsID][postID]["NumDislikes"] += 1
                    }else{
                        state.posts[sportsID][postID]["Disliked"] = false
                        state.posts[sportsID][postID]["NumDislikes"] -= 1
                    }
                }
                
            })
            .addCase(clickThumbsUpComment.pending, (state,action)=>{
                state.status = "loading"
                const {sportsID, postID, commentID, disliked, liked} = action["meta"]["arg"]
                if (liked==true){
                    state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=false
                    state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] -=1
                }else if (disliked==true){
                    state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=false
                    state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] -=1
                    state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=true
                    state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] +=1
                }else{
                    state.posts[sportsID][postID]["Comments"][commentID]["Liked"] = true
                    state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] +=1
                }
            })
            .addCase(clickThumbsUpComment.fulfilled, (state,action)=>{
                const {results, sportsID, postID, commentID, liked, disliked} = action.payload
                state.status = "succeeded"
                if(results["code"]!=100){
                    alert(results["error"])
                    if (liked==true){
                        state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] +=1
                    }else if (disliked==true){
                        state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=true
                        state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] +=1
                        state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] -=1
                    }else{
                        state.posts[sportsID][postID]["Comments"][commentID]["Liked"] = false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] -=1
                    }
                }
            })
            .addCase(clickThumbsUpComment.rejected, (state,action)=>{
                const {results, sportsID, postID, commentID, liked, disliked} = action.payload
                state.status = "succeeded"
                if(results["code"]!=100){
                    alert(results["error"])
                    if (liked==true){
                        state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] +=1
                    }else if (disliked==true){
                        state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=true
                        state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] +=1
                        state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] -=1
                    }else{
                        state.posts[sportsID][postID]["Comments"][commentID]["Liked"] = false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] -=1
                    }
                }
                
            })
            .addCase(clickThumbsDownComment.pending, (state,action)=>{
                state.status = "loading"
                const { sportsID, postID, commentID, disliked, liked} = action["meta"]["arg"]
                if (liked==true){
                    state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=false
                    state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] -=1
                    state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=true
                    state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] +=1
                }else if (disliked==true){
                    state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=false
                    state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] -=1
                }else{
                    state.posts[sportsID][postID]["Comments"][commentID]["Disliked"] = true
                    state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] +=1
                }
                
            })
            .addCase(clickThumbsDownComment.fulfilled, (state,action)=>{
                const {results, sportsID, postID, commentID, liked, disliked} = action.payload
                if(results["code"]!=100){
                    alert(results["error"])
                    if (liked==true){
                        state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=true
                        state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] +=1
                        state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] -=1
                    }else if (disliked==true){
                        state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=true
                        state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] +=1
                    }else{
                        state.posts[sportsID][postID]["Comments"][commentID]["Disliked"] = false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] -=1
                       
                    }
                }
                state.status = "succeeded"
            })
            .addCase(clickThumbsDownComment.rejected, (state,action)=>{
                const {results, sportsID, postID, commentID, liked, disliked} = action.payload
                if(results["code"]!=100){
                    alert(results["error"])
                    if (liked==true){
                        state.posts[sportsID][postID]["Comments"][commentID]["Liked"]=true
                        state.posts[sportsID][postID]["Comments"][commentID]["NumLikes"] +=1
                        state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] -=1
                    }else if (disliked==true){
                        state.posts[sportsID][postID]["Comments"][commentID]["Disliked"]=true
                        state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] +=1
                    }else{
                        state.posts[sportsID][postID]["Comments"][commentID]["Disliked"] = false
                        state.posts[sportsID][postID]["Comments"][commentID]["NumDislikes"] -=1
                       
                    }
                }
                state.status = "succeeded"
                
            })
            .addCase(deleteComment.pending, (state,action)=>{
                state.status="loading"
            })
            .addCase(deleteComment.fulfilled, (state,action)=>{
                const {postID, sportsID, results, commentID} = action.payload
                if(results["code"]==100){
                    delete state.posts[sportsID][postID]["Comments"][commentID]
                    state.status = "succeeded"
                }else{
                    alert(results["error"])
                }
            })
            .addCase(deleteComment.rejected, (state,action)=>{
                const {results} = action.payload
                alert(results["error"])

            })
            .addCase(deletePost.pending, (state,action)=>{
                state.status="loading"
            })
            .addCase(deletePost.fulfilled, (state,action)=>{
                const {sportsID, results, postID} = action.payload
                if (results["code"]==100){
                    delete state.posts[sportsID][postID]
                    state.status = "succeeded"
                }else{
                    alert(results["error"])
                }
            })
            .addCase(deletePost.rejected, (state,action)=>{
                const { results} = action.payload
                alert(results["error"])
            })
            .addCase(editComment.pending, (state)=>{
                const {postID, sportsID, commentID, text} = action["meta"]["arg"]
                state.posts[sportsID][postID]["Comments"][commentID]["Text"] = text
                state.status="loading"
            })
            .addCase(editComment.fulfilled, (state,action)=>{
                const {results, postID, sportsID, commentID, oldText} = action.payload
                if(results["code"]!=100){
                    alert(results["error"])
                    state.posts[sportsID][postID]["Comments"][commentID]["Text"] = oldText
                }
                state.status = "succeeded"
            })
            .addCase(editComment.rejected, (state,action)=>{
                const {results, postID, sportsID, commentID, oldText} = action.payload
                alert(results["error"])
                state.posts[sportsID][postID]["Comments"][commentID]["Text"] = oldText
                state.status = "succeeded"
                
            })
    }
})



export const getPosts = createAsyncThunk("post/GetPost", async({sportsID, UID}, {rejectWithValue})=>{
    try{
        const userTimezone = RNLocalize.getTimeZone()
        const options = {
            method: 'GET',
            url: BASE_URL+'/displayPosts',
            params: {sportsID, UID, userTimezone}
        }
        const results = await axios(options)
        return {sportsID, results:results["data"]}
    }catch(error){
        console.log("Error in getPosts()")
        return rejectWithValue({sportsID, results:{"code":300, "response":{}, "error":"Error in retrieving post"}})
    }
})

export const getPostComments = createAsyncThunk("post/GetComments", async({postID, sportsID, UID}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/displayPostComments',
            params: { UID, postID, sportsID}
        }
        const results = await axios(options)
        return {sportsID, results:results["data"], postID}
    }catch(error){
        console.log("Error in getPostComments()")
        return rejectWithValue({sportsID, results:{"code":300, "response":{}, "error":"Error in getting comments"}, postID})
    }
    
})

export const newPost = createAsyncThunk("post/NewPost", async({text, oldPost, postID, sportsID, UID, oldText}, {rejectWithValue,})=>{
    try{
        let results
        if(oldPost){
            const options = {
                method: 'POST',
                url: BASE_URL+'/editPost',
                data: {text, postID}
            }
            results = await axios(options)
        }else{
            const options = {
                method: 'POST',
                url: BASE_URL+'/createPost',
                data: {sportsID, text, UID}
            }
            results = await axios(options)
        }
        return {postID, sportsID, results:results["data"], oldPost, oldText}
    }catch(error){
        console.log("Error in newPost()")
        const message = (oldPost?"Error in editing post": "Error in creating post")
        return rejectWithValue({results:{"code":300, "response": {},"error":message}, oldText, postID, sportsID, oldPost})
    }

})

export const newComment = createAsyncThunk("post/NewComment", async({text, sportsID, postID, UID}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/createPostComments',
            data: {sportsID, UID, postID, text}
        }
        let results = await axios(options)
        return {sportsID, results:results["data"], postID}
    }catch(error){
        console.log("Error in newComment()")
        return rejectWithValue({results:{"code":300,"response":{}, "error":"Error in creating comment!"}})
    }
})

export const clickThumbsUpPost = createAsyncThunk("post/likePost", async({postID, sportsID, UID, disliked, liked}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/likePost',
            data: {postID, UID}
        }
        const results = await axios(options)
        return {sportsID, results:results["data"], postID, disliked, liked}
    }catch(error){
        console.log("Error in clickThumbsUpPost()")
        return rejectWithValue({results:{"code":300, "error":"Error in liking post"}, sportsID, postID, disliked,liked})
    }
})

export const clickThumbsDownPost = createAsyncThunk("post/dislikePost", async({postID, sportsID, UID, disliked, liked}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/dislikePost',
            data: {postID, UID}
        }
        const results = await axios(options)
        return {sportsID, results:results["data"], postID,disliked, liked}
    }catch(error){
        console.log("Error in clickThumbsDownPost()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error in disliking post"},disliked, liked,sportsID, postID})
    }
})

export const clickThumbsUpComment = createAsyncThunk("post/likeComment", async({postID, sportsID, UID, commentID, disliked, liked}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/likePostComments',
            data: {postID, UID, commentID}
        }
        const results = await axios(options)
        return {sportsID, results:results["data"], postID, commentID, liked,disliked}
    }catch(error){
        console.log("Error in clickThumbsUpComment()")
        return rejectWithValue({results:{"code":300, "error":"Error in liking comment"}, liked, disliked, postID, sportsID,commentID})
    }
})

export const clickThumbsDownComment = createAsyncThunk("post/dislikeComment", async({postID, sportsID, UID, commentID, disliked, liked}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/dislikePostComments',
            data: {postID, UID, commentID}
        }
        const results = await axios(options)
        return {sportsID, results:results["data"], postID, commentID, disliked, liked}
    }catch(error){
        console.log("Error in clickThumbsDownComment()")
        return rejectWithValue({results:{"code":300, "error":"Error in disliking comment"}, disliked, liked, sportsID, postID, commentID})
    }
})

export const deleteComment = createAsyncThunk("post/deleteComment", async({postID, sportsID, commentID}, {rejectWithValue})=>{

    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/deletePostComments',
            data: { postID, commentID }
        }
        let results = await axios(options)
        return {sportsID, results:results["data"], postID, commentID}
    }catch(error){
        console.log("Error in deleteComment()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error in deleting comment"}})
    }

    
})

export const deletePost = createAsyncThunk("post/delPost", async({postID, sportsID,UID}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/deletePost',
            data: {postID}
        }
        let results = await axios(options)
        return {sportsID, results:results["data"], postID}

    }catch(error){
        console.log("Error in deletePost()")
        console.log(error)
        return rejectWithValue({results: {"code":300, "error":"Error in deleting post"}})
    }
})

export const editComment = createAsyncThunk("post/editComment", async({postID,commentID, text, sportsID, oldText}, {rejectWithValue})=>{
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/editPostComment',
            data: {postID, commentID, text}
        }
        const results = await axios(options)
        return {postID, sportsID, commentID, results:results["data"], oldText}
    }catch(error){
        console.log("Error in editComment()")
        console.log(error)
        return rejectWithValue({results:{"code":300, "error":"Error in editing comment!"},postID, sportsID, commentID, oldText})
    }
})




export const { resetPosts } = postSlice.actions;
export default postSlice.reducer