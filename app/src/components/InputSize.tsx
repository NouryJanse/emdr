import React, { ReactElement } from "react";

type InputSizeProps = {
  setSize: any;
  size: any;
};

const InputSize: React.FC<InputSizeProps> = ({ setSize, size }): ReactElement => {
  return (
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
  );
};

export default InputSize;
