import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import firebase from "firebase/app";
import InfoUser from "../../components/Account/InfoUser";
import Loading from "../../components/Loading";

export default function UserLogged() {
  const [userInfo, setUserInfo] = useState("");
  const [userDatos, setUserDatos] = useState("");
  const [realoadUserInfo, setRealoadUserInfo] = useState(false);

  const user = firebase.auth().currentUser;
  user.reload().then(() => {
    const refreshUser = firebase.auth().currentUser;
    setUserDatos(refreshUser);
    console.log("antes de: ", userDatos);
  });

  //Probar con rescatar los datos de otra tabla.
  //El onAuthStateChanged no reconoce el valor del displayName debido a que
  //al guardarse, no hay cambio en el estado del logueo, asi que no hace el nuevo setUser
  //hasta que se hace un hot-relaod

  //POSIBLE SOLUCIÓN:
  /* UNA VEZ EJECUTADO EL UPDATE DEL DISPLAYNAME, AGREGAR UN 
  3ER THEN() Y SETEAR EL NUEVO ESTADO CON LOS DATOS DEL USUARIO
  Y PASARLO POR PROPS */

  return (
    <View>
      <Text>Hola</Text>
      <InfoUser userInfo={userInfo} userDatos={userDatos} />
      <Button title="test" onPress={() => console.log(userInfo)} />
      <Button title="Cerrar" onPress={() => firebase.auth().signOut()} />
    </View>
  );
}
