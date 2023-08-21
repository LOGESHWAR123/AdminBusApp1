import {React,useState,useLayoutEffect,useRef,useEffect} from 'react';
import { View, Text, Dimensions, StatusBar,ScrollView,TextInput,TouchableOpacity,ActivityIndicator,Button,Alert,Vibration} from 'react-native';
import { StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import colors from '../colors';
import DropCard from './Dropcard';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart} from "react-native-chart-kit"
import { useNavigation } from '@react-navigation/native';
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import { Camera } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';






const Attendence = () => {
  const [seatcount,setseatcount]=useState([]);
  const [search,setSearch]=useState("");
  const ONE_SECOND_IN_MS = 200;

  const [report,setreport]=useState([]);
  const navigation=useNavigation();


  
  
  const collectionRef1 = collection(database, 'BookingHistory');
  useLayoutEffect(() => {

    const unsubscribe = onSnapshot(collectionRef1, querySnapshot => {
      setreport(
        querySnapshot.docs
          .map(doc => ({
            Id: doc.id,
            Name: doc.data().name,
            Email: doc.data().Email,
            bookingDay: doc.data().day,
            price: doc.data().price,
            routeid: doc.data().routeid,
            time: doc.data().time,
            transactionId: doc.data().transactionId
          }))
      );
  
      console.log(querySnapshot.size);
    });
  
    return unsubscribe;
  }, []);


  const handledownload = async (routeid) => {
    const filteredReport = report.filter((item) => item.routeid === `${routeid}`);
    if (filteredReport.length === 0) {

      Alert.alert('Open Failed', `No Booking Occurs`, [
        { text: 'OK' },
      ])
      console.log('No data to download');
      return;
    }
    
    re


  };


  const collectionRef = collection(database, 'SeatBookingCount'); 
  useLayoutEffect(() => {

    const unsubscribe = onSnapshot(collectionRef, querySnapshot => {
      setseatcount(
        querySnapshot.docs.map(doc => 
          (
          {
          name:`R ${doc.id}`,
          seats: doc.data().seats
          
        }))
      ),
      console.log(querySnapshot.size);
        });        
  
  return unsubscribe;
  }, 
  
  []); 

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scandata,setscandata]=useState("");
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setscandata(data);
    Vibration.vibrate(ONE_SECOND_IN_MS)
    // alert(`Scanned data: ${data}`);
    // You can perform any action with the scanned data here
  };

  const handleScanAgain = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  

  











  
  return (

    <View style={styles.container}>
      {/* <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <Text>{scandata}</Text>
      {scanned && (
        <View style={styles.scanAgainContainer}>
         
          <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
            <Text style={styles.scanAgainButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )} */}
      <Text style={{fontSize:25,fontWeight:"bold",marginLeft:25,marginTop:20,color:"blue"}}>Routewise</Text>
      {/* <QRCode
      value="String"
    /> */}

<ScrollView>
{seatcount.map((value,key)=>
            <View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:15,padding:5}}>
              <View style={{height:35,width:"95%",justifyContent:"space-between",flexDirection:"row",marginLeft:20,marginRight:20}}>
              <Text style={{fontWeight:"bold",fontSize:18,}}>Route  {key+1} </Text>
              <TouchableOpacity onPress={()=>navigation.navigate('ScanTicket',{routeid:(key+1).toString()})} style={styles.button}>
                    <Text style={{fontSize:15,color:'white'}}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
              
            )
        }
        
</ScrollView>
    </View>
    
    
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
      },
      camera: {
        height:500
      },
      scanAgainContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.primary, //'rgba(0, 0, 0, 0.7)'
        padding: 16,
      },
      scanAgainText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
      },
      scanAgainButton: {
        alignItems: 'center',
        marginTop: 8,
      },
      scanAgainButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight:"bold"
      },
      button: {
        backgroundColor:'#0672CF',
        width:"30%",
        padding: 10,
        borderRadius: 5,
        height:40,
        alignItems:"center", 
        //alignSelf:"center",
        
      },
});

export default Attendence;
