import {React,useState,useLayoutEffect} from 'react';
import { View, Text, Dimensions, StatusBar,ScrollView,TextInput,TouchableOpacity} from 'react-native';
import { StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import DropCard from './Dropcard';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import colors from '../colors';



const Bookings = () => {
  const [bookings,setbookings]=useState([]);
  const [search,setSearch]=useState("");

  const handleDownload = async () => {
    if (bookings.length === 0) {
      console.log('No data to download');
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(bookings);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${day}-${month}-${year}`;

      const fileName = `Bus Booking History_ ${currentDate}.xlsx`;

      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'Download File' });
    } catch (error) {
      console.log('Error while generating the XLSX file:', error);
    }
  };





  const collectionRef = collection(database, 'BookingHistory'); 
  useLayoutEffect(() => {

    const unsubscribe = onSnapshot(collectionRef, querySnapshot => {
      setbookings(
        querySnapshot.docs.map(doc => 
          (
          {
          Id:doc.id,
          Name:doc.data().name, 
          bookingDay:doc.data().bookingDay,
          bookingTime:doc.data().bookingtime, 
          Email:doc.data().Email,
          destination:doc.data().destination,
          price:doc.data().price,
          transactionId:doc.data().transactionId
        }))
      ),

      console.log(querySnapshot.size);
    });        
  
  return unsubscribe;
  }, 
  
  []); 
  const filteredData = bookings.filter((item) =>
  item.Id.toLowerCase().includes(search.toLowerCase())
  );
  console.log(bookings);
  return (
    <View style={styles.container}>
        <Text style={{fontSize:18,fontWeight:"bold"}}>Booking History</Text>
        <View style={{flexDirection:"row",justifyContent:'space-around'}}>

        <TextInput
                style={styles.input}
                onChangeText={setSearch}
                value={search}
                placeholder="Enter college ID"
                keyboardType="default"
                />

                <TouchableOpacity onPress={handleDownload} style={styles.button}>
                    <Text style={{fontSize:15,color:'white',textAlign:'center',fontWeight:'bold',marginTop:4}}>Download</Text>
                </TouchableOpacity>
        </View>
        <ScrollView style={{marginTop:15}}>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            
            <View>

            {filteredData.map((value,key)=>
            <View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
              <View>
              <Text>{value.Name}</Text>
              </View>
            </View>
              
            )
        }
            </View>

            <View>

            {filteredData.map((value,key)=>
            <View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
              <View >
              <Text>₹ {value.price} </Text>
              </View>
            </View>
              
            )
        }
            </View>


            <View>

            {filteredData.map((value,key)=>
            <View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
              <Text style={{textAlign:"center",fontWeight:"bold",color:"green"}}>PAID</Text>
            </View>
              
            )
        }
            </View>
          

          </View>
            
        </ScrollView>  
    </View>
  );
}
const styles = StyleSheet.create({
    container:{
        flex:1, 
        padding:15
    },
    input:{
      marginTop:20,
      height:40, 
      backgroundColor:"white", 
      borderRadius:10, 
      width:"50%", 
      paddingHorizontal:10
  },
  button : {
    backgroundColor:colors.primary,
    width:90,
    height:35,
    borderRadius:10,
    marginTop:20
  }
    
});

export default Bookings;
