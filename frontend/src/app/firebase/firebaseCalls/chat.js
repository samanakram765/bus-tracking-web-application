import { async } from "@firebase/util";
import {
  collection,
  where,
  query,
  getDocs,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { database } from "../firebaseConfig";

export const getAdmins = async (user) => {
  const adminCollection = collection(database, "admin");
  const q = query(adminCollection, where("institute", "==", user.institute));

  const adminSnapshot = await getDocs(q);
  const admins = adminSnapshot.docs
    .map((admins) => ({
      id: admins.id,
      ...admins.data(),
    }))
    .filter((admins) => admins.id !== user.id);
  return admins;
};

export const getParents = async (user) => {
  const parentCollection = collection(database, "parent");
  const q = query(parentCollection, where("institute", "==", user.institute));

  const parentSnapshot = await getDocs(q);
  const parents = parentSnapshot.docs.map((admin) => ({
    id: admin.id,
    ...admin.data(),
  }));

  return parents;
};

export const getDrivers = async (user) => {
  const driverCollection = collection(database, "drivers");
  const q = query(driverCollection, where("institute", "==", user.institute));

  const driverSnapshot = await getDocs(q);
  const drivers = driverSnapshot.docs.map((driver) => ({
    id: driver.id,
    ...driver.data(),
  }));

  return drivers;
};

export const getSpecificDriver = async (user) => {
  const driverCollection = collection(database, "drivers");
  const q = query(
    driverCollection,
    where("institute", "==", user.institute),
    where("busNo", "==", user.busNo)
  );

  const driverSnapshot = await getDocs(q);
  const driver = driverSnapshot.docs.map((driver) => ({
    id: driver.id,
    ...driver.data(),
  }));

  return driver;
};

export const send = async (data) => {
  const messagesCollections = collection(database, "messages");
  await addDoc(messagesCollections, data);
};

export const unReadMessages = async (sender, conversation) => {
  try {
    const notificationsCollection = collection(database, "notifications");
    const q = query(
      notificationsCollection,
      where("messageRead", "==", false),
      where("senderId", "==", sender.id),
      where("conversationId", "==", conversation.conversationId)
    );
    const unReadMessagesSnapshot = await getDocs(q);
    const unReadMessages = unReadMessagesSnapshot.docs.map((message) => ({
      id: message.id,
      ...message.data(),
    }));

    return unReadMessages;
  } catch (error) {
    console.log("Notifications ERROR: ", error);
  }
};

export const messageNotifications = async (data) => {
  const notificationCollection = collection(database, "notifications");
  await addDoc(notificationCollection, data);
};

export const getChatConversation = async (collection, userId, receiverId) => {
  const q = query(collection, where("conversation", "array-contains", userId));

  const snapshot = await getDocs(q);
  const conversations = snapshot.docs.map((snapshot) => ({
    conversationId: snapshot.id,
    ...snapshot.data(),
  }));

  console.log(conversations);
  const conversation = conversations.filter((convo) => {
    if (
      convo.conversation.includes(receiverId) &&
      convo.conversation.includes(userId)
    )
      return convo;
  });

  return conversation;
};

export const createChatConversation = async (data, user, header) => {
  const conversationCollection = collection(database, "conversation");

  const convo = await getChatConversation(
    conversationCollection,
    user.id,
    header.id
  );

  console.log(convo);

  if (convo.length === 0) {
    const result = await addDoc(conversationCollection, data);

    return {
      conversationId: result.id,
      ...data,
    };
  }

  return convo[0];
};

export const getMessages = (conversation) => {
  let chatMessages = [];
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
    console.log(chats);
    chatMessages = [...chats];
  });

  return chatMessages;
};
