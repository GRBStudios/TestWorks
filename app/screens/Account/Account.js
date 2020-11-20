import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import AddProfileInfo from "./AddProfileInfo";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Account() {
  const [login, setLogin] = useState(null);
  const [userData, setUserData] = useState(null);

  firebase.auth().onAuthStateChanged((user) => {
    const info = firebase.auth().currentUser;
    if (user) {
      info.reload().then(() => {
        const refreshUser = firebase.auth().currentUser;
        setUserData(refreshUser);
        console.log("antes de: ", userDatos);
      });
    }

    !user ? setLogin(false) : setLogin(true);
  });

  if (login === null) return <Loading isVisible={true} text="Cargando..." />;

  return login ? <UserLogged /> : <UserGuest />;
}
