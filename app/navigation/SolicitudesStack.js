import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Solicitudes from "../screens/Solicitudes/Cliente/Solicitudes";
import Solicitud from "../screens/Solicitudes/Cliente/Solicitud";

import AddSolicitud from "../screens/Solicitudes/AddSolicitud";
import PerfilContactoSolicitud from "../components/Solicitudes/PerfilContactoSolicitud";

const Stack = createStackNavigator();

export default function SolicitudesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="solicitudes"
        component={Solicitudes}
        options={{ title: "Tus Solicitudes" }}
      />
      <Stack.Screen name="solicitud" component={Solicitud} />

      <Stack.Screen
        name="addsolicitud"
        component={AddSolicitud}
        options={{ title: "Añadir Solicitud" }}
      />
      <Stack.Screen
        name="perfilpostulante"
        component={PerfilContactoSolicitud}
        options={{ title: "Añadir Solicitud" }}
      />
    </Stack.Navigator>
  );
}
