import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";

import { map, size, filter, set } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddSolicitudForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [solicitudName, setSolicitudName] = useState("");
  const [solicitudAddress, setSolicitudAddress] = useState("");
  const [solicitudDescription, setSolicitudDescription] = useState("");
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationSolicitud, setLocationSolicitud] = useState(null);
  const [choosenLabel, setChoosenLabel] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  let perfilRef = db.collection("perfil-final");
  useEffect(() => {
    const isSuscribed = fetchTipoUsuario();
    return () => {
      isSuscribed;
    };
  }, [tipoUsuario]);

  async function fetchTipoUsuario() {
    perfilRef
      .where("userId", "==", await firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach((doc) => {
          setTipoUsuario(doc.data().tipoUsuario);
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }
  const addSolicitud = () => {
    if (
      !solicitudName ||
      !solicitudAddress ||
      !solicitudDescription ||
      !choosenLabel
    ) {
      toastRef.current.show("Todos los campos del formulario son obligatorios");
    } else if (size(imagesSelected) === 0) {
      toastRef.current.show("El solicitud tiene que tener almenos una foto");
    } else if (!locationSolicitud) {
      toastRef.current.show(
        "Tienes que maracar tu ubicación en el mapa, haz clic en el ícono",
        3000
      );
    } else {
      setIsLoading(true);
      uploadImageStorage().then((response) => {
        db.collection("solicitudes")
          .add({
            titulo: solicitudName,
            direccion: solicitudAddress,
            descripcion: solicitudDescription,
            location: locationSolicitud,
            imagenes: response,
            categoria: choosenLabel,
            estado: 0,
            createdAt: new Date(),
            createdBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            setIsLoading(false);
            tipoUsuario === "cliente"
              ? navigation.navigate("solicitudes")
              : navigation.navigate("solicitudesworker");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show("Error al enviar solicitud");
          });
      });
    }
  };
  const uploadImageStorage = async () => {
    const imageBlob = [];

    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("solicitudes").child(uuid());
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`solicitudes/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
              console.log(photoUrl);
            });
        });
      })
    );

    return imageBlob;
  };
  return (
    <ScrollView style={styles.scrollView}>
      <View
        style={{ marginBottom: 20, marginTop: 20, height: 200, width: "100%" }}
      >
        <Image
          source={require("../../../assets/img/blogging.png")}
          style={{ width: 400, height: 200 }}
          resizeMode="contain"
        />
      </View>
      <FormAdd
        setSolicitudName={setSolicitudName}
        setSolicitudAddress={setSolicitudAddress}
        setSolicitudDescription={setSolicitudDescription}
        setChoosenLabel={setChoosenLabel}
        setIsVisibleMap={setIsVisibleMap}
        locationSolicitud={locationSolicitud}
      />
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />
      <Button
        title="Crear Solicitud"
        onPress={addSolicitud}
        buttonStyle={styles.btnAddSolicitud}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationSolicitud={setLocationSolicitud}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function FormAdd(props) {
  const {
    setSolicitudName,
    setSolicitudAddress,
    setSolicitudDescription,
    setChoosenLabel,
    setIsVisibleMap,
    locationSolicitud,
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Titulo"
        containerStyle={styles.input}
        onChange={(e) => setSolicitudName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Dirección"
        containerStyle={styles.input}
        onChange={(e) => setSolicitudAddress(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationSolicitud ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
      />
      <Input
        placeholder="Descripcion del problema"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setSolicitudDescription(e.nativeEvent.text)}
      />
      <RNPickerSelect
        containerStyle={styles.input}
        onValueChange={(value) => {
          setChoosenLabel(value);
        }}
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
  );
}

function Map(props) {
  const {
    isVisibleMap,
    setIsVisibleMap,
    setLocationSolicitud,
    toastRef,
  } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const status = await Location.requestPermissionsAsync();
      if (status.status !== "granted") {
        toastRef.current.show(
          "Tienes que aceptar los permisos de localizacion para crear un solicitud",
          3000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationSolicitud(location);
    toastRef.current.show("Localizacion guardada correctamente");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicacion"
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar Ubicacion"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected } = props;

  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manualmente.",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar ninguna imagen",
          2000
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar Imagen",
      "¿Estas seguro de que quieres eliminar la imagen?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImages}>
      {size(imagesSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imagesSelected, (imageSolicitud, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageSolicitud }}
          onPress={() => removeImage(imageSolicitud)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddSolicitud: {
    backgroundColor: "#F7931C",
    margin: 20,
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680",
  },
});
