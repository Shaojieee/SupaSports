const {FieldValue} = require('firebase-admin/firestore')

async function checkLikedGameComment({db,gameID,sportsID,commentID,UID}){
    try{
        const documentSnapshot = await db
                                 .collection("SportsID")
                                 .doc(sportsID.toString())
                                 .collection(gameID.toString())
                                 .doc(commentID)
                                 .get()
        const commentDetails = documentSnapshot.data()
        if(commentDetails['UsersLiked'].includes(UID)){
            return true
        }else{
            return false
        }
    }catch(error){
        console.log("Error in checkLikedGameComment().")
        console.log(error)
        return{'code':200 ,'error':"Error retrieving data."}
    }
}

async function checkDislikedGameComment({db,gameID,sportsID,commentID,UID}){
    try{
        const documentSnapshot = await db
                                 .collection("SportsID")
                                 .doc(sportsID.toString())
                                 .collection(gameID.toString())
                                 .doc(commentID)
                                 .get()
        const commentDetails = documentSnapshot.data()
        console.log(commentDetails['UsersDisliked'].includes(UID))
        if(commentDetails['UsersDisliked'].includes(UID)){
            return true
        }else{
            return false
        }
    }catch(error){
        console.log("Error in checkDislikedGameComment().")
        console.log(error)
    }
}
//Neeed change
async function likeGameComments({db,gameID,sportsID,commentID,UID}){
    try{
        const previouslyLiked = await checkLikedGameComment({db,gameID,sportsID,commentID,UID})
        const previouslyDisliked = await checkDislikedGameComment({db,gameID,sportsID,commentID,UID})
        if(previouslyLiked){
            await db
                 .collection("SportsID")
                 .doc(sportsID.toString())
                 .collection(gameID.toString())
                 .doc(commentID)
                 .update({ 
                     NumLikes : FieldValue.increment(-1),
                     UsersLiked : FieldValue.arrayRemove(UID)    
                 })
        }else if(previouslyDisliked){
            await db
                .collection("SportsID")
                .doc(sportsID.toString())
                .collection(gameID.toString())
                .doc(commentID)
                .update({
                    NumLikes : FieldValue.increment(1),
                    UsersLiked : FieldValue.arrayUnion(UID),
                    NumDislikes : FieldValue.increment(-1),
                    UsersDisliked : FieldValue.arrayRemove(UID)
                })
        }else{
            await db
                 .collection("SportsID")
                 .doc(sportsID.toString())
                 .collection(gameID.toString())
                 .doc(commentID)
                 .update({
                    NumLikes : FieldValue.increment(1),
                    UsersLiked : FieldValue.arrayUnion(UID)
                 })
           
        }
        return{'code':100 , 'response':{previouslyLiked,previouslyDisliked}}
    }catch(error){
        console.log("Error in likeGameComments().")
        console.log(error)
        return{'code':200,'error': "Error in liking comment."}
    }
}
//Need change
async function dislikeGameComments({db,gameID,sportsID,commentID,UID}){
    try{
        const previouslyLiked = await checkLikedGameComment({db,gameID,sportsID,commentID,UID})
        const previouslyDisliked = await checkDislikedGameComment({db,gameID,sportsID,commentID,UID})
        console.log(previouslyDisliked)
        if(previouslyLiked){
            await db
                 .collection("SportsID")
                 .doc(sportsID.toString())
                 .collection(gameID.toString())
                 .doc(commentID)
                 .update({
                    NumLikes : FieldValue.increment(-1),
                    UsersLiked : FieldValue.arrayRemove(UID),
                    NumDislikes : FieldValue.increment(1),
                    UsersDisliked : FieldValue.arrayUnion(UID)
                 })
            
        }else if(previouslyDisliked){
            await db
                 .collection("SportsID")
                 .doc(sportsID.toString())
                 .collection(gameID.toString())
                 .doc(commentID)
                 .update({
                    NumDislikes : FieldValue.increment(-1),
                    UsersDisliked : FieldValue.arrayRemove(UID)
                 })
        }else{
            await db
                 .collection("SportsID")
                 .doc(sportsID.toString())
                 .collection(gameID.toString())
                 .doc(commentID)
                 .update({
                    NumDislikes : FieldValue.increment(1),
                    UsersDisliked : FieldValue.arrayUnion(UID)
                 })
        }
        return{'code':100 , 'response': {previouslyLiked,previouslyDisliked}}
        
    }catch(error){
        console.log("Error in dislikeGameComment().")
        console.log(error)
        return{'code':200,'error': "Error in disliking comment."}
    }
}

