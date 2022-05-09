import * as RNLocalize from "react-native-localize";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment"

// BASE_URL is the endpoint for our backend
const BASE_URL = ""


const initialState = ()=>({
    status: 0,
    games:{}
})


const gameSlice = createSlice({
    name:"Games",
    initialState:initialState(),

    reducers:{
        resetGames: (state)=>initialState()
    },

    extraReducers(builder){
        builder
            .addCase(getFixtureByDate.pending, (state,action)=>{
                state.status+=1
            })
            .addCase(getFixtureByDate.fulfilled, (state,action)=>{
                const {results, date, sportsID, id, type} = action.payload
                if(state.games.hasOwnProperty(sportsID)==false){
                    state.games[sportsID]={}
                }
                if(state.games[sportsID].hasOwnProperty(type)==false){
                    state.games[sportsID][type]={}
                }
                if(state.games[sportsID][type].hasOwnProperty(id)==false){
                    state.games[sportsID][type][id]={}
                }
                state.games[sportsID][type][id][date]=results
                state.status-=1
            })
    }
})

export const getFixtureByDate = createAsyncThunk("game/getFixtureByDate", async({id,sportsID,date, type})=>{
    let results
    if (type=="league"){
        results = await getLeagueFixture({leagueID:id, sportsID, date})
    }else{
        results = await getTeamFixture({clubID:id, sportsID, date})
    }
    return {results, date, sportsID, id, type}
})





/*Example response 
{
    fixture: {
        id: 710862,
        referee: "A. Marriner",
        timezone: "Asia/Singapore",
        date: "2022-04-03T00:30:00+08:00",
        timestamp: 1648917000,

        periods: {
            first: null,
            second: null
        },

        venue: {
            id: 556,
            name: "Old Trafford",
            city: "Manchester"
        },

        status: {
            long: "Not Started",
            short: "NS",
            elapsed: null
        }
    },

    league: {
        id: 39,
        name: "Premier League",
        country: "England",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        flag: "https://media.api-sports.io/flags/gb.svg",
        season: 2021,
        round: "Regular Season - 31"
    },

    teams: {
        home: {
        id: 33,
        name: "Manchester United",
        logo: "https://media.api-sports.io/football/teams/33.png",
        winner: null
        },
        away: {
        id: 46,
        name: "Leicester",
        logo: "https://media.api-sports.io/football/teams/46.png",
        winner: null
        }
    },

    goals: {
        home: null,
        away: null
    },

    score: {
        halftime: {
        },
        fulltime: {
            home: null,
            away: null
        },
        extratime: {
            home: null,
            away: null
        },
        penalty: {
            home: null,
            away: null
        }
    },

    events: [
    ],

    lineups: [
    ],

    statistics: [
    ],

    players: [
    ]

}
*/
export async function getGameDetails({gameID,sportsID}){

    try{
        const userTimezone = RNLocalize.getTimeZone()
        const options = {
            method: 'GET',
            url: BASE_URL+'/getGameDetails',
            params: {gameID, sportsID, userTimezone}
        }
        const results = await axios(options)
        if (results["data"]["code"]==100){
            results["data"]["response"]["date"] = moment(results["data"]["response"]["dateTime"]).format("MMMM Do YYYY, h:mm:ss a")
            return results["data"]["response"]
        }else{
            alert(results["data"]["error"])
            return undefined
        }
        
    }catch(error){
        console.log("Error in getGameDetails()")
        alert("Error in getting game details")
        return undefined
    }
}


export async function getTeamFixture({clubID,sportsID,date}){
    try{
        const userTimezone = RNLocalize.getTimeZone()
        const options = {
            method: 'GET',
            url: BASE_URL+'/getTeamFixture',
            params: {clubID, sportsID, userTimezone, date}
        }
        const results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
            return []
        }else{
            return results["data"]["response"]
        }
    }catch(error){
        console.log("Error in getTeamFixture()")
        alert("Error in getting team fixture")
        return []
    }
    
}

