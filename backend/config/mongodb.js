import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
	if (isConnected) {
		console.log('⏩ Already connected to MongoDB');
		return;
	}
	try {
		console.log('➕ New Connection...');
		await mongoose.connect(process.env.MONGODB_URI, {
			maxPoolSize: 2,
			socketTimeoutMS: 10000,
		});
	} catch (err) {
		console.error('⛔ Error connecting to MongoDB', err);
	}
};



mongoose.connection.on('connected', () => {
	isConnected = true;
	console.log('✅ Mongoose connected to DB 🔗');
});

mongoose.connection.on('disconnected', () => {
	console.warn('⚠️  Mongoose disconnected. Attempting to reconnect...');
	isConnected = false;
});


mongoose.connection.on('reconnected', () => {
	console.log('⌛ Mongoose Reconnected to DB 🔗');
});

mongoose.connection.on('error', (err) => {
	console.error('⛔ Mongoose connection error:', err);
	isConnected = false;
});

export default connectDB;