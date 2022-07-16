import fs from "fs";
import { logOptions } from "../config/log";

const logCheck = () => {
  try {
    let dir = logOptions.folderPath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.writeFile(logOptions.filePath, (err) => {
        if (err) throw err;
        console.log("Log file is created successfully.");
      });
    }
  } catch (error) {
    console.log("Log File is NOT created.");
  }
};

export { logCheck };
