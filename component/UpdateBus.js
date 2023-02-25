import React, { useEffect, useState,useLayoutEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet,TextInput,Button,ScrollView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from "../colors";
import { Entypo } from '@expo/vector-icons';
import { auth, database } from '../config/firebase';
import DropCard from "./Dropcard";
import {collection,addDoc,orderBy,query,onSnapshot,getDocs,docRef,getDoc,doc, QuerySnapshot,collectionGroup,getCountFromServer} from 'firebase/firestore';
//import { Button } from "react-native-web";
import EditBus from "./EditBus";

const UpdateBus = () => {
    
    const navigation = useNavigation();
    const [search,setSearch]=useState("");
    const [routeway,setRouteway]=useState([{id:1,name:"Loading",price:"zero"}]);
    const [area,SetArea]=useState([]);

    useEffect(() => {
        navigation.setOptions({

            headerLeft: () => (
                <FontAwesome name="home" size={24} color={colors.gray} style={{marginLeft: 15}}/>
            ),

            headerRight: () => (
                <TouchableOpacity
                  style={{
                    marginRight: 10
                  }}
                >
                  <FontAwesome name="user" size={25} color={'#1C64D1'} style={{marginRight: 10}}/>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);
    const collectionRef = collection(database, 'Buses');
    useLayoutEffect(() => {

        const q = query(collectionRef, orderBy('time', 'desc'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          setRouteway(
            querySnapshot.docs.map(doc => 
              (
              {
              name:doc.id,
              price: doc.data().price,
              time:doc.data().time ,
              route:doc.data().route,
            }))
          ),
          SetArea(
            querySnapshot.docs.map(doc => 
                (doc.id))     
          )
          
          console.log(querySnapshot.size);
        });        
      
      return unsubscribe;
      }, 
      
      []); 
   console.log(area);

   const filteredData = routeway.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );


  return (
        <View style={styles.container}>
            <View style={styles.subcontainer}>
                <Text style={{color:"white",fontSize:16,fontWeight:"bold",bottom:20}}>Enter your Droping Point</Text>
                <TextInput
                style={styles.input}
                onChangeText={setSearch}
                value={search}
                placeholder="Enter your Destination"
                keyboardType="default"
                />
            </View>
            <View style={styles.addbus}>
                <TouchableOpacity onPress={()=>navigation.navigate('RemoveBus')} style={styles.removeBus}>
                    <Text style={{fontSize:15,color:'white'}}>Remove Bus</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('Addnewbus')} style={styles.addNewBus}>
                    <Text style={{fontSize:15,color:'white'}}>Add new Bus</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
            {filteredData.map((value,key)=>
                <TouchableOpacity key={key} onPress={() => navigation.navigate('EditBus', { name1: value.name, price1: value.price, route1:value.route,time1:value.time})}>
                    <DropCard  place={value.name} time={value.time} price={value.price}/>
                </TouchableOpacity>
            )
        }
            </ScrollView>     
        </View>
    );
    };
    export default UpdateBus;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        subcontainer: {
            height:200,
            backgroundColor: colors.primary, 
            justifyContent:"center", 
            alignItems:'center'
        },
        input:{
            bottom:10,
            height:50, 
            backgroundColor:"white", 
            borderRadius:10, 
            width:"75%", 
            paddingHorizontal:10
        },
        card:{
            margin:15,
            backgroundColor: '#0672CF', 
            height:120,
            flexDirection:"row",
            justifyContent:"space-between",
            paddingLeft:10,
            paddingRight:10,
        },
        addbus: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'flex-end',
            marginTop: '5%',
            marginHorizontal: 20,
          },
          removeBus: {
            backgroundColor: '#0672CF',
            padding: 10,
            marginRight: 10,
            flex: 1,
            alignItems: 'center',
            borderRadius: 5,
          },
          addNewBus: {
            backgroundColor:'#0672CF',
            padding: 10,
            flex: 1,
            alignItems: 'center',
            borderRadius: 5,
          },
        
    });