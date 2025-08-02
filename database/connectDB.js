import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 seconds

class DBconnection {
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    //Mongoose Setting Configuration
    mongoose.set("strictQuery", true);

    mongoose.connection.on("connected", () => {
      console.log(`MongoDB CONNECTED SUCCESSFULLY 🔗`);
      this.isConnected = true;
    });

    mongoose.connection.on("error", () => {
      console.error(`MongoDB CONNECTION ERROR ⚠️`);
      this.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log(`MongoDB DISCONNECTED ❗`);
      this.isConnected = false;
      this.handleDisconnect();
    });

    process.on('SIGTERM', this.handleAppTermination.bind(this))
  }

  async connect() {
    try {
      if (!process.env.DB_URL) {
        throw new Error("MongoDB URL is not defined in .env Variables");
      }

      const ConnectionOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // 4 means IPv4
      };

      if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);
      }

      await mongoose.connect(process.env.DB_URL, ConnectionOptions);
      this.retryCount = 0; // Set the count to 0 on successfull connection
    } catch (error) {
      console.error(`MongoDB CONNECTION ERROR: ${error.message}`);
      await this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      console.error(
        `Retrying to connect to MongoDB... Attempt ${this.retryCount}/${MAX_RETRIES}`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      return this.connect();
    } else {
      console.error(
        `Failed to connect to MongoDB after ${MAX_RETRIES} attempts. Exiting...`
      );
      process.exit(1);
    }
  }

  async handleDisconnect() {
    if (!this.isConnected) {
      console.error("MongoDB is not connected. Attempting to reconnect...");
      await this.connect();
    }
  }

  async handleAppTermination(){
    try {
        await mongoose.connection.close()
        console.log("MongoDB connection closed by the app termination");
        process.exit(0);
    } catch (error) {
        console.error('Error during Databse Disonnection',error);
        process.exit(1);
    }
  }

  getConnectionStatus (){
    return{
        isConnected: this.isConnected,
        readyState: mongoose.connection.readyState,
        host : mongoose.connection.host,
        name : mongoose.connection.name
    }
  }
}


// Exporting the singleton instance of DBconnection
const dbConnectionInstance = new DBconnection();

export const connectDB = dbConnectionInstance.connect.bind(dbConnectionInstance);

export const getDBConnectionStatus = dbConnectionInstance.getConnectionStatus.bind(dbConnectionInstance);

