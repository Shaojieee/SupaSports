const {FieldValue} =require('firebase-admin/firestore')

async function createPost({db,sportsID,text,UID}){
    try{
        let data ={}
        const userDoc = await db.collection('Users').doc(UID).get()
        const displayName = userDoc.data()['DisplayName']
        let postData ={UID : UID, //UserID obtained through asyncstorage or through currentUserState in redux
                    UsersDisliked : [],
                    UsersLiked : [],
                    SportsID : sportsID,
                    Text : text,
                    NumLikes : 0,
                    NumDislikes : 0,
                    Date : FieldValue.serverTimestamp(),
                    NumComments:0}
        const doc = await db
                    .collection('Posts')
                    .add(postData)
        const postID = doc.id
        postData['DisplayName']= displayName
        postData['ownUser']=true
        postData['Liked']=false
        postData['Disliked']=false
        postData["Comments"] = {}
        postData["Date"] = "Just Now"
        data[postID]=postData
        return{'code':100 , 'response': data}
    }catch(error){
        console.log("Error in createPost")
        console.log(error)
        return{'code':200 , 'error': 'Error Creating Post.'}
    }
    
}

async function sendNotif({db, admin, UID, postID, sportsID}){
    try{
        const userDoc = await db.collection('Users').doc(UID).get()
        const userName = userDoc.data()["Username"]
        const followerList = userDoc.data()["Follower"]
        let messages = []
        body = userName + " has just made a new post! Comment on it now!"
        for(const followerUID of followerList){
            const followerDoc = await db.collection("Users")
                                        .doc(followerUID)
                                        .get()
            if (followerDoc.data().hasOwnProperty("token")){
                const followerToken = followerDoc.data()["token"]
                if (followerToken==""){
                    continue
                }
                console.log(followerToken)
                const message ={
                    token: followerToken,
                    notification:{
                        body:body,
                        title:"SupaSports"
                    }, 
                    data:{
                        postID,
                        sportsID
                    }
                }
                messages.push(message)
            }
        }
        admin.messaging().sendAll(messages)
    }catch(error){
        console.log("Error in sending notification")
        console.log(error)
    }
}


async function deletePost({db,postID}){
    try{
        await db
          .collection('Posts')
          .doc(postID)
          .delete()
          return{'code':100, 'response': 'Post deleted succesfully.'}
    }catch(error){
        return{'code':200,'error':"Error deleting post."}
    }
          
}

async function displayPosts({db,sportsID, UID, userTimezone}){
    try{
        const listOfDocs = await db
                      .collection("Posts")
                      .orderBy('Date','desc')
                      .where("SportsID",'in',[sportsID])
                      .get()
        if(listOfDocs.size == 0){
            return {'code':100 , 'response': {}}
        }else{
            data={}
            let timeDiff
            let postTime
            let today
            for(const details of listOfDocs.docs){
                const value = details.data()
                const userDetails = await db.collection("Users").doc(value['UID']).get()
                const displayName = userDetails.data()["DisplayName"]
                value["DisplayName"]= displayName
                postTime = value['Date']
                today= new Date()
                timeDiff = today - postTime.toDate()
                console.log(timeDiff)
                if(timeDiff<3600000){
                    value['Date'] = Math.floor((timeDiff/60000)).toString()+" mins ago"
                }else if(timeDiff<86400000){
                    value['Date'] = Math.floor((timeDiff/3600000)).toString() +' hours ago'
                }else{
                    value['Date'] = Math.floor((timeDiff/86400000)).toString() + ' days ago'
                }
                console.log(value['Date'])
                if(UID == value["UID"]){
                    value["ownUser"]= true
                }else{
                    value["ownUser"]=false
                }
                if(value["UsersLiked"].includes(UID)){
                    value["Liked"]=true
                }else{
                    value["Liked"]=false
                    if(value["UsersDisliked"].includes(UID)){
                        value["Disliked"]=true
                    }else{
                        value["Disliked"]=false
                    }
                }
                
                delete value["UsersDisliked"]
                delete value["UsersLiked"]
                
                data[details.id] = {...value, "Comments":{}}
            }
            return{'code':100, 'response':data}
        }
    }catch(error){
        console.log("Error in displayMostRelevantPost()")
        console.log(error)
        return {'code':200,'error':'Error retrieving most relevant post.', "response":{}} 
    }
}

