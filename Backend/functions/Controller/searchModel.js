const football = require("../API/API Football")
const basketball = require("../API/API Basketball")
const baseball = require("../API/API Baseball")
const hockey = require("../API/API Hockey")

// For sorting list of dictionary based on name 
function compare( a, b ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

  async function retrieveAllSportsID({db}){
    try{
        const snap=await db
              .collection("SportsID")
              .get()
        
        data={}
        snap.docs.map(doc=>{data[doc.id]= doc.data()})
        return {'code':100,'response':data}
    }catch(error){
        return{'code':200,'error':'Error retrieving All SportsID.'}
    }
    
}

async function searchLeagueAndClub({db,text,sportsID}){
    try{
        if(text.length>=3){
            let querySnapshot = await db
                                    .collection("SportsID")
                                    .doc(sportsID.toString())
                                    .collection("AllLeagues")
                                    .orderBy('name')
                                    .startAt(text)
                                    .endAt(text+"\uf8ff")
                                    .get()
        
            let listOfDocuments = querySnapshot.docs
            
            let listOfSearchResults=[]
            for(const value of listOfDocuments){
                const leagueDetails = value.data()
                listOfSearchResults.push({"id": value.id, 'type':leagueDetails['type'],'logo': leagueDetails['logo'],'name':leagueDetails['name']})
            }
            querySnapshot = await db
                                .collection("SportsID")
                                .doc(sportsID.toString())
                                .collection("AllClubs")
                                .orderBy('name')
                                .startAt(text)
                                .endAt(text + '\uf8ff')
                                .get()
            listOfDocuments = querySnapshot.docs
            for(const value of listOfDocuments){
                const clubDetails = value.data()
                listOfSearchResults.push({"id": value.id, 'type':clubDetails['type'],'logo': clubDetails['logo'],'name':clubDetails['name']})
            }                      
            listOfSearchResults.sort(compare)
            return{'code':100 , 'response': listOfSearchResults}
        }else{
            return{'code': 200 ,'response': [], "error":"Error occured while searching"}
        }
        
        
           
    }catch(error){
        console.log("Error in searchLeagueAndClub() function")
        console.log(error)
        
        return{'code': 200 ,'response': [], "error":"Error occured while searching"}
    }
}

async function searchLeague({db,text, sportsID}){
    try{
        if(text.length>=3){
            let querySnapshot = await db
                                    .collection("SportsID")
                                    .doc(sportsID.toString())
                                    .collection("AllLeagues")
                                    .orderBy('name')
                                    .startAt(text)
                                    .endAt(text+"\uf8ff")
                                    .get()
        
            let listOfDocuments = querySnapshot.docs
            
            let listOfSearchResults=[]
            for(const value of listOfDocuments){
                const leagueDetails = value.data()
                listOfSearchResults.push({"id": value.id, 'type':leagueDetails['type'],'logo': leagueDetails['logo'],'name':leagueDetails['name']})
            }
            listOfSearchResults.sort(compare)
            return{'code':100 , 'response': listOfSearchResults}
        }else{
            return{'code': 200 ,'response': [], "error":"Error occured while searching"}
        }
        
    }catch(error){
        console.log("Error in searchLeague() function")
        console.log(error)
        
        return{'code': 200 ,'response': [], "error":"Error occured while searching"}
    }
}

async function searchClub({db,text, sportsID}){
    try{
        if(text.length>=3){
            let listOfSearchResults=[]
            querySnapshot = await db
                                .collection("SportsID")
                                .doc(sportsID.toString())
                                .collection("AllClubs")
                                .orderBy('name')
                                .startAt(text)
                                .endAt(text + '\uf8ff')
                                .get()
            listOfDocuments = querySnapshot.docs
            for(const value of listOfDocuments){
                const clubDetails = value.data()
                listOfSearchResults.push({"id": value.id, 'type':clubDetails['type'],'logo': clubDetails['logo'],'name':clubDetails['name'], 
                                            "leagueName":clubDetails["leagueName"], "leagueID":clubDetails["leagueID"]})
            }                      
            listOfSearchResults.sort(compare)
            return{'code':100 , 'response': listOfSearchResults}
        }else{
            return{'code': 200 ,'response': [], "error":"Error occured while searching"}
        }
        
        
           
    }catch(error){
        console.log("Error in searchLeagueAndClub() function")
        console.log(error)
        
        return{'code': 200 ,'response': [], "error":"Error occured while searching"}
    }
}


module.exports = {searchClub, searchLeague,searchLeagueAndClub, retrieveAllSportsID}

// async function createAllFootballLeagueClubDB(){
//     try{
//         let listOfLeagues = await getLeagues({})
//         // console.log(listOfLeagues)
//         // for(let i=0;i<listOfLeagues.length;i++){
//         //     const leagueDetails = listOfLeagues[i]['league']
//         //     await firestore()
//         //           .collection("SportsID")
//         //           .doc("0")
//         //           .collection("AllLeagues")
//         //           .doc(leagueDetails['id'].toString())
//         //           .set({
//         //             "name" : leagueDetails['name'],
//         //             "type" : "league",
//         //             "logo" : leagueDetails['logo']
//         //           })
//         // }
        
//         let teamList = []
//         for(let i=1;i<=listOfLeagues.length;i++){
//             console.log("LeagueID")
//             console.log(i)
//             const seasons_response= await getLeaguesSeasons({"id":i, "current":true})
//             const leagueName = seasons_response[0]['league']['name']
//             const team = await getTeam({"league" : i, "season": seasons_response[0]['seasons'][0]["year"]})
//             for (let j=0; j<team.length;j++){
//                 let clubDetails = team[j]
//                 let clubID = team[j]['team']['id'].toString()
//                 console.log(clubID)
//                 const doc = await firestore()
//                                         .collection("SportsID")
//                                         .doc("0")
//                                         .collection("AllClubs")
//                                         .doc(clubID)
//                                         .get()
//                 if(doc.exists){
//                     const data = doc.data()
                   
//                     let leagueDict = data['league']
//                     leagueDict[i.toString()] = leagueName
//                     await firestore()
//                             .collection('SportsID')
//                             .doc('0')
//                             .collection("AllClubs")
//                             .doc(clubID)
//                             .update({
//                                 'league':leagueDict
//                             })
                    
//                 }else{
//                     let data ={}
//                     data['name'] = clubDetails['team']['name']
//                     data['logo'] = clubDetails['team']['logo']
//                     data['type'] = 'club'
//                     data['league'] = {}
//                     data['league'][i.toString()]= leagueName
//                     await firestore()
//                         .collection("SportsID")
//                         .doc("0")
//                         .collection("AllClubs")
//                         .doc(clubID)
//                         .set(data)
//                 }
//                 if((teamList.includes(parseInt(clubID))==false)){
//                     teamList.push(parseInt(clubDetails['id']))
//                 }
//             }
//             console.log("Missing Ids")
//             let max = Math.max(teamList)
//             for(let k=1;k<=max;k++){
//                 if(teamList.indexOf(k)=== -1){
//                     console.log(k)
//                 }   
//             }
//         }
//         return {'code' : 100, 'response':'Successfully created database for all leagues and club.'}
//     }catch(error){
//         console.log("Error in createAllFootballLeagueClubDB()")
//         console.log(error)
//         return{'code':200 ,'response':'Error creating database to store all leagues and clubs.'}
//     }
// }

// async function createAllBasketballLeagueClubDB(){
//     try{
//         let listOfLeagues = await getBasketballLeagues({})
//         // for(let i=0;i<listOfLeagues.length;i++){
//         //     const leagueDetails = listOfLeagues[i]
//         //     console.log(leagueDetails['id'])
//         //     await firestore()
//         //           .collection("SportsID")
//         //           .doc("1")
//         //           .collection("AllLeagues")
//         //           .doc(leagueDetails['id'].toString())
//         //           .set({
//         //             "name" : leagueDetails['name'],
//         //             "type" : "league",
//         //             "logo" : leagueDetails['logo']
//         //           })
            
//         // }
//         let teamList = []
//         for(let i=1;i<=listOfLeagues.length;i++){
//             console.log("LeagueID")
//             console.log(i)
//             const listOfLeagues = await getBasketballLeagues({"id" : i})
//             const listOfSeasons = listOfLeagues[0]['seasons']
//             let latestSeason = listOfSeasons[0]['season']
//             const leagueName = listOfLeagues[0]['name']
//             for(const seasonDict of listOfSeasons){
//                 if(seasonDict['season']>latestSeason){
//                     latestSeason=seasonDict['season']
//                 }
//             }
//             const team = await getBasketballTeams({'season': latestSeason , 'league' : i})
//             for (let j=0; j<team.length;j++){
//                 const clubDetails = team[j]
//                 console.log(clubDetails["id"])
//                 const doc = await firestore()
//                         .collection("SportsID")
//                         .doc("1")
//                         .collection("AllClubs")
//                         .doc(clubDetails['id'].toString())
//                         .get()  

//                     if(doc.exists){
//                         const data = doc.data()
                        
//                         let leagueDict = data['league']
//                         leagueDict[i.toString()] = leagueName
//                         await firestore()
//                         .collection("SportsID")
//                         .doc("1")
//                         .collection("AllClubs")
//                         .doc(clubDetails['id'].toString())
//                         .update({
//                             'league': leagueDict
//                         })
                        
//                     }else{
//                         let data ={}
//                         data['name'] = clubDetails['name']
//                         data['logo'] = clubDetails['logo']
//                         data['type'] = 'club'
//                         data['league'] = {}
//                         data['league'][i.toString()]= leagueName
//                         await firestore()
//                         .collection("SportsID")
//                         .doc("1")
//                         .collection("AllClubs")
//                         .doc(clubDetails['id'].toString())
//                         .set(data)
//                     }
//                     if((teamList.includes(parseInt(clubDetails['id']))==false)){
//                         teamList.push(parseInt(clubDetails['id']))
//                     } 
//             }
//         }
//         console.log("Missing Ids")
//         let max = Math.max(...teamList)
//         for(let k=1;k<=max;k++){
//             if(teamList.indexOf(k)=== -1){
//                 console.log(k)
//             }   
//         }
//         return {'code' : 100, 'response':'Successfully created database for all leagues and club.'}
//     }catch(error){
//         console.log("Error in createAllBasketballLeagueClubDB()")
//         console.log(error)
//         return{'code':200 ,'response':'Error creating database to store all leagues and clubs.'}
//     }
// }

// async function createAllBaseballLeagueClubDB(){
//     try{
//         let listOfLeagues = await getBaseballLeagues({})
//         // for(let i=0;i<listOfLeagues.length;i++){
//         //         const leagueDetails = listOfLeagues[i]
//         //         console.log(leagueDetails['id'])
//         //         await firestore()
//         //             .collection("SportsID")
//         //             .doc("2")
//         //             .collection("AllLeagues")
//         //             .doc(leagueDetails['id'].toString())
//         //             .set({
//         //                 "name" : leagueDetails['name'],
//         //                 "type" : "league",
//         //                 "logo" : leagueDetails['logo']
//         //             })
//         // }
//         let teamList = []
//         for(let i=1 ; i<=listOfLeagues.length;i++){
//             console.log("League id")
//             console.log(i)
//             const listOfTeams = await getBaseballLeagues({"id" : i})
//             const listOfSeasons = listOfTeams[0]['seasons']
//             let latestSeason = listOfSeasons[0]['season']
//             const leagueName = listOfTeams[0]['name']
//             console.log(listOfSeasons)
//             for(const seasonDict of listOfSeasons){
//                 if(seasonDict['season']>latestSeason){
//                     latestSeason=seasonDict['season']
//                 }
//             }
//             console.log(latestSeason)
//             const team = await getBaseballTeams({'season': latestSeason , 'league' : i})
//             console.log(team)
//             for (let j=0; j<team.length;j++){
//                 const clubDetails = team[j]
//                 console.log(clubDetails["id"])
//                 const doc = await firestore()
//                                 .collection("SportsID")
//                                 .doc("2")
//                                 .collection("AllClubs")
//                                 .doc(clubDetails['id'].toString())
//                                 .get()
//                 if(doc.exists){
//                     const data = doc.data()
//                     let leagueDict = data['league']
//                     leagueDict[i.toString()] = leagueName
//                     await firestore()
//                     .collection("SportsID")
//                     .doc("2")
//                     .collection("AllClubs")
//                     .doc(clubDetails['id'].toString())
//                     .update({
//                         'league': leagueDict
//                     })
//                 }else{
//                     let data ={}
//                     data['name'] = clubDetails['name']
//                     data['logo'] = clubDetails['logo']
//                     data['type'] = 'club'
//                     data['league'] = {}
//                     data['league'][i.toString()]= leagueName
//                     await firestore()
//                     .collection("SportsID")
//                     .doc("2")
//                     .collection("AllClubs")
//                     .doc(clubDetails['id'].toString())
//                     .set(data)
//                 }
//                 if((teamList.includes(parseInt(clubDetails['id']))==false)){
//                     teamList.push(parseInt(clubDetails['id']))
//                 }
//             }
            
//         }
//         console.log("Missing Ids")
//         let max = Math.max(...teamList)
//         console.log(max)
//         for(let k=1;k<=max;k++){
//             if(teamList.indexOf(k)=== -1){
//                 console.log(k)
//             }   
//         }
        
//         return {'code' : 100, 'response':'Successfully created database for all leagues and club.'}
//     }catch(error){
//         console.log("Error in createAllBaseballLeagueClubDB()")
//         console.log(error)
//         return{'code':200 ,'response':'Error creating database to store all leagues and clubs.'}
//     }
// }

// async function createAllHockeyLeagueClubDB(){
//     try{
//         let listOfLeagues = await getHockeyLeagues({})
//         // for(let i=0;i<listOfLeagues.length;i++){
//         //         const leagueDetails = listOfLeagues[i]
//         //         console.log(leagueDetails['id'])
//         //         await firestore()
//         //             .collection("SportsID")
//         //             .doc("3")
//         //             .collection("AllLeagues")
//         //             .doc(leagueDetails['id'].toString())
//         //             .set({
//         //                 "name" : leagueDetails['name'],
//         //                 "type" : "league",
//         //                 "logo" : leagueDetails['logo']
//         //             })
//         // }
//         let teamList = []
//         for(let i=1 ; i<=listOfLeagues.length;i++){
//             console.log("League id")
//             console.log(i)
//             const listOfLeagues = await getHockeyLeagues({"id" : i})
//             const listOfSeasons = listOfLeagues[0]['seasons']
//             let latestSeason = listOfSeasons[0]['season']
//             const leagueName = listOfLeagues[0]['name']
//             for(const seasonDict of listOfSeasons){
//                 if(seasonDict['season']>latestSeason){
//                     latestSeason=seasonDict['season']
//                 }
//             }
//             const team = await getHockeyTeams({'season': latestSeason , 'league' : i})
//             for (let j=0; j<team.length;j++){
//                 const clubDetails = team[j]
//                 console.log(clubDetails["id"])
//                 const doc = await firestore()
//                                 .collection("SportsID")
//                                 .doc("3")
//                                 .collection("AllClubs")
//                                 .doc(clubDetails['id'].toString())
//                                 .get()
//                 if (doc.exists){
//                     const data = doc.data()
//                     let leagueDict = data['league']
//                     leagueDict[i.toString()] = leagueName
//                     await firestore()
//                     .collection("SportsID")
//                     .doc("3")
//                     .collection("AllClubs")
//                     .doc(clubDetails['id'].toString())
//                     .update({
//                         'league': leagueDict
//                     })
//                 }else{
//                     let data = {}
//                     data['name'] = clubDetails['name']
//                     data['logo'] = clubDetails['logo']
//                     data['type'] = 'club'
//                     data['league'] = {}
//                     data['league'][i.toString()]= leagueName
//                     await firestore()
//                         .collection("SportsID")
//                         .doc("3")
//                         .collection("AllClubs")
//                         .doc(clubDetails['id'].toString())
//                         .set(data)
//                 }

//                 if((teamList.includes(parseInt(clubDetails['id']))==false)){
//                     teamList.push(parseInt(clubDetails['id']))
//                 }
            
//             }
            
//             console.log("Missing Ids")
//             let max = Math.max(teamList)
//             for(let k=1;k<=max;i++){
//                 if(teamList.indexOf(k)=== -1){
//                     console.log(k)
//                 }   
//             }
//         }
//         return {'code' : 100, 'response':'Successfully created database for all leagues and club.'}
//     }catch(error){
//         console.log("Error in createAllHockeyLeagueClubDB()")
//         console.log(error)
//         return{'code':200 ,'response':'Error creating database to store all leagues and clubs.'}
//     }
// }
