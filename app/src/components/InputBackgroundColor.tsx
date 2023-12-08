import React, { ReactElement } from "react";

type InputBackgroundColorProps = {
  setBackgroundColor: any;
  backgroundColor: any;
};

const InputBackgroundColor: React.FC<InputBackgroundColorProps> = ({
  setBackgroundColor,
  backgroundColor,
}): ReactElement => {
  return (
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
  );
};

export default InputBackgroundColor;
