import axios from "axios"

// BASE_URL is the endpoint for our backend
const BASE_URL = ""

export async function likeGameComments({gameID, sportsID, commentID, UID}){
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/likeGameComments',
            data: {gameID, sportsID, commentID, UID}
        }
        let results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
            return undefined
        }
        return results["data"]["response"]
    }catch(error){
        console.log("Error in likeGameComments()")
        alert("Error in liking comment")
        return undefined
    }
}

export async function dislikeGameComments({gameID, sportsID, commentID, UID}){
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/dislikeGameComments',
            data: {gameID, sportsID, commentID, UID}
        }
        let results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
        }
        return results["data"]["response"] 
    }catch(error){
        console.log("Error in dislikeGameComments()")
        alert("Error in disliking comment")
    }
}

export async function createGameComments({gameID, sportsID, text, UID}){
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/createGameComments',
            data: {gameID, sportsID, text, UID}
        }
        let results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
            return undefined
        }else{
            return results["data"]["response"]
        }
    }catch(error){
        console.log("Error in createGameComment()")
        alert("Error in posting comment")
        return undefined
    }
}

export async function deleteGameComments({gameID, sportsID, commentID}){
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/deleteGameComments',
            data: {gameID, sportsID, commentID}
        }
        let results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
            return false
        }
        return true
    }catch(error){
        console.log("Error in deleteGameComments()")
        alert("Error in deleting comment")
        return false
    }
}

export async function displayGameComments({gameID, sportsID, UID}){
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/displayGameComments',
            params: {gameID, sportsID, UID}
        }
        const results = await axios(options)
        if (results["data"]["code"]==100){
            return results["data"]["response"]
        }else{
            alert(results["data"]["error"])
            return results["data"]["response"]
        }
    }catch(error){
        console.log("Error in displayGameComments()")
        alert("Error in displaying game comments")
        return {}
    }
}

export async function editGameComment({gameID, sportsID, commentID, text}){
    try{
        const options = {
            method: 'POST',
            url: BASE_URL+'/editGameComment',
            data: {gameID, sportsID, commentID, text}
        }
        let results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
            return false
        }else{
            return true
        }
    }catch(error){
        console.log("Error in editGameComments()")
        alert("Error in editing comment")
        return false
    }
}