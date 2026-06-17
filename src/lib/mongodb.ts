import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix for Node.js querySrv ECONNREFUSED DNS resolution issues with MongoDB Atlas SRV records
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Custom DNS initialization warning:', e);
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}
const cached = global.mongoose!;

async function connectDB() {
  // Fix for Node.js querySrv ECONNREFUSED DNS resolution issues inside Next.js API runtime
  try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('[Mongoose Connection] Set DNS servers to:', dns.getServers());
  } catch (e: any) {
    console.warn('[Mongoose Connection] Failed to set DNS servers:', e.message);
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (MONGODB_URI.includes('your_username') || MONGODB_URI.includes('your_password') || MONGODB_URI.includes('your_cluster')) {
    throw new Error('MONGODB_URI in .env.local is currently set to a placeholder value. Please configure it with your real MongoDB Atlas connection string.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      // Asynchronously trigger database seeding on connection
      import('./db-seed').then(({ seedDatabase }) => {
        seedDatabase().catch((err) => console.error('Database seeding failed:', err));
      });
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
