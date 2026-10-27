const mongoose = require('mongoose');

let mongoMemoryServer = null;
let isMemoryDb = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Failed to connect to specified MONGO_URI (${err.message}). Falling back to Embedded In-Memory MongoDB...`);
    }
  }

  // Fallback to In-Memory MongoDB so app runs out-of-the-box without manual database setup
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'hotelpro'
      }
    });
    const memoryUri = mongoMemoryServer.getUri();
    isMemoryDb = true;
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] In-Memory MongoDB Connected: ${memoryUri}`);
    return conn;
  } catch (memErr) {
    console.error(`[Database] Failed to start MongoDB Memory Server: ${memErr.message}`);
    throw memErr;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error(`[Database] Error during disconnect: ${err.message}`);
  }
};

const getIsMemoryDb = () => isMemoryDb;

module.exports = { connectDB, disconnectDB, getIsMemoryDb };
