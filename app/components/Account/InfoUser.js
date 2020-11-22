import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Button, Accessory, Icon } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../../components/Loading";

const db = firebase.firestore(firebaseApp);

export default function InfoUser(props) {
  const {
    userInfo: { uid, photoURL, displayName, email },
    userData,
    toastRef,
    setLoading,
    setLoadingText,
  } = props;

  const [login, setLogin] = useState(null);

  const pickImage = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;

    if (resultPermissionCamera === "denied") {
      toastRef.current.show("Es necesario aceptar los permisos de la galeria");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (result.cancelled) {
        toastRef.current.show("Has cerrado la seleccion de imagenes");
      } else {
        console.log("Primer result: ", result);
        uploadImage(result.uri)
          .then(() => {
            console.log("Segundo result: ", result);
            updatePhotoUrl();
            setLoading(false);
          })
          .catch(() => {
            console.log("Resultado: ", result);
            toastRef.current.show("Error al actualizar el avatar.");
          });
      }
    }
  };

  const uploadImage = async (uri) => {
    console.log("Subiendo imagen: ", uri);
    setLoadingText("Actualizando Avatar");
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`avatar/${userData.uid}`);
    return ref.put(blob);
  };

  const updatePhotoUrl = () => {
    firebase
      .storage()
      .ref(`avatar/${userData.uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };
        await firebase.auth().currentUser.updateProfile(update);
        ldb.collection("perfil-final").doc(userData.userId).update({
          photoURL: response,
        });

        setLoading(false);
      })
      .catch(() => {
        toastRef.current.show("Error al actualizar el avatar.");
      });
  };

  let imageURL;
  if (photoURL) {
    imageURL = photoURL;
  } else {
    imageURL =
      "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png";
  }
  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        containerStyle={styles.userInfoAvatar}
        rounded
        size="large"
        source={{ uri: imageURL }}
        onPress={pickImage}
      >
        <Accessory size={30} />
      </Avatar>
      <View>
        <Text style={styles.displayName}>
          {userData ? firebase.auth().currentUser.displayName : "Anónimo"}
        </Text>
        <Text>
          {userData ? firebase.auth().currentUser.email : "Socia Login"}
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
