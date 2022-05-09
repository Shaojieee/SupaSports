const admin = require('firebase-admin')
const functions = require('firebase-functions')
var serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require('express')
const app = express()

const cors = require('cors');

const AuthProvider = require('./Controller/authModel')
const ProfileProvider = require('./Controller/profileModel')
const FavouritesProvider = require('./Controller/favouritesModel')
const GameCommentProvider = require('./Controller/gameCommentModel')
const PostCommentProvider = require('./Controller/postCommentModel')
const SearchProvider = require('./Controller/searchModel')
const PostProvider = require('./Controller/postModel')
const GameProvider = require('./Controller/gameModel')
const newsProvider = require('./Controller/newsModel')

app.use(cors({origin:true}));

const db = admin.firestore()

//Route
app.post('/register',async(req,res)=>{
    try{
        const {displayName,username,email,password} = req.body
        const response = await AuthProvider.Register({db,displayName,username,email,password})
        res.status(200).send(response)

    }catch(error){
        console.log("Error in register endpoint.")
        console.log(error)
        res.status(500).send({'code':200,'error':"Error in registering user."})
    }
})



app.post('/deleteAccount',async(req,res)=>{
    try{
        const {UID} = req.body
        const response = await AuthProvider.deleteAccount({db,UID})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in deleteAccount endpoint.")
        console.log(error)
        res.status(500).send({'code':200 , 'error':"Error deleting account."})
    }
    

    
})


app.post('/changeEmail',async(req,res)=>{
    try{
        const {UID,newEmail} = req.body
        const response = await AuthProvider.changeEmail({UID,newEmail})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in changeEmail endpoint.")
        console.log(error)
        res.status(500).send({'code':200 ,'error':"Error changing email."})
    }
})

app.post('/changePassword',async(req,res)=>{
    try{
        const {UID,newPassword} = req.body
        const response = await AuthProvider.changePassword({UID,newPassword})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in changePassword endpoint.")
        console.log(error)
        res.status(500).send({'code':200, 'error':"Error in changing password."})
    }    
})

app.post('/changeDisplayname',async(req,res)=>{
    try{
        const {UID,newDisplayname} = req.body
        const response = await AuthProvider.changeDisplayname({db,UID,newDisplayname})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in changeDisplayname endpoint.")
        res.status(500).send({'code':200 ,'error':"Error in changing display name."})
    }
    
})

app.post('/changeUsername',async(req,res)=>{
    try{
        const {UID,newUsername} = req.body
        const response = await AuthProvider.changeUsername({db,UID,newUsername})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in changeUsername endpoint.")
        res.status(500).send({'code':200 ,'error':"Error in changing username."})
    }
})


app.get('/getOtherUserDetails',async(req,res)=>{
    try{
        const {UID,otherUID} = req.query
        const response = await ProfileProvider.getOtherUserDetails({db,UID,otherUID})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in getOtherUserDetails endpoint.")
        console.log(error)
        res.status(500).send( {'code':200 ,'error': 'Error getting user details.'})
    }
})


app.get('/getUserDetails',async(req,res)=>{
    try{
        const {UID} = req.query
        const response = await ProfileProvider.getUserDetails({db,UID})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in getUserDetails endpoint.")
        console.log(error)
        res.status(500).send({'code':200 ,'error': 'Error getting user details.'})
    }
})

app.post("/storePushNotifToken",async(req,res)=>{
    try{
        const {UID, token} = req.body
        const response = await ProfileProvider.storePushNotifToken({db, UID, token})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in storePushNotifToken() endpoint")
        console.log(error)
        res.status(500).send({"code":200})
    }
})

app.get('/getUserFollowerFollowing',async(req,res)=>{
    try{
        const {UID} = req.query
        const response = await ProfileProvider.getUserFollowerFollowing({db,UID})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in getUserFollowerFollowing end point.")
        console.log(error)
        res.status(500),send({'code':200, 'error':'Error getting list of follower and following for user.'})
    }
})

