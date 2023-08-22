import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert,} from "react-native";
import { signInWithEmailAndPassword,fetchSignInMethodsForEmail,createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../config/firebase";
import colors from "../colors";
import { doc, setDoc, updateDoc } from "firebase/firestore"; 
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from 'react-native-modal-datetime-picker';
export default function EditBus({route}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name,setname]=useState(route.params.name1); 
  const [phone,setphone]=useState();
  const navigation = useNavigation();
  const [price,setprice] =  useState(route.params.price1);
  const [route2,setroute] =  useState(route.params.routeid);
  const [time,setTime] =  useState(route.params.time1);
  const { name1} = route.params;
  const [editMode, setEditMode] = useState(false);
  const [color, setColor] = useState('#a9a9a9');
  const [showTimePickerInitially, setShowTimePickerInitially] = useState(false);
  // function to toggle edit mode
  const toggleEditMode = () => {
    setColor(color === '#a9a9a9' ? 'black' : '#a9a9a9');
    setEditMode(!editMode);
    setShowTimePickerInitially(true);
  };
 
    const handleEdit = async () => {
      setColor(color === '#a9a9a9' ? 'black' : '#a9a9a9');
        try {

          const busDocRef = doc(database, "Buses", name1);
          updateDoc(busDocRef,{

            price:price,
            routeid: route2,
            time: time
          });
          setEditMode(false);
          Alert.alert("Bus information changed")
          console.log(price);
        } catch (error) {
          console.error("Error updating bus details:", error);
          Alert.alert("Error updating bus details");
        }
      }
      const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
      const hideTimePicker1 = () => {
        setTimePickerVisibility(false);
      };
      const showTimePicker = () => {
        if (showTimePickerInitially) {
          setTimePickerVisibility(true);
        }
      };
      const handleConfirm1 = (time) => {
        var hrs = time.getHours()
        var min = time.getMinutes()
        var out = hrs + ":" + min 
        setTime(out);
        hideTimePicker1();
      };
  
  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
      <Text style={{fontSize:25,fontWeight:"bold",color:colors.primary,textAlign:"center",paddingTop:10}}>{name1}</Text>
      <View style={styles.logincontainer}> 
      <Text style={styles.text}>Price</Text>
      <TextInput
                style={styles.loginbox}
                placeholder="Enter price"
                autoCapitalize="none"
                autoCorrect={false}
                value={price.toString()}
                editable={editMode}
                onChangeText={(text) => setprice(text)}
        />
        <Text>Route</Text>
        <TextInput
                  style={styles.loginbox}
                  placeholder="Enter Route id"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={route2}
                  editable={editMode}
                  onChangeText={(text) => setroute(text)}
        /> 
        <Text>Time</Text>
        <TouchableOpacity onPress={showTimePicker} style={styles.loginbox} >
         <Text style={{marginTop:'4%',color:color}}>{time.toString()}</Text>
                <DateTimePicker
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirm1}
                onCancel={hideTimePicker1}
                /> 
      </TouchableOpacity>

      </View>
      <TouchableOpacity style={{height:40,width:150,backgroundColor:colors.primary,borderRadius:6,justifyContent:"center",alignItems:"center",marginTop:20,alignSelf:'center'}} onPress={toggleEditMode} >
            <Text style={{fontSize:15,color:"white",fontWeight:"bold"}}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{height:40,width:150,backgroundColor:colors.primary,borderRadius:6,justifyContent:"center",alignItems:"center",marginTop:30,alignSelf:"center"}} onPress={handleEdit}>
            <Text style={{fontSize:15,color:"white",fontWeight:"bold"} } >Submit</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent:"center", 
    //alignItems:"center"
  },
  subcontainer:{
    width:"100%",
    height: "100%",
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
    margin:15
   // alignItems:"center"
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
