const axios = require("axios").default

const API_KEY = ''
const BASIC_URL = 'https://v1.basketball.api-sports.io'
const RAPIDAPI_HOST = 'v1.basketball.api-sports.io'

async function getBasketballLeagues(props){
    const options = {
        method: 'GET',
        url: BASIC_URL+'/leagues',
        params: props,
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': API_KEY
        }
      };
    try{
      const response = await axios(options);

      if (response["status"]==200){
        return response["data"]["response"]
      }else{
        console.log("Error in getBasketballLeagues().")
        return []
      }
    }catch(error){
      console.log("Error in getBasketballLeagues().")
      console.log(error)
    }
      
  
}
  
async function getBasketballTeams(props){
  const options = {
      method: 'GET',
      url: BASIC_URL+'/teams',
      params: props,
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': API_KEY
      }
    };
  try{
    const response = await axios(options);
    if (response["status"]==200){
      return response["data"]["response"]
    }else{
      console.log("Error in getTeams().")
      return []
    }
  }catch(error){
    console.log("Error in getTeams().")
    console.log(error)
  }

}

async function getBasketballTeamsStatistics(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/statistics',
      params: props,
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': API_KEY
      }
    };
  try{
    const response = await axios(options);
    if (response["status"]==200){
      return response["data"]["response"]
    }else{
      console.log("Error in getBasketballTeamStatistics().")
      return []
    }
  }catch(error){
    console.log("Error in getBasketballTeamStatistics().")
    console.log(error)  
  }
}

async function getBasketballLeagueStandings(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/standings',
      params: props,
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': API_KEY
      }
    };
    try{
      const response = await axios(options);
      if (response["status"]==200){
        return response["data"]["response"]
      }else{
        console.log("Error in getBasketballLeagueStandings().")
        return []
      }
    }catch(error){
      console.log("Error in getBasketballLeagueStandings().")
      console.log(error)
    }
}

async function getBasketballGames(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/games',
      params: props,
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': API_KEY
      }
    };
    try{
      const response = await axios(options);
      if (response["status"]==200){
        return response["data"]["response"]
      }else{
        console.log("Error in getBasketballgames().")
        return []
      }
    }catch(error){
      console.log("Error in getBasketballgames().")
      console.log(error)
    }
}

async function getBasketballGamesH2H(props){
  const options = {
      method: 'GET',
      url: BASIC_URL+'/games/h2h',
      params: props,
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': API_KEY
      }
    };
    try{
      const response = await axios(options);
      if (response["status"]==200){
        return response["data"]["response"]
      }else{
        console.log("Error in getBasketballGamesH2H().")
        return []
      }
    }catch(error){
      console.log("Error in getBasketballGamesH2H().")
      console.log(error)
    }
}

module.exports = {getBasketballGames, getBasketballGamesH2H, getBasketballLeagueStandings,getBasketballLeagues, getBasketballTeams,getBasketballTeamsStatistics}
