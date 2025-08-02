import { getDBConnectionStatus } from "../database/connectDB.js";

export const healthcheck = async (req, res) => {
  try {
    const dbStatus = getDBConnectionStatus();

    const healthStatus = {
      status: "OK",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus.isConnected
            ? "UP - Database is connected"
            : "DOWN - Database is not connected",
          details: {
            readystate: getReadyStateText(dbStatus.readyState),
          },
        },
        server: {
          status: "UP - Server is running",
          details: {
            version: "1.0.0",
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
          },
        },
      },
    };

    const httpStatus = healthStatus.services.database.status.startsWith("UP")
      ? 200
      : 503;

    res.status(httpStatus).json(healthStatus);
  } catch (error) {
    console.error("Healthcheck error:", error);
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      message: "Internal Server Error",
    });
  }
};

function getReadyStateText(state) {
  switch (state) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";
    default:
      return "unknown";
  }
}
