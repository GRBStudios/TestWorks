import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import SolicitudesStack from "./SolicitudesStack";
/* import BuscarStack from "./BuscarStack";
import TopRestaurantsStack from "./TopRestaurantsStack"; */
import AccountStack from "./AccountStack";
//import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";

//const db = firebase.firestore(firebaseApp);

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [login, setLogin] = useState(null);

  firebase.auth().onAuthStateChanged((user) => {
    !user ? setLogin(false) : setLogin(true);
    if (!user) {
      setTipoUsuario("");
    }
  });
  /*   useEffect(() => {
    let isSubscribed = true;
    if (login) {
      let perfilRef = db.collection("perfiles");
      perfilRef
        .where("userId", "==", firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.log("No matching documents.");
            return;
          }
          snapshot.forEach((doc) => {
            if (isSubscribed) {
              setTipoUsuario(doc.data().tipoUsuario);
            }
          });
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    }
    return () => (isSubscribed = false);
  }, [tipoUsuario]); */

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="account"
        tabBarOptions={{
          inactiveTintColor: "#646464",
          activeTintColor: "#F7931C",
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
        })}
      >
        {/*       <Tab.Screen
          name="solicitudes"
          component={SolicitudesStack}
          options={{ title: "Solicitudes" }}
        /> */}
        <Tab.Screen
          name="account"
          component={AccountStack}
          options={{ title: "Cuenta" }}
        ></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case "restaurants":
      iconName = "compass-outline";
      break;
    case "solicitudesworker":
      iconName = "compass-outline";
      break;
    case "favorites":
      iconName = "progress-upload";
      break;
    case "toprestaurants":
      iconName = "star-outline";
      break;
    case "buscar":
      iconName = "magnify";
      break;
    case "account":
      iconName = "home-outline";
      break;
    default:
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
}
