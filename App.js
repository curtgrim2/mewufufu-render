import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Platform, View, Text, Button,TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-web';
import {io} from 'socket.io-client'; 
import React, {useEffect,useState} from 'react';
/*npx expo start --web */

/*GOAL: Create an app that allows remote users to vote (or comment) and allow the feedback to be 
seen by the main computer and some information to be seen by all */

/*Plan: Use nextcloud as the medium cloud service that connects the main server to the remote users. 
For now I will use ngrok to allow my server to be accessed by non local remote users. 

OR use render as backend for the mobile app
*/

export default function App() {

  const [msg, setMsg] = useState('');
  //const [connected,setConnected] = useState(false);

const THEURL = "https://f6979ef34599.ngrok-free.app";

useEffect(() => {
  // Fetch JSON
  fetch(`${THEURL}/api/data`,{
    headers:{
      'Content-Type':'application/json',
      'ngrok-skip-browser-warning':'true' //Key to solving the "html instead of json error"
    }
  })
    .then(res => res.json())
    .then(data => console.log("API Message:", data.message))
    .catch(err => console.error("API Fetch Error:", err));

 // ✅ Connect to Socket.IO
    const socket = io(THEURL, {
      transports: ["websocket"],
      secure: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("server_message", (msg) => {
      console.log("From Server:", msg);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    // ✅ Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);



 return ( <View style={styles.body1}>
              <Text style={styles.label}> Get your votes in! </Text>


      <View style={styles.buttcont}>
          <TouchableOpacity style ={styles.leftbutton} onPress={()=>sendinvote("Left")}>
              <Text style={styles.buttontext}>Left</Text>
              <Text style ={{color:'white',marginTop:20}}>Click to take back vote</Text>
            </TouchableOpacity> 

            <TouchableOpacity style={styles.rightbutton}onPress={()=>sendinvote("Right")}>
              <Text style={styles.buttontext} > Right Video</Text>
              <Text style={{color:'white',marginTop:20}}>Click to take back vote</Text>
            </TouchableOpacity>

            

            
            </View>

            <View style={styles.blcont}>
            <TouchableOpacity style={styles.bottomlabel}>
            <Text style={styles.bottomtext}>
                Take back vote
            </Text>           
   </TouchableOpacity>
   </View>
          </View>
    
  );
}

const styles = StyleSheet.create({
  buttcont:{
flexDirection:'row',
height:"75%",
/*justifyContent:'center',
alignItems:'center'*/
},


  label:{
    backgroundColor:'black',
    color:'white',
    textAlign:'center',
    borderBottomRightRadius:'50%',
    borderBottomLeftRadius:'50%',
    fontSize:50,

  },
  bottomtext:{
    textAlign:'center',
    fontSize:30,
  },

  blcont:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    height:'20%',
  },
  bottomlabel:{
    backgroundColor:'grey',
    textAlign:'center',
    width:"100%",
    height:'100%',
  },
  body1:{
    width:'100%',
    backgroundColor:'#9b95a3',
    textAlign:'center',
    height:'100%',
    

  },
  leftbutton:{
    backgroundColor:'black',
    color:'white',
    /*borderRadius:500/2,*/
    width:'40%',
    height:300,
    position:'fixed',
    top:"20%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  
  },
  rightbutton:{
    backgroundColor:'black',
    color:'white',
   /* borderRadius:500/2,*/
    width:'40%',
    height:300,
    position:'fixed',
    right:0,
    top:"20%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  
  },
  buttontext:{
    color:'white',
    textAlign:'center',
    fontSize:25
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
