import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useLayoutEffect } from 'react';
import { database } from '../config/firebase';
import colors from '../colors';

const ONE_SECOND_IN_MS = 200;

const ScanPage = ({ route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null); 
  const [report, setreport] = useState([]);
  const cameraRef = useRef(null);

  const { routeid } = route.params;

  const collectionRef1 = collection(database, 'BookingHistory');
  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(collectionRef1, querySnapshot => {
      setreport(
        querySnapshot.docs.map(doc => ({
          Id: doc.id,
          Name: doc.data().name,
          Email: doc.data().Email,
          routeid: doc.data().routeid,
          time: doc.data().time,
          Attendence: doc.data().Attendence,
        }))
      );
    });
    return unsubscribe;
  }, []);

  const filteredReport = report.filter(item => item.routeid === `${routeid}`);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData(data); 
    Vibration.vibrate(ONE_SECOND_IN_MS);

    const check = filteredReport.some(item => item.Id === `${data}`);
    if (!check) {
      Alert.alert('Scan Failed', `${data} - not booked in this bus`, [
        { text: 'OK' },
      ]);
      setScannedData(null); 
    } else {
      try {
       
        const docToUpdate = doc(collectionRef1, data);
        await updateDoc(docToUpdate, { Attendence: true });
        console.log('Document successfully updated!');
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScannedData(null); 
  };

  if (hasPermission === null) {
    return <Text style={styles.text}>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scannedData && (
        <Text style={styles.scannedDataText}>
         {scannedData}
        </Text>
      )}
      {scanned && (
        <View style={styles.scanAgainContainer}>
          <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
            <Text style={styles.scanAgainButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    height: 400,
  },
  scannedDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  scanAgainContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: 16,
  },
  scanAgainButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default ScanPage;
