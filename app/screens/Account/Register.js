import React, { useRef } from "react";

import { StyleSheet, View, Text, Image } from "react-native";
import RegisterForm from "../../components/Account/RegisterForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";

export default function Register() {
  const toastRef = useRef();

  console.log(toastRef);
  return (
    <KeyboardAwareScrollView>
      <View>
        <Image
          source={require("../../../assets/img/logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={styles.viewForm}>
          <RegisterForm toastRef={toastRef} />
        </View>
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: "80%",
    height: 150,
    marginTop: 20,
    alignSelf: "center",
  },
  viewForm: {
    marginRight: 40,
    marginLeft: 40,
  },
});
