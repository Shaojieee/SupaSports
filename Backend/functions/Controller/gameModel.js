const football = require("../API/API Football")
const basketball = require("../API/API Basketball")
const baseball = require("../API/API Baseball")
const hockey = require("../API/API Hockey")
const moment = require("moment")

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
async function getGameDetails({gameID,sportsID, userTimezone}){
    try{
        let gameDetails
        if(sportsID =='0'){
            const gameList = await football.getFixtures({"id": gameID,"timezone":userTimezone})
            gameDetails = gameList[0]
            const originalDate = gameDetails['fixture']['date']
            gameDetails['dateTime']=originalDate
            let statisticsList = []
            let awayList
            let homeList
            if(gameDetails["statistics"].length!=0){
                if(gameDetails['statistics'][0]['team']['name']==gameDetails['teams']['home']['name']){
                    homeList = gameDetails['statistics'][0]['statistics']
                    awayList = gameDetails['statistics'][1]['statistics']
                }else{
                    homeList = gameDetails['statistics'][1]['statistics']
                    awayList = gameDetails['statistics'][0]['statistics']
                }
                let homeStat,awayStat,homeValue,awayValue
                for(let i=0;i<homeList.length;i++){
                    homeStat = homeList[i]
                    awayStat = awayList[i]
                    homeValue = homeStat['value']
                    awayValue = awayStat['value']
                    if(homeValue==null){
                        homeValue=0
                    }
                    if(awayValue==null){
                        awayValue=0
                    }
                    if(typeof homeValue === 'string'){
                        if(homeStat['type'].includes("%")){
                            homeStat['type'].replace("%")
                            homeValue = parseFloat(homeValue)
                            awayValue=parseFloat(awayValue)
                        }else{
                            homeStat['type'] = homeStat['type'] + " " + "(%)"
                            homeValue = parseFloat(homeValue)
                            awayValue=parseFloat(awayValue)
                        }
                    }
                    statisticsList.push({'type': homeStat['type'],'home':homeValue,'away':awayValue})
                }
            }
            gameDetails['statistics'] = statisticsList
            
        }else if(sportsID == '1'){
            const gameList = await basketball.getBasketballGames({'id':gameID,'timezone':userTimezone})
            gameDetails = gameList[0] 
            gameDetails["fixture"] = {id:gameDetails["id"], date:gameDetails["date"], status:{...gameDetails["status"]}}
            gameDetails["goals"] = {home:gameDetails["scores"]["home"]["total"], away:gameDetails["scores"]["away"]["total"]}
            const originalDate = gameDetails['date']
            gameDetails['dateTime']=originalDate

        }else if(sportsID == '2'){
            const gameList = await baseball.getBaseballGames({'id':gameID,'timezone':userTimezone})
            gameDetails = gameList[0] 
            gameDetails["fixture"] = {id:gameDetails["id"], date:gameDetails["date"], status:{...gameDetails["status"]}}
            gameDetails["goals"] = {home:gameDetails["scores"]["home"]["total"], away:gameDetails["scores"]["away"]["total"]}
            const originalDate = gameDetails['date']
            gameDetails['dateTime']=originalDate
        }else{
            const gameList = await hockey.getHockeyGames({'id': gameID,'timezone':userTimezone})
            gameDetails = gameList[0] 
            gameDetails["fixture"] = {id:gameDetails["id"], date:gameDetails["date"], status:{...gameDetails["status"]}}
            gameDetails["goals"] = {home:gameDetails["scores"]["home"], away:gameDetails["scores"]["away"]}
            const originalDate = gameDetails['date']
            gameDetails['dateTime']=originalDate
            delete gameDetails['events']
        }
        return{'code':100 ,'response':gameDetails}
    }catch(error){
        console.log('Error in getGameDetails')
        console.log(error)
        return { 'code': 200, 'error' : "Unable to get game details"}
    }
    
}

