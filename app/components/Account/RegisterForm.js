import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import { validateEmail } from "../../utils/validateEmail";
import { isEmpty, size } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Loading";
import RNPickerSelect from "react-native-picker-select";

import { firebaseApp } from "../../utils/Firebase";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function RegisterForm(props) {
  const { toastRef } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  // Datos del formulario:
  const [choosenLabel, setChoosenLabel] = useState("");

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [login, setLogin] = useState(false);
  const [displayName, setDisplayName] = useState("");
  //DATOS DE PRUEBA
  const [isTrabajador, setIsTrabajador] = useState(null);
  const [isCliente, setIsCliente] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("");

  const navigation = useNavigation();

  const onSubmit = () => {
    if (
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword)
    ) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("Ingrese un email válido.");
    } else if (formData.password !== formData.repeatPassword) {
      toastRef.current.show("Las contraseñas tienen que ser iguales.");
    } else if (
      size(formData.password) < 6 &&
      size(formData.repeatPassword) < 6
    ) {
      toastRef.current.show("La contraseña debe tener al menos 6 caracteres");
    } else {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(function (user) {
          user.user.updateProfile({
            displayName: nombres + " " + apellidos,
          });
        })
        .then(function () {
          let perfilRef = db.collection("perfil-final");
          perfilRef.add({
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
        .then(function () {
          setLoading(false);
          navigation.navigate("account");
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show("El correo electrónico ya está en uso");
        });
    }
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electrónico"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, "email")}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, "password")}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder="Repetir Contraseña"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, "repeatPassword")}
        password={true}
        secureTextEntry={showRepeatPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowRepeatPassword(!showRepeatPassword)}
          />
        }
      />

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
            containerStyle={styles.btnRegisterForm}
            buttonStyle={styles.btnRegister}
            title="Testear"
            onPress={() => console.log("tipo:", tipoUsuario)}
          />
        </View>

        <Loading isVisible={loading} text="Creando Cuenta" />
      </View>
      <Button
        title="Unirse"
        containerStyle={styles.btnRegisterForm}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Creando Cuenta" />
    </View>
  );
}
function defaultFormValue() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
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
