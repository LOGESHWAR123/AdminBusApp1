import React from 'react';
import { View, Text } from 'react-native';
import Busroute from './component/Busroute';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PreviousBooking from './component/Previousbooking';
import UpdateBus from './component/UpdateBus';
import AddnewBus from './component/Addnewbus';
import RemoveBus from './component/RemoveBus';
import EditBus from './component/EditBus';
import Login from './component/Login';

const App = () => {

  const Stack = createStackNavigator();
  function Adminstack() {
    return (
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Busroute' component={Busroute} />
        <Stack.Screen name='PreviousBooking' component={PreviousBooking} />
        <Stack.Screen name='UpdateBus' component={UpdateBus} />
        <Stack.Screen name='Addnewbus' component={AddnewBus} />
        <Stack.Screen name='RemoveBus' component={RemoveBus} />
        <Stack.Screen name='EditBus' component={EditBus}/>
      </Stack.Navigator>
    );
  }

  return (
      <NavigationContainer>
        <Adminstack />
      </NavigationContainer>
  );
};

export default App;