async function getTeamFixture({db,clubID,sportsID,date, userTimezone}){
    try{
        let listOfFixtures = []
        let documentSnapShot = await db
                                        .collection("SportsID")
                                        .doc(sportsID.toString())
                                        .collection("AllClubs")
                                        .doc(clubID.toString())
                                        .get()
        let teamDetails = documentSnapShot.data()
        for(const key of Object.keys(teamDetails['league'])){
            if(date === undefined){
                if(sportsID == '0'){
                    const seasons_response= await football.getLeaguesSeasons({"id":parseInt(key), "current":true})
                    const latestSeason = seasons_response[0]['seasons'][0]['year']
                    const fixture_response = await football.getFixtures({"season": latestSeason,"team":clubID,"timezone":userTimezone, "league":parseInt(key)})
                    for(const fixture of fixture_response){
                        const statusOfMatch = fixture["fixture"]['status']['short']
                        fixture["dateTime"] = fixture["fixture"]["date"]
                        if(statusOfMatch=='NS' ||statusOfMatch=='TBD'){
                            listOfFixtures.push(fixture)
                        }
                    }       
                }else if(sportsID == '1'){
                    const listOfLeagues = await basketball.getBasketballLeagues({"id" : parseInt(key)})
                    const listOfSeasons = listOfLeagues[0]['seasons']
                    let latestSeason = listOfSeasons[0]['season']
                    for(const seasonDict of listOfSeasons){
                        if(seasonDict['season']>latestSeason){
                            latestSeason=seasonDict['season']
                        }
                    }
                    const fixture_response =await basketball.getBasketballGames({'team':clubID,'season':latestSeason,'timezone':userTimezone, 'league':key})
                    for(const fixture of fixture_response){
                        fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                        const statusOfMatch = fixture["fixture"]['status']['short']
                        fixture["dateTime"] = fixture["date"]
                        if(statusOfMatch=='NS' || statusOfMatch=='POST'){
                            listOfFixtures.push(fixture)
                        }
                    }
                }else if(sportsID== '2'){
                    const listOfLeagues = await baseball.getBaseballLeagues({"id" : parseInt(key)})
                    const listOfSeasons = listOfLeagues[0]['seasons']
                    let latestSeason = listOfSeasons[0]['season']
                    for(const seasonDict of listOfSeasons){
                        if(seasonDict['season']>latestSeason){
                            latestSeason=seasonDict['season']
                        }
                    }
                    const fixture_response =await baseball.getBaseballGames({'team':clubID,'season':latestSeason,'timezone':userTimezone, 'league':key})
                    for(const fixture of fixture_response){
                        fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                        const statusOfMatch = fixture["fixture"]['status']['short']
                        fixture["dateTime"] = fixture["date"]
                        if(statusOfMatch=='NS' || statusOfMatch=='POST'){

                            listOfFixtures.push(fixture)
                        }
                    }
                }else{
                    const listOfLeagues = await hockey.getHockeyLeagues({"id" : parseInt(key)})
                    const listOfSeasons = listOfLeagues[0]['seasons']
                    let latestSeason = listOfSeasons[0]['season']
                    for(const seasonDict of listOfSeasons){
                        if(seasonDict['season']>latestSeason){
                            latestSeason=seasonDict['season']
                        }
                    }
                    const fixture_response =await hockey.getHockeyGames({'team':clubID,'season':latestSeason,'timezone':userTimezone, 'league':key})
                    for(const fixture of fixture_response){
                        fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                        const statusOfMatch = fixture["fixture"]['status']['short']
                        fixture["dateTime"] = fixture["date"]
                        if(statusOfMatch=='NS' || statusOfMatch=='POST'){
                            listOfFixtures.push(fixture)
                        }
                    }
                }
            }else{
                if(sportsID == '0'){
                    const seasons_response= await football.getLeaguesSeasons({"id":parseInt(key), "current":true})
                    const latestSeason = seasons_response[0]['seasons'][0]['year']
                    const fixture_response = await football.getFixtures({"season": latestSeason,"team":clubID,"timezone":userTimezone,'date':date, 'league':key})
                    for(const fixture of fixture_response){
                        fixture["dateTime"] = fixture["fixture"]["date"]
                        listOfFixtures.push(fixture)
                    }       
                }else if(sportsID == '1'){
                    const listOfLeagues = await basketball.getBasketballLeagues({"id" : parseInt(key)})
                    const listOfSeasons = listOfLeagues[0]['seasons']
                    let latestSeason = listOfSeasons[0]['season']
                    for(const seasonDict of listOfSeasons){
                        if(seasonDict['season']>latestSeason){
                            latestSeason=seasonDict['season']
                        }
                    }
                    const fixture_response =await basketball.getBasketballGames({'team':clubID,'season':latestSeason,'timezone':userTimezone,'date':date, 'league':key})
                    for(const fixture of fixture_response){
                        fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                        const statusOfMatch = fixture["fixture"]['status']['short']
                        fixture["dateTime"] = fixture["date"]
                        fixture["goals"] = {home:fixture["scores"]["home"]["total"], away:fixture["scores"]["away"]["total"]}
                        listOfFixtures.push(fixture)
                    }
                }else if(sportsID== '2'){
                    const listOfLeagues = await baseball.getBaseballLeagues({"id" : parseInt(key)})
                    const listOfSeasons = listOfLeagues[0]['seasons']
                    let latestSeason = listOfSeasons[0]['season']
                    for(const seasonDict of listOfSeasons){
                        if(seasonDict['season']>latestSeason){
                            latestSeason=seasonDict['season']
                        }
                    }
                    const fixture_response =await baseball.getBaseballGames({'team':clubID,'season':latestSeason,'timezone':userTimezone,'date':date, 'league':key})
                    for(const fixture of fixture_response){
                        fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                        const statusOfMatch = fixture["fixture"]['status']['short']
                        fixture["dateTime"] = fixture["date"]
                        fixture["goals"] = {home:fixture["scores"]["home"]["total"], away:fixture["scores"]["away"]["total"]}
                        listOfFixtures.push(fixture)
                    }
                }else{
                    const listOfLeagues = await hockey.getHockeyLeagues({"id" : parseInt(key)})
                    const listOfSeasons = listOfLeagues[0]['seasons']
                    let latestSeason = listOfSeasons[0]['season']
                    for(const seasonDict of listOfSeasons){
                        if(seasonDict['season']>latestSeason){
                            latestSeason=seasonDict['season']
                        }
                    }
                    const fixture_response =await hockey.getHockeyGames({'team':clubID,'season':latestSeason,'timezone':userTimezone,'date':date, 'league':key})
                    for(const fixture of fixture_response){
                        fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                        const statusOfMatch = fixture["fixture"]['status']['short']
                        fixture["dateTime"] = fixture["date"]
                        fixture["goals"] = {home:fixture["scores"]["home"], away:fixture["scores"]["away"]}
                        listOfFixtures.push(fixture)
                    }
                }
            }
        }
        
        listOfFixtures.sort((a, b) => moment(a["dateTime"]).diff(moment(b["dateTime"])))  
        return{'code':100 ,'response': listOfFixtures}
    }catch(error){
        console.log("Error in getTeamFixture().")
        console.log(error)
        return {"code":200, "error": "Error in getting team fixtures"}
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
async function getTeamResults({db,clubID,sportsID, userTimezone}){
    try{
        let listOfResults = []
        let documentSnapShot = await db
                                           .collection("SportsID")
                                           .doc(sportsID.toString())
                                           .collection("AllClubs")
                                           .doc(clubID.toString())
                                           .get()
        let teamDetails = documentSnapShot.data()
        for(const key of Object.keys(teamDetails['league'])){
            if(sportsID == '0'){
                const seasons_response= await football.getLeaguesSeasons({"id":parseInt(key), "current":true})
                const latestSeason = seasons_response[0]['seasons'][0]['year']
                const fixture_response = await football.getFixtures({"season": latestSeason,"team":clubID,"timezone":userTimezone, 'league':key})
                for(const fixture of fixture_response){
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['fixture']['date']).format('DD/MM')
                    const convertedTime = moment(fixture['fixture']['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["fixture"]["date"]
                    fixture['fixture']['date'] = convertedDate
                    fixture['fixture']['time'] = convertedTime
                    if(statusOfMatch=='FT' || statusOfMatch=='AET'||statusOfMatch=='PEN'){
                        listOfResults.push(fixture)
                    }
                }       
            }else if(sportsID == '1'){
                const listOfLeagues = await basketball.getBasketballLeagues({"id" : parseInt(key)})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await basketball.getBasketballGames({'team':clubID,'season':latestSeason,'timezone':userTimezone, 'league':key})
                for(const fixture of fixture_response){
                    fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime

                    if(statusOfMatch=='FT' || statusOfMatch=='AOT'){
                        fixture["goals"] = {home:fixture["scores"]["home"]["total"], away:fixture["scores"]["away"]["total"]}
                        listOfResults.push(fixture)
                    }
                }
            }else if(sportsID== '2'){
                const listOfLeagues = await baseball.getBaseballLeagues({"id" : parseInt(key)})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await baseball.getBaseballGames({'team':clubID,'season':latestSeason,'timezone':userTimezone, 'league':key})
                for(const fixture of fixture_response){
                    fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime
                    if(statusOfMatch=='FT'){
                        fixture["goals"] = {home:fixture["scores"]["home"]["total"], away:fixture["scores"]["away"]["total"]}
                        listOfResults.push(fixture)
                    }
                }
            }else{
                const listOfLeagues = await hockey.getHockeyLeagues({"id" : parseInt(key)})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await hockey.getHockeyGames({'team':clubID,'season':latestSeason,'timezone':userTimezone, 'league':key})
                for(const fixture of fixture_response){
                    fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime
                    if(statusOfMatch=='FT' || statusOfMatch=='AOT'||statusOfMatch=='AP'){
                        fixture["goals"] = {home:fixture["scores"]["home"], away:fixture["scores"]["away"]}
                        listOfResults.push(fixture)
                    }
                }
            }
        }
        
        listOfResults.sort((a, b) => moment(b["dateTime"]).diff(moment(a["dateTime"])))  
        return{'code':100 ,'response': listOfResults}
    }catch(error){
        console.log("Error in getTeamResults().")
        console.log(error)
        return {"code":200, "error":"Error in get team results"}
    }
}

async function getLeagueStandings({leagueID,sportsID}){
    try{
        let leagueStandingsList
        if(sportsID == '0'){
            const seasons_response= await football.getLeaguesSeasons({"id":leagueID, "current":true})
            const latestSeason = seasons_response[0]['seasons'][0]['year']
            const response = await football.getStandings({'league':leagueID,'season':latestSeason})
            leagueStandingsList = response[0]['league']['standings']
            for (const group of leagueStandingsList){
                
                for (const standings of group){
                    
                    standings["position"]=standings["rank"]
                    let group = {"name": standings["group"]}
                    standings["group"] = {...group}
                    let summary = {"played": standings["all"]["played"], "win":{"total":standings["all"]["win"]}, "lose":{"total":standings["all"]["lose"]}}
                    standings["games"] = {...summary}
                }

            }    
        }else if(sportsID == '1'){
            const listOfLeagues = await basketball.getBasketballLeagues({"id" : leagueID})
            const listOfSeasons = listOfLeagues[0]['seasons']
            let latestSeason = listOfSeasons[0]['season']
            for(const seasonDict of listOfSeasons){
                if(seasonDict['season']>latestSeason){
                    latestSeason=seasonDict['season']
                }
            }
            leagueStandingsList = await basketball.getBasketballLeagueStandings({'league':leagueID,'season':latestSeason})
        }else if(sportsID== '2'){
            const listOfLeagues = await baseball.getBaseballLeagues({"id" : leagueID})
            const listOfSeasons = listOfLeagues[0]['seasons']
            let latestSeason = listOfSeasons[0]['season']
            for(const seasonDict of listOfSeasons){
                if(seasonDict['season']>latestSeason){
                    latestSeason=seasonDict['season']
                }
            }
            leagueStandingsList = await baseball.getBaseballLeagueStandings({'league':leagueID,'season':latestSeason})
        }else{
            const listOfLeagues = await hockey.getHockeyLeagues({"id" : leagueID})
            const listOfSeasons = listOfLeagues[0]['seasons']
            let latestSeason = listOfSeasons[0]['season']
            for(const seasonDict of listOfSeasons){
                if(seasonDict['season']>latestSeason){
                    latestSeason=seasonDict['season']
                }
            }
            leagueStandingsList = await hockey.getHockeyLeagueStandings({'league':leagueID,'season':latestSeason})
        }
        return{'code':100 ,'response': leagueStandingsList}
    }catch(error){
        console.log("Error in getLeagueStandings().")
        console.log(error)
        return {"code":200, "error":"Error in get league standings"}
    }
}

async function getLeagueFixture({leagueID,sportsID,date, userTimezone}){
    try{
        let listOfFixtures = []
        if(date === undefined){
            if(sportsID == '0'){
                const seasons_response= await football.getLeaguesSeasons({"id":leagueID, "current":true})
                const latestSeason = seasons_response[0]['seasons'][0]['year']
                const fixture_response = await football.getFixtures({"season": latestSeason,"league":leagueID,"timezone":userTimezone})
                for(const fixture of fixture_response){
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['fixture']['date']).format('DD/MM')
                    const convertedTime = moment(fixture['fixture']['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["fixture"]["date"]
                    fixture['fixture']['date'] = convertedDate
                    fixture['fixture']['time']=convertedTime
                    if(statusOfMatch=='NS' ||statusOfMatch=='TBD'){
                        listOfFixtures.push(fixture)
                    }
                }  
            }else if(sportsID == '1'){
                const listOfLeagues = await basketball.getBasketballLeagues({"id" : leagueID})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await basketball.getBasketballGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone})
                for(const fixture of fixture_response){
                    fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime
                    if(statusOfMatch=='NS' || statusOfMatch=='POST'){
                        listOfFixtures.push(fixture)
                    }
                }
            }else if(sportsID== '2'){
                const listOfLeagues = await baseball.getBaseballLeagues({"id" : leagueID})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await baseball.getBaseballGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone})
                for(const fixture of fixture_response){
                    fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime
                    if(statusOfMatch=='NS' || statusOfMatch=='POST'){
                        listOfFixtures.push(fixture)
                    }
                }
            }else{
                const listOfLeagues = await hockey.getHockeyLeagues({"id" : leagueID})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await hockey.getHockeyGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone})
                for(const fixture of fixture_response){
                    fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime
                    if(statusOfMatch=='NS' || statusOfMatch=='POST'){
                        listOfFixtures.push(fixture)
                    }
                }
            }
        }else{
            if(sportsID == '0'){
                const seasons_response= await football.getLeaguesSeasons({"id":leagueID, "current":true})
                const latestSeason = seasons_response[0]['seasons'][0]['year']
                const fixture_response = await football.getFixtures({"season": latestSeason,"league":leagueID,"timezone":userTimezone,'date':date})
                for(const fixture of fixture_response){
                    const convertedDate = moment(fixture['fixture']['date']).format('DD/MM')
                    const convertedTime = moment(fixture['fixture']['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["fixture"]["date"]
                    fixture['fixture']['date'] = convertedDate
                    fixture['fixture']['time']=convertedTime
                    listOfFixtures.push(fixture)
                }       
            }else if(sportsID == '1'){
                const listOfLeagues = await basketball.getBasketballLeagues({"id" : leagueID})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await basketball.getBasketballGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone,'date':date})
                for(const fixture of fixture_response){
                    fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime
                    fixture["goals"] = {home:fixture["scores"]["home"]["total"], away:fixture["scores"]["away"]["total"]}
                    listOfFixtures.push(fixture)
                    
                }
            }else if(sportsID== '2'){
                const listOfLeagues = await baseball.getBaseballLeagues({"id" : leagueID})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await baseball.getBaseballGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone,'date':date})
                for(const fixture of fixture_response){
                    fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime
                    fixture["goals"] = {home:fixture["scores"]["home"]["total"], away:fixture["scores"]["away"]["total"]}
                    listOfFixtures.push(fixture)
                }
            }else{
                const listOfLeagues = await hockey.getHockeyLeagues({"id" : leagueID})
                const listOfSeasons = listOfLeagues[0]['seasons']
                let latestSeason = listOfSeasons[0]['season']
                for(const seasonDict of listOfSeasons){
                    if(seasonDict['season']>latestSeason){
                        latestSeason=seasonDict['season']
                    }
                }
                const fixture_response =await hockey.getHockeyGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone,'date':date})
                for(const fixture of fixture_response){
                fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                    const statusOfMatch = fixture["fixture"]['status']['short']
                    const convertedDate = moment(fixture['date']).format('DD/MM')
                    const convertedTime = moment(fixture['date']).format('HH:mm')
                    fixture["dateTime"] = fixture["date"]
                    fixture["fixture"]['date'] = convertedDate
                    fixture["fixture"]['time'] = convertedTime
                    fixture["goals"] = {home:fixture["scores"]["home"], away:fixture["scores"]["away"]}
                    listOfFixtures.push(fixture)
                }
            }
        }
        listOfFixtures.sort((a, b) => moment(a["dateTime"]).diff(moment(b["dateTime"])))  
        return{'code' : 100 ,'response':listOfFixtures}
    }catch(error){
        console.log("Error in getLeagueFixture().")
        console.log(error)
        return{'code':200 ,'error':"Error retrieving data."}
    }
   
}