/*
//Return past results for the specific team
[
    {
        fixture: {
                id: 710561,
                referee: "P. Tierney",
                timezone: "UTC",
                date: "2021-08-14T11:30:00+00:00",
                timestamp: 1628940600,
                periods: {
                    first: 1628940600,
                    second: 1628944200
                },
            venue: {
                    id: 556,
                    name: "Old Trafford",
                    city: "Manchester"
                },
            status: {
                long: "Match Finished",
                short: "FT",
                elapsed: 90
            }
        },
        league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
            flag: "https://media.api-sports.io/flags/gb.svg",
            season: 2021,
            round: "Regular Season - 1"
        },
        teams: {
            home: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
            winner: true
            },
            away: {
            id: 63,
            name: "Leeds",
            logo: "https://media.api-sports.io/football/teams/63.png",
            winner: false
            }
        },
        goals: {
            home: 5,
            away: 1
        },
        score: {
            halftime: {
                home: 1,
                away: 0
            },
            fulltime: {
                home: 5,
                away: 1
            },
            extratime: {
                home: null,
                away: null
            },
            penalty: {
                home: null,
                away: null
            }
        }
    },
    {
        fixture: {
            id: 710573,
            referee: "C. Pawson",
            timezone: "UTC",
            date: "2021-08-22T13:00:00+00:00",
            timestamp: 1629637200,
        periods: {
            first: 1629637200,
            second: 1629640800
        },
        venue: {
            id: 585,
            name: "St. Mary's Stadium",
            city: "Southampton, Hampshire"
        },
        status: {
            long: "Match Finished",
            short: "FT",
            elapsed: 90
            }
    },
        league: {
            id: 39,
            name: "Premier League",
            country: "England",
            logo: "https://media.api-sports.io/football/leagues/39.png",
            flag: "https://media.api-sports.io/flags/gb.svg",
            season: 2021,
            round: "Regular Season - 2"
        },
        teams: {
            home: {
                id: 41,
                name: "Southampton",
                logo: "https://media.api-sports.io/football/teams/41.png",
                winner: null
            },
            away: {
                id: 33,
                name: "Manchester United",
                logo: "https://media.api-sports.io/football/teams/33.png",
                winner: null
            }
        },
        goals: {
            home: 1,
            away: 1
        },
        score: {
            halftime: {
                home: 1,
                away: 0
            },
            fulltime: {
                home: 1,
                away: 1
            },
            extratime: {
                home: null,
                away: null
            },
            penalty: {
                home: null,
                away: null
            }
        }
    }
]
*/
export async function getTeamResults({clubID,sportsID}){

    try{
        const userTimezone = RNLocalize.getTimeZone()
        const options = {
            method: 'GET',
            url: BASE_URL+'/getTeamResults',
            params: {clubID, sportsID, userTimezone}
        }
        const results = await axios(options)
        if(results["data"]["code"]!=100){
            alert(results["data"]["error"])
            return []
        }else{
            return results["data"]["response"]
        }
    }catch(error){
        console.log("Error in getTeamResults()")
        alert("Error in getting team results")
        return []
    }
}

export async function getLeagueStandings({leagueID,sportsID}){
    try{
        const options = {
            method: 'GET',
            url: BASE_URL+'/getLeagueStandings',
            params: {leagueID, sportsID}
        }
        const results = await axios(options)
        if (results["data"]["code"]==100){
            return results["data"]["response"]
        }else{
            alert(results["data"]["error"])
            return []
        }
    }catch(error){
        console.log("Error in getLeagueStandings()")
        alert("Error in getting league standings")
        return []
    }
}

export async function getLeagueFixture({leagueID,sportsID,date}){

    try{
        const userTimezone = RNLocalize.getTimeZone()
        const options = {
            method: 'GET',
            url: BASE_URL+'/getLeagueFixture',
            params: {leagueID, date, sportsID, userTimezone}
        }
        const results = await axios(options)
        if (results["data"]["code"]==100){
            return results["data"]["response"]
        }else{
            alert(results["data"]["error"])
            return []
        }
    }catch(error){
        console.log("Error in getLeagueFixture()")
        alert("Error in getting league fixtures")
        return []
    }
}

export async function getLeagueResults({leagueID,sportsID}){
    try{
        const userTimezone = RNLocalize.getTimeZone()
        const options = {
            method: 'GET',
            url: BASE_URL+'/getLeagueResults',
            params: {leagueID, sportsID, userTimezone}
        }
        const results = await axios(options)
        if (results["data"]["code"]==100){
            return results["data"]["response"]
        }else{
            alert(results["data"]["error"])
            return []
        }
    }catch(error){
        console.log("Error in getLeagueResults()")
        alert("Error in getting league results")
        return []
    }
}

export default gameSlice.reducer