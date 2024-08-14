import fs from 'fs';
import path from 'path';

// Ensure the logs directory exists
const logDirPath = path.join(process.cwd(), 'backend', 'logs');
if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath, { recursive: true });
}

const logFilePath = path.join(logDirPath, 'error.log');

const errorHandler = (err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Something went wrong!!!";
  const log = `[${new Date().toLocaleString()}] ${errStatus} - ${errMessage} - ${req.originalUrl} - ${req.method}`;
  console.error(log);

  // Write error to log file
  fs.appendFile(logFilePath, log + '\n', (error) => {
    if (error) {
      console.error("Error writing to log file:", error);
    }
  });

  return res.status(errStatus).json({
    success: false,
    message: errMessage,
    data: []
  });
};

export default errorHandler;
