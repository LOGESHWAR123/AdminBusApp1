import {React,useState,useLayoutEffect} from 'react';
import { View, Text, Dimensions, StatusBar,ScrollView,TextInput,TouchableOpacity,ActivityIndicator} from 'react-native';
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




const Reports = () => {
  const [seatcount,setseatcount]=useState([]);
  const [search,setSearch]=useState("");
  
  
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


  const createDynamicTable = (bookings) => {

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    var CurrentTime = date + '/' + month + '/' + year+ ' ' + hours + ':' + min + ':' + sec;
   
  
      var table = '';
      var count=1;
      for (let i in bookings) {
        const item = array[i];
        table = table + `
        <tr>
           <td>${count}</td>
          <td>${item.time}</td>
          <td>${item.p}</td>
        </tr>
        `
        count+=1
      }
      //console.log(table);
      const html = `
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
        <p>${CurrentTime}</p>
        <h2>SPYDRAIN REPORT</h2>
        
        <table>
          <tr>
            <th>S.No</th>
            <th>Time</th>
            <th>Distance</th>
          </tr>
          ${table}
        </table>
        
        </body>
      </html>
        `;
      return html;
    }













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
              <TouchableOpacity  style={styles.button}>
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
