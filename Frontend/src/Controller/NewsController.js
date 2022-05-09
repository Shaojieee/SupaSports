import axios from "axios"

// BASE_URL is the endpoint for our backend
const BASE_URL = ""

export async function getSportsNews({pageNumber,sportsID})
{
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/getSportsNews',
            params: {pageNumber, sportsID}
        }
        const results = await axios(options)
        if(results["data"]["code"]==100){
            return results["data"]["response"]
        }else{
            alert(results["data"]["error"])
            return results["data"]["response"]
        }
    }catch(error){
        console.log("Error in getSportsNews()")
        alert("Error in getting sports news")
        return [pageNumber, []]
    }
}

export async function getArticlesByClub(pageNumber,clubName, leagueName){

    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/getArticlesByClub',
            params: {pageNumber, clubName, leagueName}
        }
        const results = await axios(options)
        if(results["data"]["code"]==100){
            return results["data"]["response"]
        }else{
            alert(results["data"]["error"])
            return results["data"]["response"]
        } 
    }catch(error){
        console.log("Error in getArticlesByClub()")
        alert("Error in getting articles by club")
        return [pageNumber,[]]
    }


}