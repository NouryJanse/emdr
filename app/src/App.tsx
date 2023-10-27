import { KeyboardEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import { useTimer } from "./useTimer";

const API_URL = process.env.REACT_APP_SOCKET_URL as string;
const socket = io(API_URL, {});

const App = () => {
  const [size, setSize] = useState(80);
  const [speed, setSpeed] = useState<number>(15);
  const [color, setColor] = useState<string>("#07F298");
  const [backgroundColor, setBackgroundColor] = useState<string>("#030712");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [key, setKey] = useState<number>(Date.now());
  const [eventKey, setEventKey] = useState<string>("");
  const [hideAnimation, setHideAnimation] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const { seconds, start, stop } = useTimer();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connect");
    });
    socket.on("userId", (id: string) => {
      setUserId(id);
    });
    socket.on("disconnect", () => {
      console.log("disconnect");
    });
    socket.on("isAnimating", (msg: boolean) => {
      setIsAnimating(msg);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  // rerenders the animation on change of speed input
  useEffect(() => {
    setKey(Date.now());
  }, [speed]);

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
        <span className="text-white">{userId}</span>
        <div className="flex flex-col h-full justify-center overflow-hidden">
          {isAnimating && size && speed && color && !hideAnimation && (
            <>
              <div className="">
                <motion.div
                  key={key}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    borderRadius: "50%",
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100vw" }}
                  transition={{
                    duration: speed / 20,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                ></motion.div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-row justify-center items-start p-5 bg-gray-500">
          <div className="mr-5">
            <label className="flex text-sm font-medium text-gray-900 dark:text-white mb-1">Speed</label>
            <input
              type="number"
              step={2}
              min={5}
              max={75}
              style={{ width: "64px" }}
              onChange={(e) => setSpeed(Number.parseInt(e.target.value))}
              value={speed}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              required
            />
          </div>

          <div className="mr-5">
            <label className="flex text-sm font-medium text-gray-900 dark:text-white mb-1">Circle</label>
            <input
              className=""
              style={{ width: "80px", height: "40px" }}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="mr-5">
            <label className="flex text-sm font-medium text-gray-900 dark:text-white mb-1">Size</label>
            <input
              type="number"
              onChange={(e) => setSize(Number.parseInt(e.target.value))}
              min={50}
              step={15}
              value={size}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              style={{ width: "64px" }}
              placeholder=""
              required
            />
          </div>

          <div className="mr-5">
            <label className="flex text-sm font-medium text-gray-900 dark:text-white mb-1">Background</label>
            <input
              className=""
              type="color"
              style={{ width: "80px", height: "40px" }}
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="self-end border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline mr-5"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? "Stop" : "Start"}
          </button>

          <button
            type="button"
            className="relative self-end border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline mr-5 pr-7"
            onClick={() => setHideAnimation(!hideAnimation)}
          >
            {hideAnimation ? (
              <>
                Therapist ({seconds}s)
                <div
                  id="search-spinner"
                  className={`${isAnimating ? "spin" : ""}`}
                  onClick={() => generateEventKey()}
                />
              </>
            ) : (
              "Client"
            )}
          </button>

          <div className="mr-5">
            <label className="flex text-sm font-medium text-gray-900 dark:text-white mb-1">EventKey</label>
            <div className="relative">
              <input
                type="input"
                style={{ width: "128px" }}
                value={eventKey}
                onChange={(e) => setEventKey(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
              <div id="search-spinner" className={`${generating ? "spin" : ""}`} onClick={() => generateEventKey()} />
            </div>
          </div>

          {/* <div className="mr-5">
            <label className="flex text-sm font-medium text-gray-900 dark:text-white mb-1">Event key</label>
            <button
              type="button"
              className="self-end border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
              onClick={() => generateEventKey()}
            >
              Generate
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default App;
