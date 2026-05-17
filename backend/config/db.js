import mongoose from 'mongoose';

const connectDB = async () => {
      try {
            if (!process.env.MONGO_URI) {
                  throw new Error('MONGO_URI is not defined in .env file');
            }

            const conn = await mongoose.connect(process.env.MONGO_URI, {
                  serverSelectionTimeoutMS: 15000,
                  socketTimeoutMS: 45000,
                  connectTimeoutMS: 15000,
            });

            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            console.log(`📦 Database: ${conn.connection.name}`);

            mongoose.connection.on('error', (err) => {
                  console.error('❌ MongoDB runtime error:', err.message);
            });

            mongoose.connection.on('disconnected', () => {
                  console.warn('⚠️  MongoDB disconnected — attempting reconnect...');
            });

      } catch (error) {
            console.error(`\n❌ MongoDB Connection Failed!\n`);
            console.error(`   Error: ${error.message}\n`);

            if (error.message.includes('whitelist') || error.message.includes('IP')) {
                  console.error('   FIX: Go to MongoDB Atlas → Network Access → Add IP Address');
                  console.error('        Click "Allow Access From Anywhere" (0.0.0.0/0)\n');
            } else if (error.message.includes('authentication')) {
                  console.error('   FIX: Check your MongoDB username/password in MONGO_URI\n');
            } else {
                  console.error('   FIX: Check your MONGO_URI in backend/.env\n');
            }

            // Don't crash in development — show helpful message
            if (process.env.NODE_ENV === 'development') {
                  console.error('   Server will start but database operations will fail.');
                  console.error('   Fix MongoDB connection to use the full API.\n');
            } else {
                  process.exit(1);
            }
      }
};

export default connectDB;
