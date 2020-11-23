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
  TouchableHighlight,
} from "react-native";
import { Button, Divider, ListItem, Icon } from "react-native-elements";
import { firebaseApp } from "../../../utils/Firebase";
import Carousel from "../../../components/Carousel";
import firebase from "firebase/app";
import "firebase/firestore";
import { map } from "lodash";
import Map from "../../../components/Map";
import Loading from "../../../components/Loading";

export default function Solicitud(props) {
  //Estados y propiedades
  const { navigation, route } = props;
  const { id, titulo } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  const [solicitud, setSolicitud] = useState("");
  //Array de trabajadores
  const [listaTrabajadores, setListaTrabajadores] = useState([]);
  const [cantidadPostulantes, setCantidadPostulantes] = useState(0);
  const [listaPostulantes, setListaPostulantes] = useState([]);
  //Trabajador individual
  const [trabajador, setTrabajador] = useState("");
  const [idPostulacion, setIdPostulacion] = useState("");
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
        setListaPostulantes(data.postulantes);
      });
    return () => {
      subscribe;
    };
  }, [solicitud]);

  //Obtener trabajadores (postulantes)
  /*  const trabajadoresRef = db.collection("perfil-final");
  useEffect(() => {
    let subscribe = trabajadoresRef
      .where("tipoUsuario", "==", "trabajador")
      .get()
      .then((snapshot) => {
        setCantidadPostulantes(snapshot.size);
        const users = [];
        if (snapshot.empty) {
          console.log("No matching documents.");
          setIsLoading(false);
          return;
        }
        snapshot.forEach((doc) => {
          users.push({
            ...doc.data(),
          });
          setListaTrabajadores(users);
          console.log("Use effect ejecutado");
          setIsLoading(false);
        });
      });
    return () => {
      subscribe;
    };
  }, [cantidadPostulantes]); */
  const postulacionesRef = db.collection("postulaciones");
  const users = [];
  useEffect(() => {
    let subscribe = postulacionesRef
      .where("idSolicitud", "==", id)
      .get()
      .then((snapshot) => {
        setCantidadPostulantes(snapshot.size);
        if (snapshot.empty) {
          console.log("No se encontraron postulaciones...");
          return;
        }
        snapshot.forEach((doc) => {
          users.push({
            ...doc.data(),
          });
          setListaTrabajadores(users);
          setIdPostulacion(doc.id);
          console.log("Use effect ejecutado");
        });
      });
    return () => {
      subscribe;
    };
  }, [cantidadPostulantes]);

  return (
    <ScrollView>
      <Carousel
        arrayImages={solicitud.imagenes}
        height={250}
        width={screenWidth}
      />
      <TitleSolicitud
        titulo={solicitud.titulo}
        descripcion={solicitud.descripcion}
      />
      <SolicitudInfo
        location={solicitud.location}
        titulo={solicitud.descripcion}
        direccion={solicitud.direccion}
      />
      <Divider style={{ backgroundColor: "blue" }} />

      {solicitud.estado == 0 ? (
        <View>
          <Text
            style={{ margin: 8, padding: 8, fontWeight: "bold", fontSize: 20 }}
          >
            Postulantes
          </Text>
          <ListaPostulantes
            listaTrabajadores={listaTrabajadores}
            isLoading={isLoading}
            navigation={navigation}
            idPostulacion={idPostulacion}
            idSolicitud={id}
          />
        </View>
      ) : (
        <View style={{ margin: 20 }}>
          <Icon
            name="speaker-notes"
            type="material"
            size={50}
            color="#F7931C"
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
//Ir a perfil

//Render Items
function ListaPostulantes(props) {
  const {
    listaTrabajadores,
    isLoading,
    navigation,
    idPostulacion,
    idSolicitud,
  } = props;

  const renderItem = ({ item }) =>
    item.estado == 0 || item.estado == 1 ? (
      <View style={styles.contenedor}>
        <TouchableHighlight
          style={styles.button}
          key={item.idPostulantes}
          onPress={() =>
            navigation.navigate("perfilpostulante", {
              item,
              idPostulacion,
              idSolicitud,
            })
          }
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",

              height: 15,
            }}
          >
            <Text style={styles.btnText}>
              {item.nombres} {item.apellidos}
            </Text>
            <Text style={styles.btnTextSubtitle}>{item.especialidad}</Text>
          </View>
        </TouchableHighlight>
      </View>
    ) : null;
  return (
    <FlatList
      data={listaTrabajadores}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={<FooterList isLoading={isLoading} />}
    />
  );
}
function SolicitudInfo(props) {
  const { location, titulo, email, direccion } = props;

  const listInfo = [
    {
      text: direccion,
      iconName: "home-map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: titulo,
      iconName: "format-quote-close",
      iconType: "material-community",
      action: null,
    },
  ];

  return (
    <View style={styles.viewSolicitudInfo}>
      <Text style={styles.solicitudInfoTitle}>
        Información sobre la solicitud
      </Text>
      {location ? (
        <Map location={location} name={titulo} height={200} />
      ) : (
        console.log("no carga la latitud")
      )}
      {/* <Map location={location} name={titulo} height={100} /> */}
      {listInfo.map((item, index) => (
        <ListItem key={index} bottomDivider>
          <Icon name={item.iconName} type={item.iconType} color="#00a680" />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </View>
  );
}
function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loaderSolicitudes}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundSolicitudes}>
        <Text>No quedan postulantes por cargar</Text>
      </View>
    );
  }
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
  button: {
    justifyContent: "center",
    width: 300,
    marginTop: 20,
    backgroundColor: "#F7931C",
    padding: 15,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  btnTextSubtitle: {
    color: "#dedede",
    fontSize: 15,
    justifyContent: "center",
    textAlign: "center",
  },
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
});
