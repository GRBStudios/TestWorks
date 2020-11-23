import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Buscar from "../screens/Buscar";
import PerfilBusqueda from "../components/Busqueda/PerfilBusqueda";

const Stack = createStackNavigator();

export default function BuscarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="buscar"
        component={Buscar}
        options={{ title: "Buscar" }}
      />
      <Stack.Screen
        name="verPerfil"
        component={PerfilBusqueda}
        options={{ title: "Perfil Trabajador" }}
      />
    </Stack.Navigator>
  );
}
