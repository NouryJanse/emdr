import { KeyboardEvent, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import { useTimer } from "./useTimer";
import InputSpeed from "./components/InputSpeed";
import InputColor from "./components/InputColor";
import InputSize from "./components/InputSize";
import InputBackgroundColor from "./components/InputBackgroundColor";
import MotionCircle from "./components/MotionCircle";
import Buttons from "./components/Buttons";
import "./index.scss";
import InputKey from "./components/InputKey";

const API_URL = process.env.REACT_APP_SOCKET_URL as string;
const socket = io(API_URL, {});

const App = () => {
  const [size, setSize] = useState(80);
  const [speed, setSpeed] = useState<number>(15);
  const [color, setColor] = useState<string>("#07F298");
  const [backgroundColor, setBackgroundColor] = useState<string>("#030712");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [eventKey, setEventKey] = useState<string>("");
  const [hideAnimation, setHideAnimation] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const { seconds, start, stop } = useTimer();
  const [isConnected, setIsConnected] = useState();

  useEffect(() => {
    activateSocket(setUserId, setIsAnimating, setIsConnected);
  }, []);

  // generates a (fairly) unique event key for shared sessions
  const generateEventKey = () => {
    if (eventKey) {
      socket.emit("removeRoomByKey", { eventKey });
    }

    setEventKey(nanoid(8));
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 500);
  };

  useEffect(() => {
    if (eventKey.length > 1) socket.emit("message", { eventKey });
  }, [eventKey]);

  useEffect(() => {
    if (isAnimating) {
      start();
    } else {
      stop();
    }
    if (eventKey) {
      socket.emit("isAnimating", JSON.stringify({ eventKey, isAnimating }));
    }
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.target as HTMLInputElement).type === "button") {
        e.preventDefault();
      }
      if (e.code === "Enter" || e.code === "Space") {
        setIsAnimating(!isAnimating);
      }
    };

    // @ts-ignore
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      // @ts-ignore
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnimating]);

  return (
    <>
      <div className="App flex flex-col h-full" style={{ backgroundColor: backgroundColor }}>
        <span className="text-white p-5">
          {isConnected ? (
            <p>
              Online
              <i className="pulse green"></i>
            </p>
          ) : (
            <p>
              Offline
              <i className="pulse red"></i>
            </p>
          )}
        </span>

        <MotionCircle isAnimating={isAnimating} size={size} speed={speed} color={color} hideAnimation={hideAnimation} />

        <div className="flex flex-row justify-center items-start p-5 bg-gray-500">
          <InputSpeed setSpeed={setSpeed} speed={speed} />
          <InputColor setColor={setColor} color={color} />
          <InputSize setSize={setSize} size={size} />
          <InputBackgroundColor setBackgroundColor={setBackgroundColor} backgroundColor={backgroundColor} />
          <Buttons
            setIsAnimating={setIsAnimating}
            isAnimating={isAnimating}
            setHideAnimation={setHideAnimation}
            hideAnimation={hideAnimation}
            seconds={seconds}
            generateEventKey={generateEventKey}
          />
          <InputKey
            setEventKey={setEventKey}
            eventKey={eventKey}
            generateEventKey={generateEventKey}
            generating={generating}
          />
        </div>
      </div>
    </>
  );
};

const activateSocket = (setUserId: any, setIsAnimating: any, setIsconnected: any) => {
  socket.on("connect", () => {
    setIsconnected(true);
  });
  socket.on("userId", (id: string) => {
    setUserId(id);
  });
  socket.on("disconnect", () => {
    setIsconnected(false);
  });
  socket.on("isAnimating", (msg: boolean) => {
    setIsAnimating(msg);
  });
  return () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("message");
  };
};

export default App;
