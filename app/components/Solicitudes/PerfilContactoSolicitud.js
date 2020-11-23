import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Avatar, Icon } from "react-native-elements";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../../utils/Firebase";

export default function PerfilContactoSolicitud(props) {
  const { navigation, route } = props;
  const { item, idPostulacion, idSolicitud } = route.params;
  const db = firebase.firestore(firebaseApp);

  let postulacionRef = db.collection("postulaciones");
  let solicitudesRef = db.collection("solicitudes");

  function aceptarPostulaciones() {
    postulacionRef
      .doc(idPostulacion)
      .update({
        estado: 1,
      })
      .then(function () {
        console.log("Actualizado!");
        solicitudesRef
          .doc(idSolicitud)
          .update({
            estado: 1,
          })
          .then(function () {
            navigation.navigate("solicitudes");
          })
          .catch((error) => {
            console.log("ERROR: ", error);
          });
      });
  }
  function rechazarPostulaciones() {
    postulacionRef
      .doc(idPostulacion)
      .update({
        estado: 2,
      })
      .then(function () {
        console.log("Actualizado!");
        navigation.navigate("solicitudes");
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  }

  return (
    <View style={styles.viewContainer}>
      <View style={styles.viewPerfil}>
        <Avatar
          rounded
          source={{
            uri: "https://static.thenounproject.com/png/17241-200.png",
          }}
          size="large"
        />
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {item.nombres} {item.apellidos}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 15,
          alignItems: "center",
          padding: 15,
        }}
      >
        <Button
          title="Aceptar trabajador"
          buttonStyle={{ backgroundColor: "#F7931C" }}
          onPress={aceptarPostulaciones}
        />
        <Icon
          name="close-circle"
          type="material-community"
          size={40}
          color="red"
          style={{ marginLeft: 10 }}
          onPress={rechazarPostulaciones}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textItem: {
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
  icon: {
    alignSelf: "center",
  },
  viewContainer: {
    display: "flex",
    padding: 20,
    alignItems: "center",
  },
  viewPerfil: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  textItemTittle: {
    fontSize: 23,
    fontWeight: "bold",

    color: "orange",
    borderWidth: 2,
  },
  textItemTra: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    padding: 30,
    justifyContent: "flex-start",
  },
});