app.post('/followUser',async(req,res)=>{
    try{
        const {followeeUID,followerUID} = req.body
        const response = await ProfileProvider.followUser({db,followeeUID,followerUID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in followerUser endpoint.")
        res.status(500).send({'code':200,'error': "Unable to follow user, try again later."})
    }
})


app.post('/unFollowUser',async(req,res)=>{
    try{
        const {followeeUID,unFollowerUID} = req.body
        const response = await ProfileProvider.unFollowUser({db, followeeUID,unFollowerUID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in unFollowerUser endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to unfollower user,try again later."})
    }                      
})


app.get('/searchUserProfile',async(req,res)=>{
    try{
        const {username} = req.query
        const response =  await ProfileProvider.searchUserProfile({db,username})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in searchUserProfile endpoint.")
        console.log(error)
        res.status(500).send({"code":200 ,'error':"Error searching for user."})
    }
    
});


app.get('/searchLeagueAndClub',async(req,res)=>{
    try{
        const {text,sportsID} = req.query
        const response =  await SearchProvider.searchLeagueAndClub({db,text,sportsID})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in searchLeagueAndClub endpoint.")
        console.log(error)
        res.status(500).send({'code': 200 ,'response': [], "error":"Error occured while searching"})
    }
    
});

app.get('/searchLeague',async(req,res)=>{
    try{
        const {text,sportsID} = req.query
        const response =  await SearchProvider.searchLeague({db,text,sportsID})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in searchLeague endpoint.")
        console.log(error)
        res.status(500).send({'code': 200 ,'response': [], "error":"Error occured while searching"})
    }
    
});

app.get('/searchClub',async(req,res)=>{
    try{
        const {text,sportsID} = req.query
        const response =  await SearchProvider.searchClub({db,text,sportsID})
        res.status(200).send(response)
    }catch(error){
        console.log("Error in searchClub endpoint.")
        console.log(error)
        res.status(500).send({'code': 200 ,'response': [], "error":"Error occured while searching"})
    }
    
});


app.post('/setUpFavourites',async(req,res)=>{
    try{
        const {favouriteDict,UID} = req.body
        const response = await FavouritesProvider.setUpFavourites({db,favouriteDict,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in setUpFavourites endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to set up favourites, try again."})
    }                      
})


app.post('/updateFavourites',async(req,res)=>{
    try{
        const {sportsID,UID,type,id,data} = req.body
        const response = await FavouritesProvider.updateFavourites({db,sportsID,UID,type,id,data})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in updateFavourites endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to update favourites, try again."})
    }                      
})

app.get('/retrieveAllSportsID',async(req,res)=>{
    try{
        const response = await SearchProvider.retrieveAllSportsID({db})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in retrieveAllSportsID endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }                      
})

app.get('/retrieveFavourites',async(req,res)=>{
    try{
        const {UID} = req.query
        const response = await FavouritesProvider.retrieveFavourites({db,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in retrieveFavourites endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again.","response":{"0":{"league":{},"club":{}},"1":{"league":{},"club":{}},"2":{"league":{},"club":{}},"3":{"league":{},"club":{}}}})
    }                      
})

app.post('/likeGameComments',async(req,res)=>{
    try{    
        const {gameID,sportsID,commentID,UID} = req.body
        const response = await GameCommentProvider.likeGameComments({db,gameID,sportsID,commentID,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in likeGameComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})


app.post('/dislikeGameComments',async(req,res)=>{
    try{    
        const {gameID,sportsID,commentID,UID} = req.body
        const response = await GameCommentProvider.dislikeGameComments({db,gameID,sportsID,commentID,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in dislikeGameComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})
   

app.post('/createGameComments',async(req,res)=>{
    try{
        const {sportsID,UID,gameID,text} = req.body
        const response = await GameCommentProvider.createGameComments({db,sportsID,UID,gameID,text})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in createGameComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to create comment, try again."})
    }                      
})


app.post('/deleteGameComments',async(req,res)=>{
    try{
        const {sportsID,commentID,gameID} = req.body
        const response = await GameCommentProvider.deleteGameComments({db,sportsID,gameID,commentID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in deleteGameComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to delete comment, try again."})
    }                      
})

app.get('/displayGameComments',async(req,res)=>{
    try{
        const {sportsID,UID,gameID} = req.query
        const response = await GameCommentProvider.displayGameComments({db,sportsID,gameID,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in displayGameComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to display comments."})
    }                      
})

app.post('/editGameComment',async(req,res)=>{
    try{
        const {sportsID,commentID,gameID,text} = req.body
        const response = await GameCommentProvider.editGameComment({db,sportsID,gameID,commentID,text})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in editGameComment endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to edit comment."})
    }                      
})

app.get('/displayPostComments',async(req,res)=>{
    try{    
        const {postID,UID} = req.query
        const response = await PostCommentProvider.displayPostComments({db,postID,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in displayPostComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to display comments.", "response":{}})
    }
})

app.post('/likePostComments',async(req,res)=>{
    try{    
        const {postID,commentID,UID} = req.body
        const response = await PostCommentProvider.likePostComments({db,postID,commentID,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in likePostComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})

app.post('/dislikePostComments',async(req,res)=>{
    try{    
        const {postID,commentID,UID} = req.body
        const response = await PostCommentProvider.dislikePostComments({db,postID,commentID,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in dislikePostComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})

app.post('/createPostComments',async(req,res)=>{
    try{    
        const {postID,sportsID,UID,text} = req.body
        const response = await PostCommentProvider.createPostComments({db,postID,sportsID,UID,text})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in createPostComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to create comment, try again."})
    }
})

app.post('/deletePostComments',async(req,res)=>{
    try{    
        const {postID,commentID} = req.body
        const response = await PostCommentProvider.deletePostComments({db,postID,commentID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in deletePostComments endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to delete comment, try again."})
    }
})

app.post('/editPostComment',async(req,res)=>{
    try{    
        const {postID,commentID,text} = req.body
        const response = await PostCommentProvider.deletePostComments({db,postID,commentID,text})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in editPostComment endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to edit comment, try again."})
    }
})


app.post('/createPost',async(req,res)=>{
    try{    
        const {sportsID,UID,text} = req.body
        const response = await PostProvider.createPost({db,sportsID,UID,text})
        if(response["code"]==100){
            PostProvider.sendNotif({db,admin, UID, postID:Object.keys(response["response"])[0], sportsID})
        }
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in createPost endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to create post, try again."})
    }
})

app.post('/deletePost',async(req,res)=>{
    try{    
        const {postID} = req.body
        const response = await PostProvider.deletePost({db,postID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in deletePost endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to delete post, try again."})
    }
})


app.get('/displayPosts',async(req,res)=>{
    try{    
        const {sportsID,UID,userTimezone} = req.query
        const response = await PostProvider.displayPosts({db,sportsID,userTimezone,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in displayPost endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to display post, try again.", "response":{}})
    }
})

app.get('/displayUserPosts',async(req,res)=>{
    try{    
        const {UID} = req.query
        const response = await PostProvider.displayUserPosts({db,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in displayUserPosts endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to display post, try again."})
    }
})

app.post('/editPost',async(req,res)=>{
    try{    
        const {postID,text} = req.body
        const response = await PostProvider.editPost({db,postID,text})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in editPost endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to edit post, try again."})
    }
})

app.post('/likePost',async(req,res)=>{
    try{    
        const {postID,UID} = req.body
        const response = await PostProvider.likePost({db,postID,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in likePost endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to like post, try again."})
    }
})

app.post('/dislikePost',async(req,res)=>{
    try{    
        const {postID,UID} = req.body
        const response = await PostProvider.dislikePost({db,postID,UID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in dislikePost endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to dislike post, try again."})
    }
})

app.get('/getGameDetails',async(req,res)=>{
    try{    
        const {gameID,sportsID,userTimezone} = req.query
        const response = await GameProvider.getGameDetails({gameID,sportsID,userTimezone})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in getGameDetails endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})

app.get('/getTeamFixture',async(req,res)=>{
    try{    
        const {clubID,sportsID,userTimezone,date} = req.query
        const response = await GameProvider.getTeamFixture({db,clubID,sportsID,userTimezone,date})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in getTeamFixture endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})

app.get('/getTeamResults',async(req,res)=>{
    try{    
        const {clubID,sportsID,userTimezone} = req.query
        const response = await GameProvider.getTeamResults({db,clubID,sportsID,userTimezone})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in getTeamResults endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})


app.get('/getLeagueStandings',async(req,res)=>{
    try{    
        const {leagueID,sportsID} = req.query
        const response = await GameProvider.getLeagueStandings({leagueID,sportsID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in getLeagueStandings endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})

app.get('/getLeagueFixture',async(req,res)=>{
    try{    
        const {leagueID,sportsID,date,userTimezone} = req.query
        const response = await GameProvider.getLeagueFixture({leagueID,sportsID,date,userTimezone})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in getLeagueFixture endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})

app.get('/getLeagueResults',async(req,res)=>{
    try{    
        const {leagueID,sportsID,userTimezone} = req.query
        const response = await GameProvider.getLeagueResults({leagueID,sportsID,userTimezone})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in getLeagueResults endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})

app.get('/getSportsNews',async(req,res)=>{
    try{    
        const {pageNumber,sportsID} = req.query
        const response = await newsProvider.getSportsNews({pageNumber,sportsID})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in getSportsNews endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})

app.get('/getArticlesByClub',async(req,res)=>{
    try{    
        const {pageNumber,clubName,leagueName} = req.query
        const response = await newsProvider.getArticlesByClub({pageNumber,clubName,leagueName})
        res.status(200).send(response)
    }catch(error){
        console.log(error)
        console.log("Error in getArticlesByClub endpoint.")
        res.status(500).send({'code':200 ,"error":"Unable to retrieve data, try again."})
    }
})


exports.app = functions.https.onRequest(app)