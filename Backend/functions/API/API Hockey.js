const axios = require("axios").default

const API_KEY = ''
const BASIC_URL = "https://v1.hockey.api-sports.io"
const RAPIDAPI_HOST = 'v1.hockey.api-sports.io'

/* Gets list of available leagues and cup
{
  "get": "leagues",
  "parameters": {
    "id": "1",
    "season": "2020"
  },
  "errors": [],
  "results": 1,
  "response": [
    {
      "id": 1,
      "name": "MLB",
      "type": "League",
      "logo": null,
      "country": {
        "id": 1,
        "name": "USA",
        "code": "US",
        "flag": "https://media.api-sports.io/flags/us.svg"
      },
      "seasons": [
        {
          "season": 2020,
          "current": true,
          "start": "2020-02-21",
          "end": "2020-09-03"
        }
      ]
    }
  ]
}
*/
async function getHockeyLeagues(props){

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
        console.log("Error in getHockeyLeagues().")
        return []
      }
    }catch(error){
      console.log("Error in getHockeyLeagues().")
      console.log(error)
    }
  
  }


/*Get data about teams
{
  "get": "teams",
  "parameters": {
    "id": "3"
  },
  "errors": [],
  "results": 1,
  "response": [
    {
      "id": 3,
      "name": "Atlanta Braves",
      "logo": "https://media.api-sports.io/baseball/teams/3.png",
      "country": {
        "id": 1,
        "name": "USA",
        "code": "US",
        "flag": "https://media.api-sports.io/flags/us.svg"
      }
    }
  ]
}
*/
async function getHockeyTeams(props){

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
        console.log("Error in getHockeyTeams().")
        return []
      }
    }catch(error){
      console.log("Error in getHockeyTeams().")
      console.log(error)
    }
  
  }

/*Gets statistics of a specific team Required field { league id:1 , season: "2019", team:"5"}
{
  "get": "teams/statistics",
  "parameters": {
    "league": "1",
    "team": "5",
    "season": "2019"
  },
  "errors": [],
  "results": 5,
  "response": {
    "country": {
      "id": 1,
      "name": "USA",
      "code": "US",
      "flag": "https://media.api-sports.io/flags/us.svg"
    },
    "league": {
      "id": 1,
      "name": "MLB",
      "type": "League",
      "logo": "https://media.api-sports.io/baseball/leagues/1.png",
      "season": 2019
    },
    "team": {
      "id": 5,
      "name": "Boston Red Sox",
      "logo": "https://media.api-sports.io/baseball/teams/5.png"
    },
    "games": {
      "played": {
        "home": 94,
        "away": 94,
        "all": 188
      },
      "wins": {
        "home": {
          "total": 44,
          "percentage": "0.468"
        },
        "away": {
          "total": 49,
          "percentage": "0.521"
        },
        "all": {
          "total": 93,
          "percentage": "0.495"
        }
      },
      "loses": {
        "home": {
          "total": 50,
          "percentage": "0.532"
        },
        "away": {
          "total": 44,
          "percentage": "0.468"
        },
        "all": {
          "total": 94,
          "percentage": "0.500"
        }
      }
    },
    "points": {
      "for": {
        "total": {
          "home": 522,
          "away": 496,
          "all": 1018
        },
        "average": {
          "home": "5.6",
          "away": "5.3",
          "all": "5.4"
        }
      },
      "against": {
        "total": {
          "home": 514,
          "away": 470,
          "all": 984
        },
        "average": {
          "home": "5.5",
          "away": "5.0",
          "all": "5.2"
        }
      }
    }
  }
}
*/
async function getHockeyTeamsStatistics(props){

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
        console.log("Error in getHockeyTeamStatistics().")
        return []
      }
    }catch(error){
      console.log("Error in getHockeyTeamStatistics().")
      console.log(error)  
    }
  
  }  

/*Get standings for a league(each team maybe in two leagues) Required params {"league" : "1", "season":"2020"}
{
  "get": "standings",
  "parameters": {
    "league": "1",
    "season": "2020",
    "team": "5"
  },
  "errors": [],
  "results": 2,
  "response": [
    [
      {
        "position": 12,
        "stage": "MLB - Regular Season",
        "group": {
          "name": "American League"
        },
        "team": {
          "id": 5,
          "name": "Boston Red Sox",
          "logo": "https://media.api-sports.io/baseball/teams/5.png"
        },
        "league": {
          "id": 1,
          "name": "MLB",
          "type": "League",
          "logo": "https://media.api-sports.io/baseball/leagues/1.png",
          "season": 2020
        },
        "country": {
          "id": 1,
          "name": "USA",
          "code": "US",
          "flag": "https://media.api-sports.io/flags/us.svg"
        },
        "games": {
          "played": 0,
          "win": {
            "total": 0,
            "percentage": "0.000"
          },
          "lose": {
            "total": 0,
            "percentage": "0.000"
          }
        },
        "points": {
          "for": 0,
          "against": 0
        },
        "form": null,
        "description": null
      },
      {
        "position": 5,
        "stage": "MLB - Regular Season",
        "group": {
          "name": "AL East"
        },
        "team": {
          "id": 5,
          "name": "Boston Red Sox",
          "logo": "https://media.api-sports.io/baseball/teams/5.png"
        },
        "league": {
          "id": 1,
          "name": "MLB",
          "type": "League",
          "logo": "https://media.api-sports.io/baseball/leagues/1.png",
          "season": 2020
        },
        "country": {
          "id": 1,
          "name": "USA",
          "code": "US",
          "flag": "https://media.api-sports.io/flags/us.svg"
        },
        "games": {
          "played": 0,
          "win": {
            "total": 0,
            "percentage": "0.000"
          },
          "lose": {
            "total": 0,
            "percentage": "0.000"
          }
        },
        "points": {
          "for": 0,
          "against": 0
        },
        "form": null,
        "description": null
      }
    ],
    [
      {
        "position": 9,
        "stage": "MLB - Pre-season",
        "group": {
          "name": "American League"
        },
        "team": {
          "id": 5,
          "name": "Boston Red Sox",
          "logo": "https://media.api-sports.io/baseball/teams/5.png"
        },
        "league": {
          "id": 1,
          "name": "MLB",
          "type": "League",
          "logo": "https://media.api-sports.io/baseball/leagues/1.png",
          "season": 2020
        },
        "country": {
          "id": 1,
          "name": "USA",
          "code": "US",
          "flag": "https://media.api-sports.io/flags/us.svg"
        },
        "games": {
          "played": 12,
          "win": {
            "total": 5,
            "percentage": "0.417"
          },
          "lose": {
            "total": 7,
            "percentage": "0.583"
          }
        },
        "points": {
          "for": 57,
          "against": 60
        },
        "form": null,
        "description": null
      }
    ]
  ]
}

*/

