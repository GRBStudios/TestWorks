import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListSolicitudes(props) {
  const { solicitudes, handleLoadMore, isLoading } = props;
  const navigation = useNavigation();

  return (
    <View>
      {size(solicitudes) > 0 ? (
        <FlatList
          data={solicitudes}
          renderItem={(solicitud) => (
            <Solicitud solicitud={solicitud} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderSolicitudes}>
          <ActivityIndicator size="large" />
          <Text>Cargando solicitudes</Text>
        </View>
      )}
    </View>
  );
}

function Solicitud(props) {
  const { solicitud, navigation } = props;
  const { id, imagenes, titulo, direccion, descripcion } = solicitud.item;
  const imageSolicitud = imagenes ? imagenes[0] : null;

  const goSolicitud = () => {
    navigation.navigate("solicitud", {
      id,
      titulo,
    });
  };
  return (
    <TouchableOpacity onPress={goSolicitud}>
      <View style={styles.viewSolicitud}>
        <View style={styles.viewSolicitudImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={
              imageSolicitud
                ? { uri: imageSolicitud }
                : require("../../../assets/img/no-image.png")
            }
            style={styles.imageSolicitud}
          />
        </View>
        <View>
          <Text style={styles.solicitudName}>{titulo}</Text>
          <Text style={styles.solicitudAddress}>{direccion}</Text>
          <Text style={styles.solicitudDescription}>
            {descripcion.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loaderSolicitudes}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundSolicitudes}>
        <Text>No quedan solicitudes por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  loaderSolicitudes: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  viewSolicitud: {
    flexDirection: "row",
    margin: 10,
  },
  viewSolicitudImage: {
    marginRight: 15,
  },
  imageSolicitud: {
    width: 80,
    height: 80,
  },
  solicitudName: {
    fontWeight: "bold",
  },
  solicitudAddress: {
    paddingTop: 2,
    color: "grey",
  },
  solicitudDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  notFoundSolicitudes: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
