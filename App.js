import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import Busroute from './component/Busroute';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PreviousBooking from './component/Previousbooking';
import { ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import UpdateBus from './component/UpdateBus';
import AddnewBus from './component/Addnewbus';
import RemoveBus from './component/RemoveBus';
import EditBus from './component/EditBus';
import Login from './component/Login';
import Signout from './component/Signout';


const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
const [user, setUser] = useState(null);
return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function HomeStack() {
  return (
    <Stack.Navigator>
       <Stack.Screen name='Busroute' component={Busroute} />
     <Stack.Screen name='PreviousBooking' component={PreviousBooking} />
      <Stack.Screen name='UpdateBus' component={UpdateBus} />
      <Stack.Screen name='Addnewbus' component={AddnewBus} />
      <Stack.Screen name='RemoveBus' component={RemoveBus} />
       <Stack.Screen name='EditBus' component={EditBus}/>
       <Stack.Screen name='Signout' component={Signout}/>
     </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} defaultScreenOptions={Login}>
      <Stack.Screen name='Login' component={Login} screenOptions={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
// unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
    
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator/>
    </AuthenticatedUserProvider>
  );
}

