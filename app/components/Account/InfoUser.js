import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../../components/Loading";

export default function InfoUser(props) {
  const {
    userInfo: { uid, photoURL, displayName, email },
    userDatos,
    toastRef,
    setLoading,
    setLoadingText,
  } = props;

  const [login, setLogin] = useState(null);

  const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;

    if (resultPermissionCamera === "denied") {
      toastRef.current.show("Es necesario aceptar los permisos de la galeria");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show("Has cerrado la seleccion de imagenes");
      } else {
        uploadImage(result.uri)
          .then(() => {
            updatePhotoUrl();
          })
          .catch(() => {
            toastRef.current.show("Error al actualizar el avatar.");
          });
      }
    }
  };

  const uploadImage = async (uri) => {
    setLoadingText("Actualizando Avatar");
    setLoading(true);

    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blob);
  };

  const updatePhotoUrl = () => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setLoading(false);
      })
      .catch(() => {
        toastRef.current.show("Error al actualizar el avatar.");
      });
  };

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        showEditButton
        onEditPress={changeAvatar}
        containerStyle={styles.userInfoAvatar}
        source={
          photoURL
            ? { uri: photoURL }
            : require("../../../assets/img/no-image.png")
        }
      />
      <View>
        <Text style={styles.displayName}>
          {userDatos ? firebase.auth().currentUser.displayName : "Anónimo"}
        </Text>
        <Text>
          {userDatos ? firebase.auth().currentUser.email : "Socia Login"}
        </Text>
      </View>
      <Button
        title="TEST"
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionText}
        onPress={() => console.log("Aber", props)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30,
  },
  userInfoAvatar: {
    marginRight: 20,
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
});
