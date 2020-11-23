import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
//import {  } from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";
import Loading from "../components/Loading";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../utils/Firebase";
import { Rating, ListItem, Icon, Button } from "react-native-elements";
import PerfilBusqueda from "../components/Busqueda/PerfilBusqueda";

const db = firebase.firestore(firebaseApp);





export default function Buscar(props) {
  const {navigation } = props;

  const [userLogged, setUserLogged] = useState(false);
  const [listaTrabajadores, setListaTrabajadores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buscar, setBuscar] = useState(null);
  const [perfil, setPerfil] = useState (null);
  

  
  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  //Obtener trabajadores (postulantes)
  useEffect(() => {
    const trabajadoresRef = db.collection("perfil-final");
      trabajadoresRef
        .where("especialidad", "==", buscar)
        .get()
        .then((snapshot) => {
          const users = [];
          if (snapshot.empty) {
            console.log("No matching documents.");
            setListaTrabajadores(null)
            return ;
          }
          snapshot.forEach((doc) => {
            users.push({
              ...doc.data(),
            });
            setListaTrabajadores(users);
            setLoading(false);
          });
        });
      
  }, [buscar]);

  //if (!userLogged) return <Loading isVisible={true} text="Cargando..." />;

  
 
  

  if(listaTrabajadores === null){
    return( 
    <View >
      <RNPickerSelect
                  style={styles.input}
                  onValueChange={(value) => {setBuscar(value)}}
                  placeholder={{
                    label: "Seleccionar una categoría",
                    value: null,
                  }}
                  items={[
                    { label: "Electricidad", value: "electricidad" },
                    { label: "Gasfitería", value: "gasfiteria" },
                    { label: "Albañileria", value: "albañileria" },
                  ]}
        />
    </View>
    )
  }else{
    return(

        <View >
        <RNPickerSelect
                    style={styles.input}
                    onValueChange={(value) => {setBuscar(value)}}
                    placeholder={{
                      label: "Seleccionar una categoría",
                      value: null,
                    }}
                    items={[
                      { label: "Electricidad", value: "electricidad" },
                      { label: "Gasfitería", value: "gasfiteria" },
                      { label: "Albañileria", value: "albañileria" },
                    ]}
          />
            
            <FlatList
            
            data={listaTrabajadores}
            renderItem={({item}) => (
                      <View style={styles.viewFlatList}>
                        <Text style={styles.flatListText}>{item.nombres} {item.apellidos}</Text>
                        <Icon
                          style={styles.icon}
                          name="account"
                          type="material-community"
                          onPress={() =>{ 
                            //setPerfil(item.userId)
                            navigation.navigate("verPerfil",{
                            perfil: item.userId
                            })
                          }}
                        />
                      </View>
            )}
            keyExtractor={(item) => item.userId}
            > 
            </FlatList>  
              
          </View>
    )
  }
}


const styles = StyleSheet.create({
  icon:{
    alignSelf: "flex-end",
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
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
  flatListText: {
    alignSelf:"flex-start",
    fontSize: 20,
    fontWeight: "bold",
  },
});
