import React, {
  Dispatch,
  FormEvent,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./App.css";
import io, { Socket } from "socket.io-client";
import { IMsg, IRoom, ServerMsg } from "./interfaces";

function ChatBar({ send }: { send(message: string): void }) {
  const [text, settext] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFocus = (e: KeyboardEvent) => {
      if (inputRef.current === document.activeElement) {
        return;
      }
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", handleFocus);
    return () => {
      document.removeEventListener("keydown", handleFocus);
    };
  }, []);

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

type MessagesComponentHandle = {
  adjustScroll: () => void;
};

const MessagesComponent = forwardRef<
  MessagesComponentHandle,
  { messages: IMsg[] }
>(({ messages }, ref) => {
  const messagesRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    adjustScroll() {
      messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
    },
  }));

  return (
    <div className="p-4 messages container-width" ref={messagesRef}>
      {messages.map((message, index) => (
        <MessageComponent message={message} key={index} />
      ))}
    </div>
  );
});

function MessageComponent({ message }: { message: IMsg }) {
  const username = message.userId || "Anonymous";
  const date = new Date(message.timestamp || 0);
  const formattedDate = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}`;
  const msg = JSON.parse(message.msg);

  return (
    <div className="mt-4">
      <div className="flex items-baseline">
        {msg.type === "message" ? (
          <span className="font-bold text-xl text-blue-900">{username}</span>
        ) : msg.type === "success" ? (
          <span className="font-bold text-xl text-green-500">Server</span>
        ) : (
          <span className="font-bold text-xl text-red-900">Server</span>
        )}

        <span className="text-sm text-gray-600 ml-2" title={date.toISOString()}>
          {formattedDate}
        </span>
      </div>
      <p className="text-gray-800">{msg.content}</p>
    </div>
  );
}

function Sidebar({
  visible,
  toggle,
  rooms,
  setcurrentRoomId,
}: {
  visible: boolean;
  rooms: IRoom[];
  toggle(): void;
  setcurrentRoomId: Dispatch<SetStateAction<string>>;
}) {
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
        {rooms.map((room) => (
          <button
            className="rounded bg-gray-700 p-2 mt-2"
            key={room.id}
            onClick={() => setcurrentRoomId(room.id)}
          >
            {room.title}
          </button>
        ))}
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
  const [currentRoomId, setcurrentRoomId] = useState("");
  const [rooms, setrooms] = useState<IRoom[]>([]);
  const [messages, setmessages] = useState<IMsg[]>([]);
  const [socket, setsocket] = useState<Socket>();
  const messagesRef = useRef<MessagesComponentHandle>(null);

  useEffect(() => {
    // fetchRooms();
  }, []);

  const addMessage = (message: IMsg) => {
    setmessages((prevstate) => [...prevstate, message]);

    messagesRef.current?.adjustScroll();
  };

  const send = (message: string) => {
    socket?.emit("message", message, currentRoomId);
  };

  useEffect(() => {
    const socket = io("http://localhost:8000");
    setsocket(socket);

    socket.on("message", (message) => addMessage(message));
    socket.on("error message", (message) => addMessage(message));

    socket.on("rooms", (message) => {
      const rooms = JSON.parse(message.msg).payload;
      console.log(rooms);
      setrooms(rooms);
      setcurrentRoomId(rooms[0].id);
    });

    // Fetch rooms once
    socket.emit("rooms");
    // socket.on("users", (message) => addMessage(message));

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggle = () => setvisible((prevState) => !prevState);

  const visibleMessages = messages.filter((message) => {
    return message.roomId === currentRoomId;
  });

  return (
    <div className="app">
      <div className="app__layout">
        <Sidebar
          visible={visible}
          toggle={toggle}
          rooms={rooms}
          setcurrentRoomId={setcurrentRoomId}
        />
        <div className="app__chat">
          Current room : {currentRoomId}
          <MessagesComponent messages={visibleMessages} ref={messagesRef} />
          <ChatBar send={send} />
        </div>
      </div>
      <Header toggle={toggle} />
    </div>
  );
}

export default App;
