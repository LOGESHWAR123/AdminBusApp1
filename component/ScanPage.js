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

import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import { Camera } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';






const ScanPage = () => {
  const [seatcount,setseatcount]=useState([]);
  const [search,setSearch]=useState("");
  const ONE_SECOND_IN_MS = 200;

  
  



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
      <Camera
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
      )}
      {/* <QRCode
      value="String"
    /> */}
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
        backgroundColor: colors.primary, 
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
});

export default ScanPage;
