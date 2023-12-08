import React, { ReactElement } from "react";

type InputColorProps = {
  setColor: any;
  color: any;
};

const InputColor: React.FC<InputColorProps> = ({ setColor, color }): ReactElement => {
  return (
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
  );
};

export default InputColor;
