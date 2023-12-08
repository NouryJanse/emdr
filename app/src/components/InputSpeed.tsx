import React, { ReactElement } from "react";

type InputSpeedProps = {
  setSpeed: any;
  speed: any;
};

const InputSpeed: React.FC<InputSpeedProps> = ({ setSpeed, speed }): ReactElement => {
  return (
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
  );
};

export default InputSpeed;