async function getLeagueResults({leagueID,sportsID, userTimezone}){
    try{
        let listOfResults = []
        if(sportsID == '0'){
            const seasons_response= await football.getLeaguesSeasons({"id":leagueID, "current":true})
            const latestSeason = seasons_response[0]['seasons'][0]['year']
            const fixture_response = await football.getFixtures({"season": latestSeason,"league":leagueID,"timezone":userTimezone})
            for(const fixture of fixture_response){
                const statusOfMatch = fixture["fixture"]['status']['short']
                const convertedDate = moment(fixture['fixture']['date']).format('DD/MM')
                const convertedTime = moment(fixture['fixture']['date']).format('HH:mm')
                fixture["dateTime"] = fixture["fixture"]["date"]
                fixture['fixture']['date'] = convertedDate
                fixture['fixture']['time']=convertedTime
                if(statusOfMatch=='FT' || statusOfMatch=='AET'||statusOfMatch=='PEN'){
                    listOfResults.push(fixture)
                }
            }       
        }else if(sportsID == '1'){
            const listOfLeagues = await basketball.getBasketballLeagues({"id" : leagueID})
            const listOfSeasons = listOfLeagues[0]['seasons']
            let latestSeason = listOfSeasons[0]['season']
            for(const seasonDict of listOfSeasons){
                if(seasonDict['season']>latestSeason){
                    latestSeason=seasonDict['season']
                }
            }
            const fixture_response =await basketball.getBasketballGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone})
            for(const fixture of fixture_response){
                fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                const statusOfMatch = fixture["fixture"]['status']['short']
                const convertedDate = moment(fixture['date']).format('DD/MM')
                const convertedTime = moment(fixture['date']).format('HH:mm')
                fixture["dateTime"] = fixture["date"]
                fixture["fixture"]['date'] = convertedDate
                fixture["fixture"]['time'] = convertedTime
                if(statusOfMatch=='FT' || statusOfMatch=='AOT'){
                    fixture["goals"] = {home:fixture["scores"]["home"]["total"], away:fixture["scores"]["away"]["total"]}
                    listOfResults.push(fixture)
                }
            }
        }else if(sportsID== '2'){
            const listOfLeagues = await baseball.getBaseballLeagues({"id" : leagueID})
            const listOfSeasons = listOfLeagues[0]['seasons']
            let latestSeason = listOfSeasons[0]['season']
            for(const seasonDict of listOfSeasons){
                if(seasonDict['season']>latestSeason){
                    latestSeason=seasonDict['season']
                }
            }
            const fixture_response =await baseball.getBaseballGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone})
            for(const fixture of fixture_response){
                fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                const statusOfMatch = fixture["fixture"]['status']['short']
                const convertedDate = moment(fixture['date']).format('DD/MM')
                const convertedTime = moment(fixture['date']).format('HH:mm')
                fixture["dateTime"] = fixture["date"]
                fixture["fixture"]['date'] = convertedDate
                fixture["fixture"]['time'] = convertedTime
                if(statusOfMatch=='FT'){
                    fixture["goals"] = {home:fixture["scores"]["home"]["total"], away:fixture["scores"]["away"]["total"]}
                    listOfResults.push(fixture)
                }
            }
        }else{
            const listOfLeagues = await hockey.getHockeyLeagues({"id" : leagueID})
            const listOfSeasons = listOfLeagues[0]['seasons']
            let latestSeason = listOfSeasons[0]['season']
            for(const seasonDict of listOfSeasons){
                if(seasonDict['season']>latestSeason){
                    latestSeason=seasonDict['season']
                }
            }
            const fixture_response =await hockey.getHockeyGames({'league':leagueID,'season':latestSeason,'timezone':userTimezone})
            for(const fixture of fixture_response){
                fixture["fixture"] = {id:fixture["id"], date:fixture["date"], status:{...fixture["status"]}}
                const statusOfMatch = fixture["fixture"]['status']['short']
                const convertedDate = moment(fixture['date']).format('DD/MM')
                const convertedTime = moment(fixture['date']).format('HH:mm')
                fixture["dateTime"] = fixture["date"]
                fixture["fixture"]['date'] = convertedDate
                fixture["fixture"]['time'] = convertedTime
                if(statusOfMatch=='FT' || statusOfMatch=='AOT'||statusOfMatch=='AP'){
                    fixture["goals"] = {home:fixture["scores"]["home"], away:fixture["scores"]["away"]}
                    listOfResults.push(fixture)
                }
            }
        }
        listOfResults.sort((a, b) => moment(b["dateTime"]).diff(moment(a["dateTime"])))
        return {'code':100 ,'response': listOfResults}
    }catch(error){
        console.log("Error in getLeagueFixture().")
        console.log(error)
        return{'code':200 ,'error':"Error in get league results"}
    }
}

module.exports = {getGameDetails,getLeagueFixture,getLeagueResults,getLeagueStandings, getTeamFixture,getTeamResults}