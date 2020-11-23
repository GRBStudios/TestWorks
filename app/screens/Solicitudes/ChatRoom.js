import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Button, Input, Image } from "react-native-elements";

const db = firebase.firestore(firebaseApp);

export default function ChatRoom(props) {
  const { navigation, route } = props;
  const { id } = route.params;

  const [user] = useAuthState(firebase.auth());

  const [messages, setMessages] = useState([]);
  const messagesArray = [];
  const messagesRef = db.collection("messages");

  useEffect(() => {
    const query = messagesRef
      .where("idSolicitud", "==", id)
      .orderBy("createdAt")
      .limit(25)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          messagesArray.push(doc.data());
        });
        setMessages(messagesArray);
      });

    return () => {
      query;
    };
  }, [messagesArray]);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    const { uid, photoURL } = firebase.auth().currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      idSolicitud: id,
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <View style={styles.App}>
      <View style={styles.AppSection}>
        <View>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </View>

        <View style={styles.form} onSubmit={sendMessage}>
          <Input
            style={styles.input}
            value={formValue}
            onChange={(e) => setFormValue(e.nativeEvent.text)}
            placeholder="Escribe aquí tu mensaje"
            rightIcon={{
              name: "send",
              type: "material",
              onPress: sendMessage,
            }}
          />
        </View>
      </View>
    </View>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  let imageURL;
  if (photoURL) {
    imageURL = photoURL;
  } else {
    imageURL =
      "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png";
  }
  const messageClass =
    uid === firebase.auth().currentUser.uid ? "sent" : "received";

  return (
    <View
      style={
        uid === firebase.auth().currentUser.uid ? styles.sent : styles.received
      }
    >
      <Image style={styles.img} source={{ uri: imageURL }} />
      <Text
        style={
          uid === firebase.auth().currentUser.uid
            ? styles.pSent
            : styles.pReceived
        }
      >
        {text}
      </Text>
    </View>
  );
}
const HEIGHT = Dimensions.get("window").height;
let diezp = HEIGHT * 0.1;

const styles = StyleSheet.create({
  App: {
    textAlign: "center",
    maxWidth: 728,
    margin: 0,
  },
  AppHeader: {
    backgroundColor: "#181717",
    height: diezp,
    minHeight: 50,
    color: "white",
    position: "absolute",
    width: "100%",
    maxWidth: 728,
    top: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
    padding: 10,
  },
  AppSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: HEIGHT,
    backgroundColor: "#282535",
  },
  main: {
    padding: 10,
    height: HEIGHT * 0.8,
    marginTop: HEIGHT * 0.1,
    marginRight: 0,
    marginBottom: HEIGHT * 0.1,
    overflow: "scroll",
    display: "flex",
    flexDirection: "column",
  },

  form: {
    height: HEIGHT * 0.23,
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxWidth: 728,
    flex: 1,
    fontSize: 13,
    backgroundColor: "#181717",
  },
  btnForm: {
    width: "20%",
    backgroundColor: "#38388f",
  },
  input: {
    lineHeight: 1.5,
    width: "100%",
    fontSize: 15,
    backgroundColor: "#3a3a3a",
    color: "white",
    paddingTop: 0,
    paddingRight: 10,
  },
  button: {
    backgroundColor: "#282c34",
    color: "white",
    paddingTop: 15,
    paddingRight: 32,
    textAlign: "center",
    display: "none",
    fontSize: 15,
  },
  buttonDissabled: {
    opacity: 0.5,
  },
  p: {
    maxWidth: "500",
    marginBottom: "12",
    lineHeight: 24,
    padding: 10,
    borderRadius: 25,
    position: "relative",
    color: "white",
    textAlign: "center",
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
  sent: {
    flexDirection: "row-reverse",
  },
  received: {
    flexDirection: "row",
  },
  pSent: {
    maxWidth: 500,
    marginBottom: 12,
    lineHeight: 24,
    padding: 10,
    borderRadius: 25,
    position: "relative",
    color: "white",
    textAlign: "center",
    backgroundColor: "#0b93f6",
    alignSelf: "flex-end",
  },
  pReceived: {
    maxWidth: 500,
    marginBottom: 12,
    lineHeight: 24,
    paddingTop: 10,
    paddingRight: 20,
    borderRadius: 25,
    position: "relative",
    textAlign: "center",
    backgroundColor: "#e5e5ea",
    color: "black",
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 50,
    margin: 4,
  },
});
