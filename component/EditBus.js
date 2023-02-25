import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert,} from "react-native";
import { signInWithEmailAndPassword,fetchSignInMethodsForEmail,createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../config/firebase";
import colors from "../colors";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigation } from "@react-navigation/native";

export default function EditBus({route}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name,setname]=useState(route.params.name1); 
  const [phone,setphone]=useState();
  const navigation = useNavigation();
  const [price,setprice] =  useState(route.params.price1);
  const [route2,setroute] =  useState(route.params.route1);
  const [time,settime] =  useState(route.params.time1);
  const { name1} = route.params;
  const [editMode, setEditMode] = useState(false);

  // function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
 
    const handleEdit = async () => {
        try {
          name1 = name
          const busDocRef = doc(database, "Buses", name1);
          const updatedData = {

            price:parseInt(price,10),
            route: parseInt(route2,10),
            time: time
          };
          await setDoc(busDocRef, updatedData, { merge: true });
          setEditMode(false);
          Alert.alert("Bus information changed")
        } catch (error) {
          console.error("Error updating bus details:", error);
          Alert.alert("Error updating bus details");
        }
      }

 
  
  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
      <Text style={{fontSize:25,fontWeight:"bold",color:colors.primary,textAlign:"center",paddingTop:10}}>{name1}</Text>
      <View style={styles.logincontainer}> 
      <Text>Price</Text>
      <TextInput
                style={styles.loginbox}
                placeholder="Enter your college mail id"
                autoCapitalize="none"
                autoCorrect={false}
                value={price.toString()}
                editable={editMode}
                onChangeText={(text) => setprice(text)}
        />
        <Text>Route</Text>
        <TextInput
                  style={styles.loginbox}
                  placeholder="Enter your Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={route2.toString()}
                  editable={editMode}
                  onChangeText={(text) => setroute(text)}
        /> 
        <Text>Time</Text>
      <TextInput
                style={styles.loginbox}
                placeholder="Enter your Mobile Number"
                autoCapitalize="none"
                autoCorrect={false}
                value={time}
                editable={editMode}
                onChangeText={(text) => settime(text)}
       />

      </View>
      <TouchableOpacity style={{justifyContent:"center",alignItems:"center",bottom:40}} onPress={toggleEditMode} >
        <View style={{height:40,width:150,backgroundColor:colors.primary,borderRadius:6,justifyContent:"center",alignItems:"center",marginTop:50}}>
            <Text style={{fontSize:15,color:"white",fontWeight:"bold"}}>Edit</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{justifyContent:"center",alignItems:"center",bottom:40}} onPress={handleEdit}>
      <View style={{height:40,width:150,backgroundColor:colors.primary,borderRadius:6,justifyContent:"center",alignItems:"center",marginTop:30}}>
            <Text style={{fontSize:15,color:"white",fontWeight:"bold"} } >Submit</Text>
        </View>
      </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center", 
    alignItems:"center"
  },
  subcontainer:{
    width:300,
    height: 500,
    backgroundColor:"white",
    borderRadius:15, 
    padding:10
  }, 
  heading:{
    fontSize:40, 
    fontWeight:"bold",
    color:"white", 
    fontStyle:"italic", 
    bottom:20
  },
  logincontainer:{

    height:300, 
    backgroundColor:"white", 
    justifyContent:"space-evenly",  
    alignItems:"center"
  },

  loginbox:{
    borderWidth:1,
    borderColor:colors.primary, 
    width:"90%", 
    height:50,  
    borderRadius:5,
    paddingHorizontal:10
    
  }, 
  
});
