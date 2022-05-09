const SearchProvider = require("./searchModel")

//Need update
async function setUpFavourites({db, favouriteDict,UID}){
    try{
         await db
               .collection("Users")
               .doc(UID)
               .update({
                   "Favourite" : favouriteDict
               })
        return{'code':100 ,'response':'User has set up favourites.'}
    }catch(error){
        return{'code':200 , 'error': 'Error setting up user favourites'}
    }
    
}

async function updateFavourites({db,sportsID,type,id,UID,data}){
    try{
        const documentSnapshot= await db
                                .collection("Users")
                                .doc(UID)
                                .get()
        let favouriteDetails = documentSnapshot.data()
        let updated 
        let response
        if(!favouriteDetails['Favourite'][sportsID][type].hasOwnProperty(id.toString())){
            favouriteDetails['Favourite'][sportsID][type][id.toString()]= data
            updated = {...favouriteDetails["Favourite"]}
            response = true
        }else{
            delete favouriteDetails['Favourite'][sportsID][type][id.toString()]
            updated = {...favouriteDetails["Favourite"]}
            response =false
        }
        await db
            .collection('Users')
            .doc(UID)
            .update({
            "Favourite" : updated
        })
        return{'code':100 ,'response':response}
    }catch(error){
        console.log("Error in updateFavourites().")
        console.log(error)
        return{'code':200 , 'error': 'Error updating user favourites'}
    }
    
}



//Need change
//Check with AllSportsID to see if any new sports added. If true add an empty key value pair to current user's favourites dict and return it
async function retrieveFavourites({db,UID}){
    try{
        const snap = await db
        .collection("Users")
        .doc(UID)
        .get()
        
        const data =snap.data()
        let userFavourites_dict
        if (!data.hasOwnProperty("Favourite")){
            userFavourites_dict = {}
        }else{
            userFavourites_dict = data["Favourite"]
        }                   
        
        const response = await SearchProvider.retrieveAllSportsID({db})
        if(response['code']==100){
            const allFavourites_dict = response['response']
            let added = false
            for(const key of Object.keys(allFavourites_dict)){
                if(!(key in userFavourites_dict)){
                    added=true
                    userFavourites_dict[key]= {league:{},club:{}}
                }
            }
            if (added){
                await db
                      .collection("Users")
                      .doc(UID)
                      .update({
                          "Favourite" : userFavourites_dict
                      })
            }
            return {'code':100 ,'response':userFavourites_dict}
        }else{
            return {'code':200,'error':response['error'], "response":{"0":{"league":{},"club":{}},"1":{"league":{},"club":{}},"2":{"league":{},"club":{}},"3":{"league":{},"club":{}}}}
        }
    }catch(error){
        console.log("Error retrieving favourites")
        console.log(error)
        return {'code':200 , 'error': 'Error retrieving user favourites.', "response":{"0":{"league":{},"club":{}},"1":{"league":{},"club":{}},"2":{"league":{},"club":{}},"3":{"league":{},"club":{}}}}
    }
}

module.exports = {setUpFavourites, updateFavourites, retrieveFavourites}
