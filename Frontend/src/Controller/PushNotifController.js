import PushNotification from "react-native-push-notification"
import {useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { storePushNotifToken } from "./UserController"
import AsyncStorage from "@react-native-async-storage/async-storage"






  const RemotePushController = ({navigation}) => {
    const dispatch = useDispatch()
    const user = useSelector(state=>state.user)
    useEffect(() => {
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function(token) {
          dispatch(storePushNotifToken({token, UID:user.UID}))
        },
  
        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
          const {data} = notification
          
          // process the notification here
        },
        // Android only: GCM or FCM Sender ID
        senderID: '',
        popInitialNotification: true,
        requestPermissions: true
      })
    }, [])

  
    return null
  }
  
  export default RemotePushController
