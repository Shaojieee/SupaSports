const axios = require("axios").default

const API_KEY = ''
const BASIC_URL = 'https://v3.football.api-sports.io'
const RAPIDAPI_HOST = 'v3.football.api-sports.io'

// Get Team information
// Either team : team id or search : (more than 3 characters) 
// {
//   "team": {
//   "id": 33,
//   "name": "Manchester United",
//   "code": "MUN",
//   "country": "England",
//   "founded": 1878,
//   "national": false,
//   "logo": "https://media.api-sports.io/football/teams/33.png"
//   },
//   "venue": {
//   "id": 556,
//   "name": "Old Trafford",
//   "address": "Sir Matt Busby Way",
//   "city": "Manchester",
//   "capacity": 76212,
//   "surface": "grass",
//   "image": "https://media.api-sports.io/football/venues/556.png"
//   }
//   }
async function getTeam(props){

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
        console.log("Error in getTeam().")
        return []
      }
    }catch(error){
      console.log("Error in getTeam().")
      console.log(error)
    }
  
}

// Get Team Statistics
// Required: league : league id, season : (YYYY), team : team id
// {
//   "league": {},
//   "team": {},
//   "form": "WDLDWLDLDWLWDDWWDLWWLWLLDWWDWDWWWWDWDW",
//   "fixtures": {},
//   "goals": {},
//   "biggest": {},
//   "clean_sheet": {},
//   "failed_to_score": {},
//   "penalty": {},
//   "lineups": [],
//   "cards": {}
//   }
async function getTeamStatistics(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/teams/statistics',
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
      console.log("Error in getTeamStatistics().")
      return []
    }
  }catch(error){
    console.log("Error in getTeamStatistics().")
    console.log(error)
  }
}

// Get a list of Leagues/Cups
// Optional:
// 1) id : League id
// 2) name : Name of league
// 3) country: Country name of league
// 4) season : Season of the league
// 5) team : Team id
// 6) type : Type of league (league/cup)
// 7) current : Currently ongoing (true/false)
// 8) search : Name or country of the league
//   {
//   "league":{...}
//   "country":{...}
//   "seasons":[...]
//   }
async function getLeagues(props){

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
      console.log("Error in getLeagues().")
      return []
    }
  }catch(error){
    console.log("Error in getLeagues().")
    console.log(error)
  }
}

//Get standings of a league or a team in a season
// Required: season : (YYYY)
// Either team : team id or league : league id
async function getStandings(props){

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
      console.log("Error in getStandings().")
      return []
    }
  }catch(error){
    console.log("Error in getStandings().")
    console.log(error)
  }
  
}

// Get the fixtures for the league or team

async function getFixtures(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/fixtures',
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
        console.log("Error in getFixtures().")
        return []
      }
    }catch(error){
      console.log("Error in getFixture().")
      console.log(error)
    }
    

}

// Get the statistics of a fixture
async function getFixtureStatistics(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/fixtures/statistics',
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
      console.log("Error in getFixtureStatistics().")
      return []
    }
  }catch(error){
    console.log("Error in getFixtureStatistics().")
    console.log(error)
  }
  
}

// Get the events for the fixture
async function getFixtureEvents(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/fixtures/events',
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
      console.log("Error in getFixtureEvents().")
      return []
    }
  }catch(error){
    console.log("Error in  getFixtureEvents().")
    console.log(error)
  }
  
      
  

}

// Get the lineup of the fixture 
async function getLineup(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/fixtures/lineups',
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
      console.log("Error in getLineup().")
      return []
    }
  }catch(error){
    console.log("Error in getLineUp")
    console.log(error)
  }
  
      
  

}

// Get the statistics of all the players for the fixture
async function getFixturePlayers(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/fixtures/players',
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
      console.log("Error in getFixturePlayers().")
      return []
    }
  }catch(error){
    console.log("Error in getFixturePlayers()")
    console.log(error)
  }
}
  
/*
Get a list of all possible seasons
*/
async function getLeaguesSeasons(props){

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
    console.log("Error in getFixturePlayers().")
    return []
  }
}catch(error){
  console.log("Error in getLeaguesSeasons")
  console.log(error)
}
  

}

//Get list of all seasons the team has played in
async function getTeamsSeasons(props){

  const options = {
      method: 'GET',
      url: BASIC_URL+'/teams/seasons',
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
        console.log("Error in getTeamsSeasons().")
        return []
      }
    }catch(error){
      console.log("Error in getTeamsSeasons().")
      console.log(error)
    }
  
}

module.exports = {getTeam, getFixtureEvents, getFixturePlayers,getFixtureStatistics,getFixtures,getLeagues,getLeaguesSeasons,getLineup,getStandings,getTeamStatistics,getTeamsSeasons}