async function displayUserPosts({db,UID}){
    try{
        const userDetails = await db.collection("Users").doc(UID).get()
        const querySnapshot = await db
                                    .collection('Posts')
                                    .orderBy("Date",'desc')
                                    .where("UID", 'in', [UID] )
                                    .get()
        if (querySnapshot.size == 0){
            return{'code': 100 , 'response' : {}}
        }else{
            data={}
            for(const details of querySnapshot.docs){
                const value = details.data()
                value["DisplayName"]= userDetails.data()["DisplayName"]
                value["ownUser"] = true
                if(value["UsersLiked"].includes(UID)){
                    value["Liked"]=true
                }else{
                    value["Liked"]=false
                }
                if(value["UsersDisliked"].includes(UID)){
                    value["Disliked"]=true
                }else{
                    value["Disliked"]=false
                }
                delete value["UsersDisliked"]
                delete value["UsersLiked"]
                
                data[details.id] = {...value, "Comments":{}}
            }
            return{'code' : 100 , 'response' : data}
        }
        
        }catch(error){
            console.log("Error in displayUserPosts().")
            console.log(error)
            return{'code' : 200 , 'error': "Error in displaying all user's post."}
        }
    
                                
}

async function editPost({db,text,postID}){
    try{
        await db
            .collection('Posts')
            .doc(postID)
            .update({
                Text : text
            })
        
        let data = {}
        const documentSnaphot = await db.collection('Posts').doc(postID).get()
        let postData = documentSnaphot.data()
        const userDoc = await db.collection("Users").doc(postData['UID']).get()
        const displayName = userDoc.data()['DisplayName']
        postData['ownUser']=true
        postData['DisplayName']= displayName
        const UID = postData['UID']
        if(postData['UsersLiked'].includes(UID)){
            postData['Liked']=true
        }else{
            postData['Liked']=false
            if(postData['UsersDisliked'].includes(UID)){
                postData['Disliked']=true
            }else{
                postData['Disliked']=false
            }
        }
        data[postID]=postData
        return {"code":100, "response": data}
    }catch(error){
        console.log('Error in editPost')
        console.log(error)
        return  {"code":200, "error": "Error in updating post"}

    }
                      
    
}

async function checkLiked({db,postID,UID}){
    try{
        const response = await db
                         .collection("Posts")
                         .doc(postID)
                         .get()
        const postDetails = response.data()
        if(postDetails["UsersLiked"].includes(UID)){
            return true
        }else{
            return false
        }
    }catch(error){
        console.log("Error in checkLiked().")
        console.log(error)
    }
}

async function checkDisliked({db,postID,UID}){
    try{
        const response = await db
                         .collection("Posts")
                         .doc(postID)
                         .get()
        const postDetails = response.data()
        if(postDetails["UsersDisliked"].includes(UID)){
            return true
        }else{
            return false
        }
    }catch(error){
        console.log("Error in checkDisliked().")
        console.log(error)
    }
}

async function likePost({db,postID,UID}){
    try{
        const previouslyLiked = await checkLiked({db,postID,UID})
        const previouslyDisliked = await checkDisliked({db,postID,UID})
        if(previouslyLiked){
            await db
                .collection("Posts")
                .doc(postID)
                .update({
                    NumLikes: FieldValue.increment(-1),
                    UsersLiked : FieldValue.arrayRemove(UID)
                })
                
            
        }else if(previouslyDisliked){
            await db
                .collection("Posts")
                .doc(postID)
                .update({
                    NumLikes: FieldValue.increment(1),
                    UsersLiked : FieldValue.arrayUnion(UID),
                    NumDislikes : FieldValue.increment(-1),
                    UsersDisliked : FieldValue.arrayRemove(UID)

                })
        }else{
            await db
                .collection("Posts")
                .doc(postID)
                .update({
                    NumLikes: FieldValue.increment(1),
                    UsersLiked : FieldValue.arrayUnion(UID)
                })
        }
        return{'code':100 , 'response': {previouslyLiked , previouslyDisliked}}
        
    }catch(error){
        console.log("Error in likePost()")
        console.log(error)
        return{'code':200,'error': "Error liking post."}
    }

}

async function dislikePost({db,postID,UID}){
    try{
        const previouslyLiked = await checkLiked({db,postID,UID})
        const previouslyDisliked = await checkDisliked({db,postID,UID})
        if(previouslyLiked){
            await db
                .collection("Posts")
                .doc(postID)
                .update({
                    NumLikes: FieldValue.increment(-1),
                    UsersLiked : FieldValue.arrayRemove(UID),
                    NumDislikes : FieldValue.increment(1),
                    UsersDisliked : FieldValue.arrayUnion(UID)
                })
        }else if(previouslyDisliked){
            await db
                .collection("Posts")
                .doc(postID)
                .update({
                    NumDislikes : FieldValue.increment(-1),
                    UsersDisliked : FieldValue.arrayRemove(UID)
                })
        }else{
            await db
                .collection("Posts")
                .doc(postID)
                .update({
                    NumDislikes: FieldValue.increment(1),
                    UsersDisliked : FieldValue.arrayUnion(UID)
                })
            
        }
        return{'code':100 , 'response': {previouslyLiked,previouslyDisliked}}
        
    }catch(error){
        return{'code':200,'error': "Error disliking post."}
    }
}

module.exports = {likePost, dislikePost, createPost, editPost, displayPosts, displayUserPosts, deletePost, sendNotif}