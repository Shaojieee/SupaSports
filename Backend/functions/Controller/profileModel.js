const {FieldValue} = require('firebase-admin/firestore')



async function getUserDetails({db,UID}){
    try{
      const userDetails = await db
                                .collection("Users")
                                .doc(UID)
                                .get()
                                
      const details = userDetails.data()                    
      return {'code':100, 'response':{UID: UID,
              DisplayName: details["DisplayName"],
              Username: details["Username"],
              NumFollowers : details["Follower"].length,
              NumFollowing : details["Following"].length
                }
            }

    }catch(error){
      console.log('Error in getUserDetails()')
      console.log(error)
      return {'code':200,'error':'Error retrieving UserDetails'}
    }
      
  
}
  
async function getOtherUserDetails({db, otherUID,UID}){
    try{
        const otherUserDetails = await db
                              .collection("Users")
                              .doc(otherUID)
                              .get()
        if(otherUserDetails.data()['Username']==="User no longer exists"){
            return{'code':300,'response':{UID:otherUID,
                                       displayName: otherUserDetails.data()['DisplayName'],
                                       userName:otherUserDetails.data()['Username'],
                                       NumFollowers:0,
                                       NumFollowing:0,
                                       FollowedStatus:false},'error':"User no longer exists."}
        }else{
            let followedStatus
            if(otherUserDetails.data()['Follower'].includes(UID)){
                followedStatus= true
            }else{
                followedStatus = false
            }
              return { 'code':100 , 'response':{UID : otherUID,
                  displayName : otherUserDetails.data()['DisplayName'],
                  userName : otherUserDetails.data()["Username"],
                  NumFollowers : otherUserDetails.data()['Follower'].length,
                  NumFollowing : otherUserDetails.data()["Following"].length,
                  FollowedStatus : followedStatus}}
        }
            
      }catch(error){
        console.log('Error in getOtherUserDetails()')
        console.log(error)
        return{'code':200,'error':'Error retrieving other user details.','response':{UID:otherUID,
            displayName: "Error",
            userName:"Error",
            NumFollowers:0,
            NumFollowing:0,
            FollowedStatus:false}} 
      }
}

async function getUserFollowerFollowing({db,UID}){
    try{
        let userDoc = await db.collection('Users').doc(UID).get()
        if(userDoc.data()['Username']==="User no longer exists"){
            return{'code':100,'response':{follower:{},following:{}}}
        }
        let listOfFollowing = userDoc.data()['Following']
        let listOfFollower = userDoc.data()['Follower']
        let data = {follower:{},following:{}}
        let displayName
        let userName
        for(const followingUID of listOfFollowing){
            const followingDoc = await db.collection('Users').doc(followingUID).get()
            displayName = followingDoc.data()['DisplayName']
            userName = followingDoc.data()['Username']
            data['following'][followingUID] = {'displayName':displayName}
            data['following'][followingUID]['userName'] = userName
        }
        for(const followerUID of listOfFollower){
            const followerDoc = await db.collection('Users').doc(followerUID).get()
            displayName = followerDoc.data()['DisplayName']
            userName = followerDoc.data()['Username']
            data['follower'][followerUID] = {'displayName':displayName}
            data['follower'][followerUID]['userName'] = userName
        }
        return {'code':100,'response':data}
    }catch(error){
        console.log("Error in getUserFollowerFollowing.")
        console.log(error)
        return{'code':200,'response':{follower:{},following:{}}}
    }

}
async function followUser({db,followeeUID,followerUID}){
    try{
        
        await db //Adding followeeUID to exisitng list of UID that current user is Following
            .collection("Users")
            .doc(followerUID)
            .update({
                Following: FieldValue.arrayUnion(followeeUID)
            })
        await db
            .collection("Users") // Adding followerUID to list of UID of the person that is followed by current user
            .doc(followeeUID)
            .update({
                Follower: FieldValue.arrayUnion(followerUID)
            })
        return {"code" : 100, "response": "Successfully followed user."}
          
    }catch(error){
        console.log("Error in followUser()")
        console.log(error)
        return {"code" : 200, "error": "Unable to follow user, try again later."}
    }
}


async function unFollowUser({db,followeeUID,unFollowerUID}){
    
    try{
        await db
            .collection("Users")
            .doc(unFollowerUID)
            .update({
                Following: FieldValue.arrayRemove(followeeUID)
            })
        
        await db
            .collection("Users")
            .doc(followeeUID)
            .update({
                Follower: FieldValue.arrayRemove(unFollowerUID)
            })
        return {"code" : 100, "response": "Successfully unfollowed user."}
    }catch(error){
        console.log("Error in unFollowUser()")
        console.log(error)
        return {"code" : 200, "error": "Unable to unfollow user, try again later."}
    }
    
}

async function searchUserProfile({db,username}){
    try{
        const q= await db
                       .collection('Users')
                       .orderBy("Username")
                       .startAt(username)
                       .endAt(username+"\uf8ff")
                       .get()
        data={}
        for (const values of q.docs){
            const details = values.data()
            data[values.id] = {"Displayname": details['DisplayName'],"Username": details["Username"]}
        }

        return{'code':100, 'response': data}
               
    }catch(error){
        console.log("Error in searchUserProfile function")
        console.log(error)
        return{'code':200,'error':'Error searching for user.'}
    }
}

async function storePushNotifToken({db, UID,token}){
    try{

        await db
            .collection('Users')
            .doc(UID)
            .update({
                "token":token["token"]
            })
        return {"code":100}
    }catch(error){
        console.log("Error in storePushNotifToken function")
        console.log(error)
        return{'code':200}
    }
}

module.exports = {searchUserProfile,getOtherUserDetails,getUserDetails,followUser,unFollowUser,getUserFollowerFollowing, storePushNotifToken}