async function getHockeyLeagueStandings(props){

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
        console.log("Error in getHockeyLeagueStandings().")
        return []
      }
    }catch(error){
      console.log("Error in getHockeyLeagueStandings().")
      console.log(error)
    }
  
  }


/* Gets details of games/game depending on parameters set by user

{
  "get": "games",
  "parameters": {
    "id": "1"
  },
  "errors": [],
  "results": 1,
  "response": [
    {
      "id": 1,
      "date": "2020-02-21T18:05:00+00:00",
      "time": "18:05",
      "timestamp": 1582308300,
      "timezone": "UTC",
      "week": null,
      "status": {
        "long": "Finished",
        "short": "FT"
      },
      "country": {
        "id": 1,
        "name": "USA",
        "code": "US",
        "flag": "https://media.api-sports.io/flags/us.svg"
      },
      "league": {
        "id": 1,
        "name": "MLB",
        "type": "League",
        "logo": "https://media.api-sports.io/baseball/leagues/1.png",
        "season": 2020
      },
      "teams": {
        "home": {
          "id": 5,
          "name": "Boston Red Sox",
          "logo": "https://media.api-sports.io/baseball/teams/5.png"
        },
        "away": {
          "id": 43,
          "name": "Northeastern",
          "logo": "https://media.api-sports.io/baseball/teams/43.png"
        }
      },
      "scores": {
        "home": {
          "hits": 6,
          "errors": 2,
          "innings": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 3,
            "7": null,
            "8": null,
            "9": null,
            "extra": null
          },
          "total": 3
        },
        "away": {
          "hits": 4,
          "errors": 0,
          "innings": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": null,
            "9": null,
            "extra": null
          },
          "total": 0
        }
      }
    }
  ]
}

*/

async function getHockeyGames(props){

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
        console.log("Error in getHockeyGames().")
        return []
      }
    }catch(error){
      console.log("Error in getHockeyGames().")
      console.log(error)
    }
  
  }

/*Get heads to heads between two teams
Required params { "h2h": "5-6"} 5 and 6 are ids of two teams
{
  "get": "games/h2h",
  "parameters": {
    "h2h": "5-6",
    "date": "2017-04-28"
  },
  "errors": [],
  "results": 1,
  "response": [
    {
      "id": 17445,
      "date": "2017-04-28T23:10:00+00:00",
      "time": "23:10",
      "timestamp": 1493421000,
      "timezone": "UTC",
      "week": null,
      "status": {
        "long": "Finished",
        "short": "FT"
      },
      "country": {
        "id": 1,
        "name": "USA",
        "code": "US",
        "flag": "https://media.api-sports.io/flags/us.svg"
      },
      "league": {
        "id": 1,
        "name": "MLB",
        "type": "League",
        "logo": "https://media.api-sports.io/baseball/leagues/1.png",
        "season": 2017
      },
      "teams": {
        "home": {
          "id": 5,
          "name": "Boston Red Sox",
          "logo": "https://media.api-sports.io/baseball/teams/5.png"
        },
        "away": {
          "id": 6,
          "name": "Chicago Cubs",
          "logo": "https://media.api-sports.io/baseball/teams/6.png"
        }
      },
      "scores": {
        "home": {
          "hits": 13,
          "errors": 2,
          "innings": {
            "1": 5,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": null,
            "extra": null
          },
          "total": 5
        },
        "away": {
          "hits": 11,
          "errors": 0,
          "innings": {
            "1": 1,
            "2": 0,
            "3": 1,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 2,
            "8": 0,
            "9": 0,
            "extra": null
          },
          "total": 4
        }
      }
    }
  ]
}
*/
async function getHockeyGamesH2H(props){

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
        console.log("Error in getHockeyGamesH2H().")
        return []
      }
    }catch(error){
      console.log("Error in getHockeyGamesH2H().")
      console.log(error)
    }
  
  }

module.exports = {getHockeyGames,getHockeyGamesH2H,getHockeyLeagueStandings,getHockeyLeagues,getHockeyTeams,getHockeyTeamsStatistics}