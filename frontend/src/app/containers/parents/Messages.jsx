import PersonDetails from "../../components/PersonDetails";
import Message from "./../../components/Message";
import Form from "./../../components/Form";
import Input from "./../../components/Input";
import SubmitButton from "./../../components/SubmitButton";

import { database } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import useParentAuth from "./../../context/auth/useParentAuth";
import { useEffect, useState } from "react";
import useApi from "./../../hooks/useApi";
import {
  createChatConversation,
  getSpecificDriver,
  messageNotifications,
  send,
  unReadMessages,
} from "../../firebase/firebaseCalls/chat";

const Messages = () => {
  const { parent } = useParentAuth();
  const [persons, setPersons] = useState([]);
  const [header, setHeader] = useState({
    id: "",
    name: "",
    image: "",
    designation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState();
  const [messagesNumber, setMessagesNumber] = useState();
  const { getDocumentByInstitute } = useApi();
  console.log(parent);

  const getPersons = async () => {
    const admins = await getDocumentByInstitute("admin", parent.institute);
    const driver = await getSpecificDriver(parent);

    console.log("driver : ", driver);
    setPersons([...admins, ...driver]);
  };

  const handlePersonClick = async (person) => {
    setHeader({
      id: person.id,
      name: person.firstname + " " + person.lastname,
      image: person.image,
      designation: person.designation,
      pushToken: person.pushToken,
    });

    console.log("Person : ", person);
    const docRef = doc(database, "notifications", person.messageNumberId);
    await updateDoc(docRef, { messageRead: true });
  };

  const createConversation = async () => {
    try {
      const data = {
        conversation: [parent.id, header.id],
      };
      const conversation = await createChatConversation(data, parent, header);
      // setTimeout(() => {
      //   dummy.current.scrollIntoView({ behavior: "smooth" });
      // }, 1000);
      setConversation(conversation);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessagesNumber = async () => {
    const messagesCollection = collection(database, "notifications");
    const q = query(
      messagesCollection,
      where("notificationReceive", "==", parent.institute),
      where("receiverId", "==", parent.id),
      where("messageRead", "==", false)
    );
    const messagesSnapshot = await getDocs(q);
    const messages = messagesSnapshot.docs.map((messages) => ({
      id: messages.id,
      ...messages.data(),
    }));
    setMessagesNumber(messages);
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
        senderId: parent.id,
        reveiverId: header.id,
        conversationId: conversation.conversationId,
        createdAt: serverTimestamp(),
      };

      const messageNotification = {
        messageRead: false,
        notificationReceive: parent.institute,
        receiverId: header.id,
        senderId: parent.id,
        conversationId: conversation.conversationId,
        data: [],
      };

      console.log("Header : ", header);
      resetForm();
      await send(data);
      if (header.pushToken)
        sendPushNotification(header.pushToken, "New message", values.message);
      const unReadMessage = await unReadMessages(parent, conversation);
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
      // dummy.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log(error);
    }
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

    console.log(messages);

    setIsLoading(false);
  };

  useEffect(() => {
    if (header.id) createConversation();
  }, [header]);

  useEffect(() => {
    getMessagesNumber();
    getPersonChat();
    getPersons();
  }, [messages, conversation]);

  return (
    <div className="container-fluid parent-message-container p-0">
      <div className="row parent-messages">
        <div className="col-4 parent-chat-people p-0 ps-2">
          {persons.map((person) => {
            person.messagesCount = 0;
            person.messageNumberId = "";
            messagesNumber.forEach((messages) => {
              if (messages.senderId === person.id) {
                person.messagesCount = messages.data.length;
                person.messageNumberId = messages.id;
              }
            });
            return (
              <PersonDetails
                name={person.firstname + " " + person.lastname}
                designation={person.designation}
                image={person.image}
                messagesNumber={person.messagesCount}
                handleClick={() => handlePersonClick(person)}
              />
            );
          })}
        </div>

        <div className="col-8 message-container">
          <header className="message-header">
            <img
              src={
                header.image
                  ? header.image
                  : require("../../assets/profile-avatar.jpg")
              }
              alt="profile"
              className="profile-image profile-rounded-image"
            />
            <div className="user-details">
              <h5 className="name">{header.name}</h5>
              <h6>{header.designation}</h6>
            </div>
          </header>
          <div className="line"></div>
          <div className="messages pe-2">
            {messages.map((message) => (
              <Message
                message={message.message}
                own={parent.id === message.senderId}
                id={message.id}
              />
            ))}
          </div>
          <div className="send-message-container">
            <Form initialValues={{ message: "" }} onSubmit={sendMessage}>
              <Input
                inputClasses={"messages-input"}
                placeholder="Send Message"
                name="message"
                type="text"
              />
              <SubmitButton
                isParentButton={true}
                disabled={!header.id ? true : false}
                title="Send"
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
