import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, Icon } from "react-native-elements";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../../utils/Firebase";


const db = firebase.firestore(firebaseApp);


export default function PerfilBusqueda (props){
  const { navigation, route, toastRef } = props;
  const { perfil } = route.params;
  const [trabajador, setTrabajador] = useState ([]);
  const [userLogged, setUserLogged] = useState(false);
  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });



  useEffect(() => {
    const trabajadorRef = db.collection("perfil-final");
      trabajadorRef
        .where("userId", "==", perfil)
        .get()
        .then((snapshot) => {
          const users = [];
          if (snapshot.empty) {
            console.log("No matching documents.");
            setTrabajador(null)
            return ;
          }
          snapshot.forEach((doc) => {
            users.push({
              ...doc.data(),
            });
            setTrabajador(users);
            //setLoading(false);
          });
        });
  }, [perfil]);

  const [validacion, setValidacion] = useState(null);

  useEffect(() => {
    const contactoRef = db.collection("contacto");
      contactoRef
        .where("solicitante", "==", firebase.auth().currentUser.uid)
        .where("trabajador", "==", perfil)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.log("No matching documents.");
            setValidacion(null)
            return ;
          }else{
            setValidacion(1)
          }
        });
      
  }, [validacion]);


  const addContacto = () => {
  
    if(userLogged && !validacion){
    db.collection("contacto")    
      .add({
        solicitante: firebase.auth().currentUser.uid,
        trabajador: perfil,
        fecha: new Date(),
        estado: 0,
      })
    }else{
      console.log("Debe de haber iniciado sesión para poder solicitar contacto.");
    }
  }


  return(
        <View style= {styles.viewContainer}>
            <FlatList
              data={trabajador}
              renderItem= {({item}) => (
                <View>
                  <Text style={styles.textItemTittle}>Nombre del trabajador:</Text>
                  <Text style={styles.textItem}>{item.nombres} {item.apellidos}</Text>
                  <Text style={styles.textItemTittle}>Email:</Text>
                  <Text style={styles.textItem}>{item.email}</Text>
                  <Text style={styles.textItemTittle}>Especialidad:</Text>
                  <Text style={styles.textItem}>{item.especialidad}</Text>
                  <Text style={styles.textItemTittle}>Titulos:</Text>
                  <Text style={styles.textItemTra}>Aca irian los titulos....</Text>
                  <Text style={styles.textItemTittle}>Trabajos:</Text>
                  <Text style={styles.textItemTra}>Fotos de trabajos....</Text>
                  <Text style={styles.textItemTittle}>Rating:</Text>
                  <Text style={styles.textItem}>*****</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}   
            />
            <Icon 
              style={styles.icon}
              name='message'
              type='material'
              onPress={addContacto}
            />
            <Text style={{
              fontSize: 18,
              fontWeight: "bold",
              alignSelf: "center",

            }}>Contacto</Text>            
        </View>
  )


}



const styles = StyleSheet.create({
  textItem:{
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
   
  },
  viewFlatList: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "stretch",
    justifyContent: "space-between",
    backgroundColor: "#F6F6F6",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  icon:{
    alignSelf:"center",
    
  },
  viewContainer: {
    display:"flex"
  },
  textItemTittle:{
    fontSize: 23,
    fontWeight: "bold",

    color:"orange",
    borderWidth:2,
  },
  textItemTra:{
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    padding:30,
    justifyContent:"flex-start",
  }







})