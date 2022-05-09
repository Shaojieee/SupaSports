const {FieldValue} = require('firebase-admin/firestore')

async function displayPostComments({db, postID, UID}){
    try{
        const querySnapshot = await db
                                    .collection('Posts')
                                    .doc(postID)
                                    .collection("Comments")
                                    .orderBy("Date",'desc')
                                    .get()
        
        let commentsDict = {}
        if(querySnapshot.size==0){
            return{'code':100 , 'response': {}}
        }else{
            const listOfDocs = querySnapshot.docs
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
                }
                if(commentDetails["UsersDisliked"].includes(UID)){
                    commentDetails["Disliked"]=true
                }else{
                    commentDetails["Disliked"]=false
                }
                commentsDict[comment.id] = commentDetails
                delete commentDetails["UsersDisliked"]
                delete commentDetails["UsersLiked"]
            }
            return {'code':100 , 'response': commentsDict}
        }
    }catch(error){
        console.log("Error in displayPostComments()")
        console.log(error)
        return {'code':200, 'error': 'Error displaying comments.', "response":{}}
    }
}

async function checkLikedComment({db, postID,commentID,UID}){
    try{
        const documentSnapshot = await db
                                 .collection("Posts")
                                 .doc(postID)
                                 .collection("Comments")
                                 .doc(commentID)
                                 .get()
        const commentDetails = documentSnapshot.data()
        if(commentDetails['UsersLiked'].includes(UID)){
            return true
        }else{
            return false
        }
    }catch(error){
        console.log("Error in checkLikedComment().")
        console.log(error)
    }
}

async function checkDislikedComment({db,postID,commentID,UID}){
    try{
        const documentSnapshot = await db
                                 .collection("Posts")
                                 .doc(postID)
                                 .collection("Comments")
                                 .doc(commentID)
                                 .get()
        const commentDetails = documentSnapshot.data()
        if(commentDetails['UsersDisliked'].includes(UID)){
            return true
        }else{
            return false
        }
    }catch(error){
        console.log("Error in checkDisikedComment().")
        console.log(error)
    }
}
//Need change
async function likePostComments({db, postID,commentID,UID}){
    try{
        const previouslyLiked = await checkLikedComment({db,postID,commentID,UID})
        const previouslyDisliked = await checkDislikedComment({db,postID,commentID,UID})
        if(previouslyLiked){
            await db
                 .collection("Posts")
                 .doc(postID)
                 .collection("Comments")
                 .doc(commentID)
                 .update({
                     NumLikes : FieldValue.increment(-1),
                     UsersLiked : FieldValue.arrayRemove(UID)    
                 })
        }else if(previouslyDisliked){
           await db
                .collection("Posts")
                .doc(postID)
                .collection("Comments")
                .doc(commentID)
                .update({
                    NumLikes : FieldValue.increment(1),
                    UsersLiked : FieldValue.arrayUnion(UID),
                    NumDislikes : FieldValue.increment(-1),
                    UsersDisliked : FieldValue.arrayRemove(UID)
                })
        }else{
            await db
            .collection("Posts")
            .doc(postID)
            .collection("Comments")
            .doc(commentID)
            .update({
                NumLikes : FieldValue.increment(1),
                UsersLiked : FieldValue.arrayUnion(UID)
            })
           
        }
        return{'code':100 , 'response': {previouslyLiked,previouslyDisliked}}
    }catch(error){
        console.log("Error in likePostsComments")
        console.log(error)
        return{'code':200,'error': "Error in liking comment."}
    }
}
//Need change
async function dislikePostComments({db, postID,commentID,UID}){
    try{
        const previouslyLiked = await checkLikedComment({db,postID,commentID,UID})
        const previouslyDisliked = await checkDislikedComment({db,postID,commentID,UID})
        if(previouslyLiked){
            await db
                .collection("Posts")
                .doc(postID)
                .collection("Comments")
                .doc(commentID)
                .update({
                    NumLikes : FieldValue.increment(-1),
                    UsersLiked : FieldValue.arrayRemove(UID),
                    NumDislikes : FieldValue.increment(1),
                    UsersDisliked : FieldValue.arrayUnion(UID)
                })
            
        }else if(previouslyDisliked){
            await db
                .collection("Posts")
                .doc(postID)
                .collection("Comments")
                .doc(commentID)
                .update({
                    NumDislikes : FieldValue.increment(-1),
                    UsersDisliked : FieldValue.arrayRemove(UID)
                })
        }else{
            await db
            .collection("Posts")
            .doc(postID)
            .collection("Comments")
            .doc(commentID)
            .update({
                NumDislikes : FieldValue.increment(1),
                UsersDisliked : FieldValue.arrayUnion(UID)
            })
        }
        return{'code':100 , 'response': {previouslyLiked,previouslyDisliked}}
        
    }catch(error){
        console.log("Error in likePostsComments")
        console.log(error)
        return{'code':200,'error': "Error in disliking comment."}
    }
}

async function createPostComments({db,postID,sportsID,text,UID}){
    try{
       let data = {}
       let postCommentData ={Date : FieldValue.serverTimestamp(), 
                 NumLikes : 0,
                 NumDislikes : 0,
                 Text : text,
                 UID : UID,
                 UsersDisliked : [],
                 UsersLiked : [],
                 SportsID : sportsID}
        const doc =  await db
                    .collection('Posts')
                    .doc(postID)
                    .collection("Comments")
                    .add(postCommentData)
        let postCommentID = doc.id
        const userDoc = await db.collection('Users').doc(UID).get()
        const displayName = userDoc.data()['DisplayName']
        await db
            .collection('Posts')
            .doc(postID)
            .update({
                NumComments : FieldValue.increment(1)
            })
        postCommentData['ownUser']=true
        postCommentData['Liked']=false
        postCommentData['Disliked']=false
        postCommentData['DisplayName']= displayName
        data[postCommentID]=postCommentData
        return {'code':100 , 'response': data}
    }catch(error){
        console.log("Error in createPostComments().")
        console.log(error)
        return{'code':200 , 'error': "Error creating comment."}
    }
    
}
//Need change
async function deletePostComments({db,postID,commentID}){
    try{
        await db
              .collection("Posts")
              .doc(postID)
              .collection("Comments")
              .doc(commentID)
              .delete()
        await db
        .collection("Posts")
        .doc(postID)
        .update({
            NumComments : FieldValue.increment(-1)
        }) 
        return{'code':100 ,'response':"Deleted Comment from post."}
    }catch(error){
        console.log("Error in deletePostComments().")
        console.log(error)
        return{'code':200 , 'error': 'Error deleting comment from post.'}
    }
}

//Need change
async function editPostComment({db,postID,commentID,text}){
    try{
        await db
              .collection("Posts")
              .doc(postID)
              .collection("Comments")
              .doc(commentID)
              .update({
                  Text : text
              })
        return {'code' : 100 , 'response': "Comment has been edited."}
    }catch(error){
        console.log("Error in editPostComment().")
        console.log(error)
        return {'code' : 200 , 'error' : "Error in editing comment."}
    }
}

module.exports = {displayPostComments, createPostComments, likePostComments, dislikePostComments,deletePostComments, editPostComment}