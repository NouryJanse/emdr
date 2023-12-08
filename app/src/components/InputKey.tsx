import React, { ReactElement } from "react";

type InputKeyProps = {
  eventKey: any;
  setEventKey: any;
  generating: any;
  generateEventKey: any;
};

const InputKey: React.FC<InputKeyProps> = ({ eventKey, setEventKey, generating, generateEventKey }): ReactElement => {
  return (
    <div className="mr-5">
      <label className="flex text-sm font-medium text-gray-900 dark:text-white mb-1">Key</label>
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
  );
};

export default InputKey;
