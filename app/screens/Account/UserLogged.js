import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import firebase from "firebase/app";
import InfoUser from "../../components/Account/InfoUser";
import Loading from "../../components/Loading";
import Toast from "react-native-easy-toast";
export default function UserLogged() {
  const [userInfo, setUserInfo] = useState("");
  const [userData, setUserData] = useState("");
  const [realoadUserInfo, setRealoadUserInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando perfil...");
  const toastRef = useRef();
  //Probar con rescatar los datos de otra tabla.
  //El onAuthStateChanged no reconoce el valor del displayName debido a que
  //al guardarse, no hay cambio en el estado del logueo, asi que no hace el nuevo setUser
  //hasta que se hace un hot-relaod

  //POSIBLE SOLUCIÓN:
  /* UNA VEZ EJECUTADO EL UPDATE DEL DISPLAYNAME, AGREGAR UN 
  3ER THEN() Y SETEAR EL NUEVO ESTADO CON LOS DATOS DEL USUARIO
  Y PASARLO POR PROPS */
  useEffect(() => {
    async function fetchUser() {
      const user = await firebase.auth().currentUser;
      user
        ? await user.reload().then(function () {
            setUserInfo(firebase.auth().currentUser);
          })
        : console.log("No recargar usuario, por estar deslogeado");
      setLoading(false);
    }
    fetchUser();
  }, []);

  return (
    <View>
      <InfoUser
        userInfo={userInfo}
        userData={userInfo}
        toastRef={toastRef}
        setLoading={setLoading}
        setLoadingText={setLoadingText}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />

      <Button
        buttonStyle={styles.btnCerrarSesion}
        title="Cerrar Sesión"
        onPress={() => firebase.auth().signOut()}
      />
      <Loading text={loadingText} isVisible={loading} />
    </View>
  );
}
const styles = StyleSheet.create({
  btnCerrarSesion: {
    backgroundColor: "#F7931C",
    borderRadius: 8,
    width: "80%",
    margin: 20,
    padding: 8,
    alignSelf: "center",
  },
});