async function createGameComments({db,gameID,sportsID,text, UID}){
    try{
        let data = {}
        let gameCommentData = {
                                Date : FieldValue.serverTimestamp(),
                                NumDislikes : 0 , 
                                NumLikes : 0,
                                SportsID : sportsID,
                                Text : text,
                                UID : UID,
                                UsersDisliked : [],
                                UsersLiked : []
                              }

        const doc =await db
                        .collection('SportsID')
                        .doc(sportsID.toString())
                        .collection(gameID.toString())
                        .add(gameCommentData)
        const gameCommentID = doc.id
        const userDoc = await db.collection('Users').doc(UID).get()
        const displayName = userDoc.data()['DisplayName']
        gameCommentData['DisplayName'] = displayName
        gameCommentData['ownUser'] = true
        gameCommentData['Liked'] = false
        gameCommentData["Disliked"] = false
        data[gameCommentID] = gameCommentData
        return {'code':100 , 'response': data}
    }catch(error){
        console.log("Error in createGameComments().")
        console.log(error)
        return {'code':200 , 'error': 'Error creating comment'}
    }
}

async function deleteGameComments({db,gameID,sportsID,commentID}){
    try{
        await db
            .collection('SportsID')
            .doc(sportsID.toString())
            .collection(gameID.toString())
            .doc(commentID)
            .delete()
        return{'code':100 , 'response':"Deleted comment."}
    }catch(error){
        console.log("Error in deleteGameComments().")
        console.log(error)
        return{'code':200 , 'error':"Error deleting comment."}
    }
}

async function displayGameComments({db,gameID,sportsID, UID}){
    try{
        const querySnapshot = await db
                    .collection('SportsID')
                    .doc(sportsID.toString())
                    .collection(gameID.toString())
                    .orderBy("Date",'desc')
                    .get()
        const listOfDocs = querySnapshot.docs
        if(querySnapshot.size == 0 ){
            return {'code' : 100 , 'response' : {}}
        }else{
            
            let commentsDict = {}
            for(const comment of listOfDocs ){
                const commentDetails = comment.data()
                const documentSnapshot = await db.collection('Users').doc(commentDetails['UID']).get()
                const displayName = documentSnapshot.data()["DisplayName"]
                commentDetails["DisplayName"]=displayName
                if(UID==commentDetails["UID"]){
                    commentDetails["ownUser"]= true
                }else{
                    commentDetails['ownUser']=false
                }
                if(commentDetails["UsersLiked"].includes(UID)){
                    commentDetails["Liked"] = true
                }else{
                    commentDetails["Liked"]=false
                    if(commentDetails["UsersDisliked"].includes(UID)){
                        commentDetails["Disliked"]=true
                    }else{
                        commentDetails["Disliked"]=false
                    }
                }
                commentsDict[comment.id] = commentDetails
                delete commentDetails["UsersDisliked"]
                delete commentDetails["UsersLiked"]
            }
            return {'code':100 , 'response': commentsDict}
        }
        
    }catch(error){
        console.log("Error in displayGameComments()")
        console.log(error)
        return {'code':200, 'error': 'Error displaying comments.', "response":{}}
    }
}

//Need change
async function editGameComment({db,gameID,sportsID,commentID,text}){
    try{
        await db
              .collection('SportsID')
              .doc(sportsID.toString())
              .collection(gameID.toString())
              .doc(commentID)
              .update({
                  Text : text
              })
        return{'code':100 , 'response':"Comment has been edited."}
    }catch(error){
        console.log("Error in editGameComment().")
        console.log(error)
        return{'code':200 , 'error':"Error editing comment."}
    }
}

module.exports = {editGameComment, createGameComments, displayGameComments, likeGameComments, 
                    dislikeGameComments, deleteGameComments}