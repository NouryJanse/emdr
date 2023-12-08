import React, { ReactElement } from "react";

type ButtonsProps = {
  setIsAnimating: any;
  isAnimating: boolean;
  setHideAnimation: any;
  hideAnimation: any;
  seconds: any;
  generateEventKey: any;
};

const Buttons: React.FC<ButtonsProps> = ({
  setIsAnimating,
  isAnimating,
  setHideAnimation,
  hideAnimation,
  seconds,
  generateEventKey,
}): ReactElement => {
  return (
    <>
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
            <div id="search-spinner" className={`${isAnimating ? "spin" : ""}`} onClick={() => generateEventKey()} />
          </>
        ) : (
          "Client"
        )}
      </button>
    </>
  );
};

export default Buttons;
