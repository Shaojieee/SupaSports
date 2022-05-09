const axios = require("axios").default

const API_KEY = ''
const BASIC_URL = 'https://free-news.p.rapidapi.com/v1/search'
const RAPIDAPI_HOST = 'free-news.p.rapidapi.com'

async function getNews(dict){
    try{

        const options = {
            method: 'GET',
            url: BASIC_URL,
            params: dict ,
            headers: {
                'x-rapidapi-host': RAPIDAPI_HOST,
                'x-rapidapi-key': API_KEY
            }
        };
        
        const response = await axios(options);
        if(response['status']==400){
            console.log("Error on our side.")
            return []
        }else if(response["status"]==500){
            console.log("Error on API side.")
            return []
        }   
        return response.data["articles"]
    }catch(error){
        console.log("Error in getn news")
        console.log(error)
    } 
}

module.exports = {getNews}
