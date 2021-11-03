import React, { FormEvent, useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import io, { Socket } from "socket.io-client";

type User = {
  id: number;
  name: string;
};

type Message = {
  content: string;
  user?: User;
  createdAt: number;
};

function ChatBar() {
  const [text, settext] = useState("");
  const [socket, setsocket] = useState<Socket>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setsocket(newSocket);

    const handleFocus = (e: KeyboardEvent) => {
      if (inputRef.current === document.activeElement) {
        return;
      }

      inputRef.current?.focus();
    };

    document.addEventListener("keydown", handleFocus);

    return () => {
      newSocket.disconnect();
      document.removeEventListener("keydown", handleFocus);
    };
  }, []);

  const send = (message: string) => {
    socket?.emit("message", message);
  };

  const handleForm = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") {
      return;
    }

    send(text);
    settext("");
  };

  return (
    <form onSubmit={handleForm} className="bg-gray-200 w-full">
      <div className="container-width flex p-4">
        <input
          value={text}
          onChange={(e) => settext(e.target.value)}
          type="text"
          placeholder="Enter your message..."
          className="w-full p-2 rounded"
          ref={inputRef}
          autoFocus
        />
        <button className="bg-blue-500 text-white font-semibold p-2 px-4 ml-4 rounded">
          Submit
        </button>
      </div>
    </form>
  );
}

function MessagesComponent() {
  const [messages, setmessages] = useState<Message[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);

  const addMessage = (message: Message) => {
    setmessages((prevstate) => [...prevstate, message]);

    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  };

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("message", (message) => addMessage(message));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4 messages container-width" ref={messagesRef}>
      {messages.map((message, index) => (
        <MessageComponent message={message} key={index} />
      ))}
    </div>
  );
}

function MessageComponent({ message }: { message: Message }) {
  const username = message.user?.name || "Anonymous";
  const date = new Date(message.createdAt);
  const formattedDate = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}`;

  return (
    <div className="mt-4">
      <div className="flex items-baseline">
        <span className="font-bold text-xl text-blue-900">{username}</span>
        <span className="text-sm text-gray-600 ml-2" title={date.toISOString()}>
          {formattedDate}
        </span>
      </div>
      <p className="text-gray-800">{message.content}</p>
    </div>
  );
}

function Sidebar({ visible, toggle }: { visible: boolean; toggle(): void }) {
  return (
    <>
      <div
        className={`app__sidebar flex flex-col items-start bg-gray-800 p-4 ${
          visible ? "visible" : ""
        }`}
      >
        <h1 className="text-2xl text-gray-200 font-medium">Chat app</h1>
        <button onClick={toggle} className="text-gray-500 sidebar__toggle">
          Close menu
        </button>
      </div>
    </>
  );
}

function Header({ toggle }: { toggle(): void }) {
  return (
    <div className="p-4 bg-gray-700 bottom-0 left-0 right-0 app__header">
      <button onClick={toggle}>Open menu</button>
    </div>
  );
}

function App() {
  const [visible, setvisible] = useState(false);

  const toggle = () => setvisible((prevState) => !prevState);

  return (
    <div className="app">
      <div className="app__layout">
        <Sidebar visible={visible} toggle={toggle} />
        <div className="app__chat">
          <MessagesComponent />
          <ChatBar />
        </div>
      </div>
      <Header toggle={toggle} />
    </div>
  );
}

export default App;
