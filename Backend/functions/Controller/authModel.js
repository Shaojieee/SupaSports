const { auth } = require('firebase-admin');

async function Register({db,displayName,username,email,password}){
    try{
      if(displayName.length>0 & username.length>0 & email.length>0 & password.length>0){
        const exists = await checkExistingUsername({db,username})
        if(exists){
          return {'code' : 200, 'error':'Username is already taken.'}
        }else{
          const userCredentials = await auth().createUser({email: email, password:password,displayName:displayName});
          await db.collection('Users').doc(userCredentials.uid).set({DisplayName : displayName,Username : username, Follower: [], Following: [], Favourites: {}})
          return {'code':100 ,'response':userCredentials.uid}
        }
      }else{
        return {'code' : 200 ,'error': 'Please fill in the empty field.'}
      }
      
    }catch(error){
      console.log("Error in Register()")
      console.log(error)
      var errorCode= error.code
      
      if(errorCode === 'auth/email-already-exists'){
        return {'code' : 200 ,'error': 'There already exists an account with the given email address.'}
      }
      else if(errorCode === 'auth/invalid-password'){
        return  {'code' : 200 ,'error': 'Password requires at least 6 characters.'}
      }
      else if(errorCode === 'auth/invalid-email'){
        return  {'code' : 200 ,'error':'Invalid email.' }
      }
      else if(errorCode === 'auth/invalid-display-name'){
        return {'code' : 200 ,'error': 'Invalid display name.'}
      }
      else{
        return {'code' : 200 ,'error': 'Operation not allowed.'}
      }
    }
  
}
  
async function checkExistingUsername({db,username}){
    const q = await db.collection('Users').where('Username','in',[username]).get()

    if(q.size != 0){
        return true
    }else{
        return false
    }
}


async function deleteAccount({db, UID}){
    try{
        await auth().deleteUser(UID)
        await db.collection("Users").doc(UID).set({
          DisplayName: "User no longer exists",
          Username : "User no longer exists"
        })
        return {'code' : 100, 'response':true}
    }catch(error){
        console.log("Error in deleteAccount().")
        console.log(error)
        return {'code' : 200 ,'error': "Unable to delete account."}
    }
}

 


async function changeEmail({newEmail,UID}){
     try{
        await auth().updateUser(UID,{email: newEmail})
        return {'code' : 100, 'response':'Email updated.'}
     }catch(error){
       var errorCode=error.code
       if(errorCode=='auth/email-already-exists'){
         return {'code' : 200 ,'error': 'That email is already in use.'}
       }else if(errorCode=='auth/invalid-email'){
         return {'code' : 200 ,'error': 'That email address is invalid' }
       }else{
         console.log(errorCode)
         return {'code' : 200 ,'error': 'Error updating email.'}
       }
     }
}
  
//need chagne
async function changePassword({newPassword,UID}){
    try{
      await auth().updateUser(UID,{password:newPassword})
      return {'code' : 100, 'response':'Password updated.'}
    }catch(error){
      var errorCode= error.code
      if(errorCode=="'auth/invalid-password'"){
        return {'code' : 200 ,'error': 'Password requires at least 6 characters.'}
      }else{
        return {'code' : 200 ,'error':'Go check documentation for more possible error.' }
      }
    }
}
  


async function changeDisplayname({db, newDisplayname,UID}){
    try{
       await db
            .collection('Users')
            .doc(UID)
            .update({
              DisplayName: newDisplayname
            })


      return {'code' : 100, 'response':'Updated display name.'}
    }catch(error){
      return {'code' : 200 ,'error': 'Error updating displayname.'}
    }
 }


async function changeUsername({db, newUsername,UID}){
    try{
      await db
            .collection('Users')
            .doc(UID)
            .update({
              Username : newUsername
            })
      await auth().updateUser(UID,{username:newUsername})
      return {'code' : 100, 'response':'Updated username.'}
    }catch(error){
      return {'code' : 200 ,'error': 'Error updating username.'}
    }
}

module.exports = { changeDisplayname, changeEmail, changePassword, changeUsername, Register, deleteAccount}
  