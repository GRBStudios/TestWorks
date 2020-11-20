import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import { validateEmail } from "../../utils/validateEmail";
import { isEmpty, result, set, size } from "lodash";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../components/Loading";
import RNPickerSelect from "react-native-picker-select";

const db = firebase.firestore(firebaseApp);

export default function ProfileInfoWorker(props) {
  const { toastRef, navigation } = props;
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const [realoadUserInfo, setRealoadUserInfo] = useState(false);
  const [userData, setUserData] = useState(null);
  const [choosenLabel, setChoosenLabel] = useState("");
  // Datos del formulario:
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [login, setLogin] = useState(false);
  const [displayName, setDisplayName] = useState("");
  //DATOS DE PRUEBA
  const [userInfo, setUserInfo] = useState("");
  const [isTrabajador, setIsTrabajador] = useState(null);
  const [isCliente, setIsCliente] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [userDatos, setUserDatos] = useState("");
  var unsuscribed = firebase.auth().onAuthStateChanged((user) => {
    setUserInfo(user);
    !userInfo ? setLogin(false) : setLogin(true);

    return unsuscribed();
  });

  async function onSubmit() {
    if (!nombres || !apellidos || !telefono) {
      toastRef.current.show("Todos los campos del formulario son obligatorios");
    } else {
      let perfilRef = db.collection("perfil-final");
      let response = await firebase
        .auth()
        .currentUser.updateProfile({
          displayName: nombres + " " + apellidos,
        })
        .then(() => {
          let response2 = perfilRef.add({
            userId: firebase.auth().currentUser.uid,
            email: firebase.auth().currentUser.email,
            tipoUsuario: isCliente ? "cliente" : "trabajador",
            nombres: nombres,
            apellidos: apellidos,
            telefono: telefono,
            especialidad: choosenLabel,
            estado: 0,
            createdAt: new Date(),
          });
        })
        .catch(() => {
          toastRef.current.show("Error al enviar solicitud");
        });

      return response;
    }
  }

  return (
    <View style={styles.formContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: "black",
            marginLeft: 15,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Icon
            type="material-community"
            name="account"
            size={60}
            iconStyle={isCliente ? styles.pressedIcon : styles.icon}
            onPress={() => {
              setIsCliente(true);
              setTipoUsuario("cliente");
              setIsTrabajador(false);
            }}
          />
          <Text
            style={{
              alignSelf: "center",
              fontSize: 15,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Cliente
          </Text>
        </View>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: "black",
            marginLeft: 15,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Icon
            type="material-community"
            name="account"
            size={60}
            containerStyle={{ width: 50, justifyContent: "center" }}
            iconStyle={isTrabajador ? styles.pressedIcon : styles.icon}
            onPress={() => {
              setIsCliente(false);
              setTipoUsuario("trabajador");
              setIsTrabajador(true);
            }}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Trabajador
          </Text>
        </View>
      </View>
      <Input
        placeholder="Nombres"
        style={{ fontSize: 18 }}
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
        style={{ fontSize: 18 }}
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
        style={{ fontSize: 18 }}
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
      {isTrabajador ? (
        <RNPickerSelect
          containerStyle={styles.input}
          onValueChange={(value) => {
            setChoosenLabel(value);
          }}
          placeholder={{
            label: "Selecciona una especialidad",
            value: null,
          }}
          style={styles.textPicker}
          items={[
            { label: "Electricidad", value: "electricidad" },
            { label: "Gasfitería", value: "gasfiteria" },
            { label: "Albañilería", value: "albañileria" },
          ]}
        />
      ) : null}

      <View>
        <Button
          title="Unirse"
          containerStyle={styles.btnRegisterForm}
          buttonStyle={styles.btnRegister}
          onPress={() => {
            onSubmit().then(() => {
              let user = firebase.auth().currentUser;
              user.reload().then(() => {
                const refreshUser = firebase.auth().currentUser;
                setUserDatos(refreshUser);
                navigation.navigate("account");
              });
            });
          }}
        />
        <Button
          containerStyle={styles.btnRegisterForm}
          buttonStyle={styles.btnRegister}
          title="Testear"
          onPress={() => console.log("tipo:", tipoUsuario)}
        />
      </View>

      <Loading isVisible={loading} text="Creando Cuenta" />
    </View>
  );
}
function defaultFormValue() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
    especialidad: "",
    telefono: "",
  };
}

const styles = StyleSheet.create({
  icon: {
    color: "white",
  },
  pressedIcon: {
    color: "#F7931C",
  },
  textPicker: {
    fontSize: 20,
  },

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
