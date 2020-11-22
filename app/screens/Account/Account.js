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

  let isSubscribed = firebase.auth().onAuthStateChanged((user) => {
    !user ? setLogin(false) : setLogin(true);
    return isSubscribed;
  });

  if (login === null) return <Loading isVisible={true} text="Cargando" />;

  return login ? <UserLogged /> : <UserGuest />;
}
