import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SolicitudesWorker from "../screens/Solicitudes/Trabajador/SolicitudesWorker";
import SolicitudWorker from "../screens/Solicitudes/Trabajador/SolicitudWorker";
import AddSolicitud from "../screens/Solicitudes/AddSolicitud";

const Stack = createStackNavigator();

export default function SolicitudesWorkerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="solicitudesworker"
        component={SolicitudesWorker}
        options={{ title: "Solicitudes Disponibles" }}
      />
      <Stack.Screen name="solicitudworker" component={SolicitudWorker} />
      <Stack.Screen
        name="addsolicitud"
        component={AddSolicitud}
        options={{ title: "Añadir Solicitud" }}
      />
    </Stack.Navigator>
  );
}
