import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { database } from "./../../firebase/firebaseConfig";
import {
  collection,
  where,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import useAuth from "./../../context/auth/useAuth";
import MessagesBox from "../../components/MessagesBox";
import {
  createChatConversation,
  getAdmins,
  getDrivers,
  getParents,
  messageNotifications,
  send,
  unReadMessages,
} from "../../firebase/firebaseCalls/chat";
import ChatPeople from "../../components/ChatPeople";

const validationSchema = Yup.object().shape({
  message: Yup.string().required().label("Message Box"),
});

const Messages = () => {
  const { user } = useAuth();
  const [persons, setPersons] = useState([]);
  const [header, setHeader] = useState({
    id: "",
    name: "",
    image: "",
    designation: "",
  });
  const [messagesNumber, setMessagesNumber] = useState();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  console.log("User messages : ", user);
  const dummy = useRef();

  const getAllAdmins = async () => {
    try {
      const admins = await getAdmins(user);

      return admins;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllParents = async () => {
    try {
      const parents = await getParents(user);

      return parents;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDrivers = async () => {
    try {
      const drivers = await getDrivers(user);

      return drivers;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllPeople = async () => {
    const admins = await getAllAdmins();
    const parents = await getAllParents();
    const drivers = await getAllDrivers();
    setPersons([...admins, ...parents, ...drivers]);
  };

  async function sendPushNotification(expoPushToken, title, body) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: { someData: "goes here" },
    };

    console.log("TOken ,", message);
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      mode: "no-cors",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  const sendMessage = async (values, { resetForm }) => {
    try {
      const data = {
        message: values.message,
        senderId: user.id,
        reveiverId: header.id,
        conversationId: conversation.conversationId,
        createdAt: serverTimestamp(),
      };

      const messageNotification = {
        messageRead: false,
        notificationReceive: user.institute,
        receiverId: header.id,
        conversationId: conversation.conversationId,
        senderId: user.id,
        data: [],
      };
      resetForm();
      await send(data);
      if (header.pushToken)
        sendPushNotification(header.pushToken, "New message", values.message);
      const unReadMessage = await unReadMessages(user, conversation);
      console.log("Messages Zaid Saleem: ", unReadMessage);

      delete data.createdAt;
      if (unReadMessage.length > 0) {
        // update the collection
        messageNotification.data = [...unReadMessage[0].data, data];

        const docRef = doc(database, "notifications", unReadMessage[0].id);

        await updateDoc(docRef, messageNotification);
        return;
      }
      messageNotification.data = [data];
      await messageNotifications(messageNotification);
      dummy.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePersonClick = async (person) => {
    setHeader({
      id: person.id,
      name: person.fullName
        ? person.fullName
        : person.firstname + " " + person.lastname,
      image: person.image,
      designation: person.designation,
      pushToken: person.pushToken,
    });
    const docRef = doc(database, "notifications", person.messageNumberId);
    await updateDoc(docRef, { messageRead: true });
  };

  const createConversation = async () => {
    try {
      const data = {
        conversation: [user.id, header.id],
      };
      const conversation = await createChatConversation(data, user, header);
      setTimeout(() => {
        dummy.current.scrollIntoView({ behavior: "smooth" });
      }, 1000);
      setConversation(conversation);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessagesNumber = async () => {
    const messagesCollection = collection(database, "notifications");
    const q = query(
      messagesCollection,
      where("notificationReceive", "==", user.institute),
      where("receiverId", "==", user.id),
      where("messageRead", "==", false)
    );
    onSnapshot(q, (messagesSnapshot) => {
      const messages = messagesSnapshot.docs.map((messages) => ({
        id: messages.id,
        ...messages.data(),
      }));
      setMessagesNumber(messages);
    });
  };

  const getPersonChat = () => {
    if (!header.id) return null;

    setIsLoading(true);
    const chatCollections = collection(database, "messages");
    const q = query(
      chatCollections,
      where("conversationId", "==", conversation.conversationId),
      orderBy("createdAt", "asc")
    );
    onSnapshot(q, (chatSnapshot) => {
      const chats = chatSnapshot.docs.map((chat) => ({
        id: chat.id,
        ...chat.data(),
      }));
      setMessages(chats);
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (header.id) createConversation();
  }, [header]);

  useEffect(() => {
    getAllPeople();
    getMessagesNumber();
    getPersonChat();
  }, [messages, conversation]);

  return (
    <div className="chat-system">
      <h1>Messages</h1>
      <div className="row mt-3 chat-container">
        <MessagesBox
          dummy={dummy}
          header={header}
          messages={messages}
          sendMessage={sendMessage}
          validationSchema={validationSchema}
          user={user}
          isLoading={isLoading}
        />

        <ChatPeople
          persons={persons}
          messagesNumber={messagesNumber}
          handlePersonClick={handlePersonClick}
        />
      </div>
    </div>
  );
};

export default Messages;
