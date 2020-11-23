import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { firebaseApp } from "../../../utils/Firebase";
import Carousel from "../../../components/Carousel";
import firebase from "firebase/app";
import "firebase/firestore";
import { set } from "lodash";

export default function SolicitudWorker(props) {
  //Estados y propiedades
  const { navigation, route } = props;
  const { id, titulo } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [solicitud, setSolicitud] = useState("");
  //Array de trabajadores
  const [listaTrabajadores, setListaTrabajadores] = useState([]);
  const [listaPostulantes, setListaPostulantes] = useState([]);
  const [datosPerfil, setDatosPerfil] = useState("");
  const [bloquearPostulacion, setBloquearPostulacion] = useState(0);
  const [userLogged, setUserLogged] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [isUser, setIsUser] = useState(0);
  const [idSol, setIdSol] = useState("");
  const [perfilId, setPerfilId] = useState("");
  const [estadoPostulacion, setEstadoPostulacion] = useState(0);
  const [estadoSolicitud, setEstadoSolicitud] = useState(0);
  //Trabajador individual
  const [trabajador, setTrabajador] = useState("");
  //Obtener dimensiones de la pantalla
  const screenWidth = Dimensions.get("window").width;
  //Inicialización de BD
  const db = firebase.firestore(firebaseApp);
  //Consultas a BD con Hooks

  //Referencia BD:
  let refSolicitudes = db.collection("solicitudes");
  //Obtener solicitud actual
  useEffect(() => {
    navigation.setOptions({ title: titulo });
    let subscribe = refSolicitudes
      .doc(id)
      .get()
      .then((response) => {
        const data = response.data();
        setSolicitud(data);
        setIdSol(id);
        setEstadoSolicitud(data.estado);
      });
    return () => {
      subscribe;
    };
  }, [solicitud]);

  let subscribe = firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) && setUserInfo(user) : setUserLogged(false);
    return subscribe;
  });

  let refP = db.collection("perfil-final");
  useEffect(() => {
    let subscribe = refP
      .where("userId", "==", firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        setIsUser(snapshot.size);
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          setPerfilId(doc.id);
          setDatosPerfil(doc.data());
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
    console.log("Ejecutado..");
    return () => {
      subscribe;
    };
  }, [isUser]);

  const postulacionesRef = db.collection("postulaciones");
  useEffect(() => {
    let subscribe = postulacionesRef
      .where("idPostulante", "==", firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No se encontraron postulaciones...");
          return;
        }
        snapshot.forEach((doc) => {
          setEstadoPostulacion(doc.data().estado);
        });
      });
    return () => {
      subscribe;
    };
  }, []);
  return (
    <ScrollView>
      <Carousel
        arrayImages={solicitud.imagenes}
        height={250}
        width={screenWidth}
        data={solicitud.imagenes}
      />
      <TitleSolicitud
        titulo={solicitud.titulo}
        descripcion={solicitud.descripcion}
      />
      <ListaPostulantes listaTrabajadores={listaTrabajadores} />
      {estadoSolicitud === 0 ? (
        <Button
          title="Postular"
          buttonStyle={styles.btnP}
          onPress={() => {
            if (userLogged && estadoPostulacion == 0) {
              var postulacionRef = db.collection("postulaciones");
              postulacionRef
                .add({
                  idSolicitud: idSol,
                  idPostulante: datosPerfil.userId,
                  nombres: datosPerfil.nombres,
                  apellidos: datosPerfil.apellidos,
                  email: firebase.auth().currentUser.email,
                  telefono: datosPerfil.telefono,
                  estado: 0,
                })
                .then(function () {
                  setBloquearPostulacion(1);
                  navigation.navigate("solicitudesworker");
                });
            } else if (userLogged && estadoPostulacion != 0) {
              Alert.alert(
                "Información",
                "Usted ya ha postulado a este trabajo",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            }
          }}
        />
      ) : (
        <View>
          <Icon
            name="speaker-notes"
            type="material"
            size={50}
            color="#F7931C"
            idSolicitud={id}
            onPress={() =>
              navigation.navigate("chat", {
                id,
              })
            }
          />
        </View>
      )}
    </ScrollView>
  );
}

function TitleSolicitud(props) {
  const { titulo, descripcion } = props;

  return (
    <View style={styles.viewSolicitudTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameSolicitud}>{titulo}</Text>
      </View>
      <Text style={styles.descriptionSolicitud}>{descripcion}</Text>
    </View>
  );
}

function ListaPostulantes(props) {
  const { listaTrabajadores } = props;
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listaTrabajadores}
        renderItem={(trabajador) => {
          <Trabajador trabajador={trabajador} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}
function Trabajador(props) {
  const { trabajador } = props;
  const { nombre, especialidad } = trabajador.item;
  <TouchableOpacity onPress={console.log("presionado")}>
    <View style={styles.viewSolicitud}>
      <View>
        <Text>{nombre}</Text>
        <Text>{especialidad}</Text>
      </View>
    </View>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  viewFlatList: {
    height: 50,
    flex: 1,
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 5,
  },
  flatListText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewSolicitudTitle: {
    padding: 15,
  },
  nameSolicitud: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionSolicitud: {
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewSolicitudInfo: {
    margin: 15,
    marginTop: 25,
  },
  solicitudInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
  viewTrabajador: {
    flexDirection: "row",
    margin: 10,
  },
  notFoundSolicitudes: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  loaderSolicitudes: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  btnP: {
    backgroundColor: "#F7931C",
    borderRadius: 8,
    width: "80%",
    margin: 20,
    padding: 8,
    alignSelf: "center",
  },
});
