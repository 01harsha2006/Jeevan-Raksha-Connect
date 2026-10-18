import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jeevan_raksha';

  try {
    // Attempt connecting to MongoDB with a short timeout to prevent blocking if local mongod is absent
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected successfully to ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.log(`[Database Notice] MongoDB server is not active locally (${error.message}).`);
    console.log(`[Database Notice] Operating in Integrated Fallback Store mode (full REST API, seed data, and real-time state active).`);
    return false;
  }
};
