import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Icon, Image } from "react-native-elements";
import * as firebase from "firebase";

import { firebaseApp } from "../../../utils/Firebase";
import "firebase/firestore";
import ListSolicitudes from "../../../components/Solicitudes/ListSolicitudes";
import { result, size } from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import Loading from "../../../components/Loading";
const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
  const { navigation } = props;
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  const [solicitudes, setSolicitudes] = useState([]);
  const [startSolicitudes, setStartSolicitudes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const limitSolicitudes = 8;
  const [login, setLogin] = useState(null);
  //Datos de prueba:

  firebase.auth().onAuthStateChanged((usuario) => {
    !usuario ? setLogin(false) : setLogin(true);
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchSolicitudes() {
        try {
          await db
            .collection("solicitudes")
            .where("createdBy", "==", firebase.auth().currentUser.uid)
            .get()
            .then((snap) => {
              setTotalSolicitudes(snap.size);
            });
          const resultSolicitudes = [];
          db.collection("solicitudes")
            .where("createdBy", "==", firebase.auth().currentUser.uid)
            .orderBy("createdAt", "desc")
            .limit(limitSolicitudes)
            .get()
            .then((response) => {
              setStartSolicitudes(response.docs[response.docs.length - 1]);
              response.forEach((doc) => {
                const solicitud = doc.data();
                solicitud.id = doc.id;
                resultSolicitudes.push(solicitud);
              });
              setSolicitudes(resultSolicitudes);
              console.log("use effect solicitudes...");
              setIsLoading(false);
            });
        } catch (e) {
          console.log(e);
        }
      }
      fetchSolicitudes();
    }, [totalSolicitudes])
  );

  if (login && size(solicitudes) > 0) {
    return (
      <View style={styles.viewBody}>
        <Loading isVisible={isLoading} text="Cargando" />

        <ListSolicitudes solicitudes={solicitudes} isLoading={isLoading} />
        <Icon
          type="material-community"
          name="plus"
          color="#F7931C"
          reverse
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("addsolicitud")}
        />
      </View>
    );
  } else if (!login) {
    return (
      <View>
        <Loading isVisible={isLoading} text="Cargando" />

        <PresentacionVacia />
      </View>
    );
  } else if (size(solicitudes) == 0) {
    return (
      <View style={styles.viewBody}>
        <Loading isVisible={isLoading} text="Cargando" />

        <Text style={styles.tituloPrincipal}>
          ¿Aún no solicitas ningun trabajo?
        </Text>
        <View style={styles.viewPhoto}>
          <Image
            source={require("../../../../assets/img/plan.png")}
            style={{ width: 400, height: 200 }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.cuerpoTexto}>
          Empieza a agregar solicitudes haciendo clic en el ícono!
        </Text>
        <Icon
          type="material-community"
          name="plus"
          color="#F7931C"
          reverse
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("addsolicitud")}
        />
      </View>
    );
  }
}
function PresentacionVacia() {
  return (
    <View>
      <Text style={styles.tituloPrincipal}>
        ¿Aún no solicitas ningun trabajo?
      </Text>
      <View style={styles.viewPhoto}>
        <Image
          source={require("../../../../assets/img/plan.png")}
          style={{ width: 400, height: 200 }}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.cuerpoTexto}>
        Inicia sesión para empezar a generar solicitudes. ¡Aquí se listarán
        todas tus solicitudes!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tituloPrincipal: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  cuerpoTexto: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 20,
    marginBottom: 10,
    padding: 20,
    textAlign: "center",
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
  },
});
