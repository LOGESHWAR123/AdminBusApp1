import {React,useState,useLayoutEffect} from 'react';
import { View, Text, Dimensions, StatusBar,ScrollView,TextInput,TouchableOpacity,ActivityIndicator,Alert,Image} from 'react-native';
import { StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { collection, query, orderBy, onSnapshot ,where} from "firebase/firestore";
import colors from '../colors';
import DropCard from './Dropcard';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart} from "react-native-chart-kit"
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Share } from 'react-native';
import { PDFDocument, rgb } from 'react-native-pdf-lib';
import { ToWords } from 'to-words';
import { printToFileAsync } from 'expo-print';


const Reports = () => {
  const [seatcount,setseatcount]=useState([]);
  const [search,setSearch]=useState("");
  const [report,setreport]=useState([]);
  const [Routeid,setrouteid]=useState("1");


  
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
            destination:doc.data().destination,
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
  

  console.log("new");
  console.log(report);


  // const data = {
  //   labels: ["January", "February", "March", "April", "May", "June"],
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99, 43]
  //     }
  //   ]
  // };
  

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };


  let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })


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

  const handledownload = async (routeid) => {
    const filteredReport = report.filter((item) => item.routeid === `${routeid}`);
    if (filteredReport.length === 0) {

      Alert.alert('Download Failed', `No Booking Occurs`, [
        { text: 'OK' },
      ])
      console.log('No data to download');
      return;
    }
    try {
      const worksheet = XLSX.utils.json_to_sheet(filteredReport);
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

  const handleDownloadPDF = async (routeid) => {
    const filteredReport1 = report.filter((item) => item.routeid === `${routeid}`);
    if (filteredReport1.length === 0) {
      Alert.alert('Download Failed', 'No Booking Occurs', [{ text: 'OK' }]);
      console.log('No data to download');
      return;
    }
  
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
  
    try {
      let html = `
      <!DOCTYPE html>
      <html>
        <head>
        <style>
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
          
          td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 5px;
          }
          
          tr:nth-child(even) {
            background-color: #dddddd;
          }
        </style>
        </head>
        <body>
        <p>${currentDate}</p>
        <h2>${routeid} REPORT </h2>
        
        <table>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Destination</th>
            <th>bookingDay</th>
            <th>price</th>
            <th>routeid</th>
            <th>time</th>
            <th>transaction id</th> 
          </tr>
      `;
  
      for (const item of filteredReport1) {
        html += `
          <tr>
            <td>${item.Id}</td>
            <td>${item.name}</td>
            <td>${item.Email}</td>
            <td>${item.destination}</td>
            <td>${item.day}</td>
            <td>${item.price}</td>
            <td>${item.routeid}</td>
            <td>${item.time}</td>
            <td>${item.transactionId}</td>
          </tr>
        `;
      }
  
      html += `
        </table>
        </body>
      </html> `;
  

      const options = {
        html:'<h1>Hello, PDF!</h1>',
        fileName: `${currentDate}`,
        directory: 'Documents',
      };

      const { uri } = await Print.printToFileAsync({
        html : html,
       });
  
    } catch (error) {
      console.log('Error generating PDF: ', error);
    }
  };
  



  console.log(seatcount);

  if (seatcount?.length === 0) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#1C64D1" />
   </View>
    );
  }


  return (
    <View style={styles.container}>

        <Text style={{fontSize:18,fontWeight:"bold",margin:10,color:colors.primary}}>Reports</Text>

        {/* <BarChart
        // style={graphStyle}
        data={data}
        width={"80%"}
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
/> */}
{/* <PieChart
  data={data}
  width={350}
  height={250}
  chartConfig={chartConfig}
  accessor={"population"}
  backgroundColor={"transparent"}
  paddingLeft={"10"}
  center={[10, 10]}
  //absolute
/> */}

<View>
<ScrollView horizontal={true}>
<LineChart
    data={{
      labels: seatcount.map(value=>value.name),
      datasets: [
        {
          data:  seatcount.map(value=>value.seats)
        }
      ]
    }}
    width={(Dimensions.get("window").width-30)} // from react-native
    height={250}
    xLabelsOffset={3}
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor:colors.primary ,
      backgroundGradientFrom: colors.primary,
      backgroundGradientTo: colors.primary,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "7",
        strokeWidth: "3",
        stroke: colors.primary
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}

    decorator={() => {
      return tooltipPos.visible ? <View>
          <Svg>
              <Rect x={tooltipPos.x - 15} 
                  y={tooltipPos.y + 10} 
                  width="40" 
                  height="30"
                  borderRadius={20}
                  fill="white" />
                  <TextSVG
                      x={tooltipPos.x + 5}
                      y={tooltipPos.y + 30}
                      fill={colors.primary}
                      fontSize="16"
                      fontWeight="bold"
                      //color="black"
                      textAnchor="middle">
                      {tooltipPos.value}
                  </TextSVG>
          </Svg>
      </View> : null
  }}

  onDataPointClick={(data) => {

      let isSamePoint = (tooltipPos.x === data.x 
                          && tooltipPos.y === data.y)

      isSamePoint ? setTooltipPos((previousState) => {
          return { 
                    ...previousState,
                    value: data.value,
                    visible: !previousState.visible
                 }
      })
          : 
      setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });

  }}


  />
</ScrollView>
</View>
<View style={{flex:1}}>
  <Text style={{fontWeight:"bold",fontSize:18,color:colors.primary,margin:10}}>Download Report</Text>

 <ScrollView>
 <View>
  {seatcount.map((value,key)=>
            <View key={key} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
              <View style={{height:50,width:"95%",justifyContent:"space-between",flexDirection:"row"}}>
              <Text style={{fontWeight:"bold",fontSize:18,}}>Route  {key+1} </Text>
              <TouchableOpacity onPress={()=>handleDownloadPDF(key+1)}>
                   <Image
                   style={{width:30,height:30,marginLeft:10}}
                  source={require('../assets/pdf.png')} 
                   />
                </TouchableOpacity>
              <TouchableOpacity onPress={()=>{handledownload(key+1)}} style={styles.button}>
                    <Text style={{fontSize:15,color:'white'}}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
              
            )
        }
  </View>
 </ScrollView>


</View>

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

export default Reports;