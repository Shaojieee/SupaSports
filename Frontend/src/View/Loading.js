import React from "react";
import { View, Modal, ActivityIndicator } from "react-native";



export default function Loading({loaded}){
    return (
        <Modal 
            visible = {!loaded}
            transparent= {true}
            >
                    <View 
                    style={{
                    flex:1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor : "rgba(52, 52, 52, 0.6)"
                    }}
                    >
                        <ActivityIndicator size="large"/>
                    </View>
            </Modal>
    )
}