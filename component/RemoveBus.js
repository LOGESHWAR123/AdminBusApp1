import React, { useEffect, useState,useLayoutEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet,TextInput,Button,ScrollView,Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from "../colors";
import { Entypo } from '@expo/vector-icons';
import { auth, database } from '../config/firebase';
import {collection,addDoc,orderBy,query,onSnapshot,getDocs,docRef,getDoc,doc, QuerySnapshot,collectionGroup,getCountFromServer,deleteDoc} from 'firebase/firestore';
import DropCard1 from "./Dropcard1";



const RemoveBus = () => {
    
    const navigation = useNavigation();
    const [search,setSearch]=useState("");
    const [routeway,setRouteway]=useState([{id:1,name:"Loading",price:"zero"}]);
    const [area,SetArea]=useState([]);
    

    const handleDelete = async (documentId) => {
      try {
        Alert.alert(
          'Confirm deletion',
          'Are you sure you want to delete this bus?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'OK',
              onPress: async () => {
                await deleteDoc(doc(collection(database, 'Route 1'), documentId));
                console.log('Document successfully deleted!', documentId);
              },
            },
          ]
        );
      } catch (error) {
        console.error('Error removing document: ', error);
      }
    };

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
                  onPress={()=>navigation.navigate('Signout')}
                >
                  <FontAwesome name="user" size={25} color={'#1C64D1'} style={{marginRight: 10}}/>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);
    const collectionRef = collection(database, 'Route 1');
    useLayoutEffect(() => {

        const q = query(collectionRef, orderBy('time', 'desc'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          setRouteway(
            querySnapshot.docs.map(doc => 
              (
              {
              name:doc.id,
              price: doc.data().price,
              time:doc.data().time 
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
            <ScrollView>
            {filteredData.map((value,key)=>
                <TouchableOpacity key={key} onPress={()=>handleDelete(value.name)}>
                    <DropCard1 place={value.name} time={value.time} price={value.price} />
                </TouchableOpacity>
            )
        }
            </ScrollView>     
        </View>
    );
    };
    export default RemoveBus;

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