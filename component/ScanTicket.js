import {React,useState,useLayoutEffect,useRef,useEffect} from 'react';
import { View, Text, Dimensions, StatusBar,ScrollView,TextInput,TouchableOpacity,ActivityIndicator,Button,Alert,Vibration,Image} from 'react-native';
import { StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { FontAwesome } from '@expo/vector-icons';
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
import { useNavigation } from '@react-navigation/native';





const ScanTicket = ({route}) => {
    const [report,setreport]=useState([]);
    const [status,setstatus]=useState(false);
    const navigation=useNavigation();

    const {routeid}=route.params;
    console.log(routeid,"--<");


  
  



    const collectionRef1 = collection(database, 'BookingHistory');
    useLayoutEffect(() => {
  
      const unsubscribe = onSnapshot(collectionRef1, querySnapshot => {
        setreport(
          querySnapshot.docs
            .map(doc => ({
              Id: doc.id,
              Name: doc.data().name,
              Email: doc.data().Email,
              routeid: doc.data().routeid,
              time: doc.data().time,
              Attendence : doc.data().Attendence,
            }))
        );
    
        console.log(querySnapshot.size);
      });
    
      return unsubscribe;
    }, []);


    const filteredReport = report.filter((item) => item.routeid === `${routeid}`);
    console.log(filteredReport);



  

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

    <View style={{flexDirection:"row-reverse",margin:15}}>
        
        <TouchableOpacity onPress={()=>navigation.navigate('ScanPage',{routeid:routeid.toString()})}>
        <View style={{height:40,width:120,backgroundColor:"blue",borderRadius:5,justifyContent:"center"}}>
        <Text style={{color:"white",textAlign:"center",fontWeight:'bold'}}>Scan Ticket</Text>
        </View>
        </TouchableOpacity>

    </View>

    <Text></Text>

    <View style={{flexDirection:"row",justifyContent:"space-around"}}>


    <View >

{filteredReport.map((value,key)=>
<View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:10,marginTop:20}}>
  <View>
  <Text>{value.Id}</Text>
  </View>
</View>
  
)
}
</View>



<View >

{filteredReport.map((value,key)=>
<View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:10,marginTop:20}}>
  <View>
  <Text>{value.Name}</Text>
  </View>
</View>
  
)
}
</View>


<View  > 

{filteredReport.map((value,key)=>
<View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:10,marginTop:20}}>
  <View>
  <Text>7550005350</Text>
  </View>
</View>
  
)
}
</View>

<View >

{filteredReport.map((value,key)=>
<View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:10,marginTop:20}}>
  {/* <View style={{width:20,height:18,backgroundColor:"red",borderRadius:100}}>
  <Text>Hi</Text>
  </View> */}
  {/* <FontAwesome name="c" size={18} color={'#1C64D1'} style={{marginRight: 10}} /> */}
  {value.Attendence ? (
       <Image
         style={{width:18,height:18}}
         source={require('../assets/correct.png')}
       />
    ) : (
      <Image style={{ width: 18, height: 18 }} source={require('../assets/cross.png')} />
    )}
</View>
  
)
}
</View>




      
    </View>

     

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

export default ScanTicket;
