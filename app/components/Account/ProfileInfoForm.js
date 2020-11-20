import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import Loading from "../../components/Loading";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";

const db = firebase.firestore(firebaseApp);

export default function ProfileInfoWorker(props) {
  const { toastRef, isTrabajador } = props;
  const [loading, setLoading] = useState(false);
  const [choosenLabel, setChoosenLabel] = useState("");
  // Datos del formulario:
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [login, setLogin] = useState(false);
  //DATOS DE PRUEBA
  const navigation = useNavigation();

  var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    !user ? setLogin(false) : setLogin(true);
    setUserData(user);
  });
  unsubscribe();

  function onSubmit() {
    if (!nombres || !apellidos || !telefono) {
      toastRef.current.show("Todos los campos del formulario son obligatorios");
    } else {
      let perfilRef = db.collection("perfil-final");
      perfilRef
        .add({
          userId: firebase.auth().currentUser.uid,
          email: firebase.auth().currentUser.email,
          tipoUsuario: isTrabajador ? "trabajador" : "cliente",
          nombres: nombres,
          apellidos: apellidos,
          telefono: telefono,
          especialidad: choosenLabel,
          estado: 0,
          createdAt: new Date(),
        })
        .then(() => {
          firebase
            .auth()
            .currentUser.updateProfile({
              displayName: nombres + " " + apellidos,
            })
            .then(function () {
              navigation.navigate("account");
            });
        })
        .catch(() => {
          toastRef.current.show("Error al enviar solicitud");
        });
    }
  }

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Nombres"
        containerStyle={styles.inputForm}
        onChange={(e) => setNombres(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="face-profile"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Apellidos"
        containerStyle={styles.inputForm}
        onChange={(e) => setApellidos(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="face-profile"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Telefono"
        containerStyle={styles.inputForm}
        onChange={(e) => setTelefono(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="cellphone-basic"
            iconStyle={styles.iconRight}
          />
        }
      />

      <RNPickerSelect
        containerStyle={styles.input}
        onValueChange={(value) => {
          setChoosenLabel(value);
        }}
        placeholder={{
          label: "Selecciona una especialidad",
          value: null,
        }}
        items={[
          { label: "Electricidad", value: "electricidad" },
          { label: "Gasfitería", value: "gasfiteria" },
          { label: "Albañilería", value: "albañileria" },
        ]}
      />

      <Button
        title="Unirse"
        containerStyle={styles.btnRegisterForm}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      />
      <Button
        containerStyle={styles.btnRegisterForm}
        buttonStyle={styles.btnRegister}
        title="Testear"
        tipoUsuario={tipoUsuario}
      />
      <Loading isVisible={loading} text="Creando Cuenta" />
    </View>
  );
}
const styles = StyleSheet.create({
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnRegisterForm: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "#F7931C",
  },
  iconRight: {
    color: "#c1c1c1",
  },
});
