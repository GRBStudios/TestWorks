import React, { useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddSolicitudForm from "../../components/Solicitudes/AddSolicitudForm";

export default function AddSolicitud(props) {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();

  return (
    <View>
      <AddSolicitudForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Creando Solicitud" />
    </View>
  );
}
