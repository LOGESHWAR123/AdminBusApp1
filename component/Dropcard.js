import { View, TouchableOpacity, Text, Image, StyleSheet,TextInput } from "react-native";
import colors from '../colors';
const DropCard = ({place,time,price}) => {
    return (
                <View style={styles.card} >
                <View style={{justifyContent:"space-evenly"}}>
                <Text style={{fontSize:20,}}>{place}</Text>
                <Text style={{}}>{time}</Text>
                {/* //Need to update the seat from database */}
                <Text style={{fontSize:15,color:"green"}}>15 Seats left</Text>               
                </View>

                <View  style={{justifyContent:"space-evenly",marginRight:10}}>
                <Text style={{fontSize:20,fontWeight:"bold",color:colors.primary}}>{price}</Text>
                <Text style={{fontSize:15,}}>9h</Text>
                <Text style={{fontSize:12,color:colors.primary}}>Edit</Text>
                </View>
                
            </View>
           
    );
    };

export default DropCard;
const styles=StyleSheet.create({

    card:{
        margin:15,
        backgroundColor: colors.mediumGray, 
        height:120,
        flexDirection:"row",
        justifyContent:"space-between",
        paddingLeft:10,
        paddingRight:10,
    }
})