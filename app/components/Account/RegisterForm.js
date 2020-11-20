import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import { validateEmail } from "../../utils/validateEmail";
import { isEmpty, size } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Loading";
export default function RegisterForm(props) {
  const { toastRef } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
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
        .then(() => {
          setLoading(false);
          navigation.navigate("extrainfo");
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
