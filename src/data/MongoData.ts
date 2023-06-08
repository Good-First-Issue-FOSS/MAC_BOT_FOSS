import { MongoClient, Db, InsertOneResult, WithId } from 'mongodb';
import { loadEnv } from '../utils/loadEnv';

async function connectToMongoDB(): Promise<Db> {
	const url = loadEnv().MONGO_URI;
	const client = new MongoClient(url);

	try {
		await client.connect();
		console.log('Connected to MongoDB');
		// Replace with your database name.
		const db = client.db('MAC_BOT');
		return db;
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
		throw error;
	}
}

export async function addProject(proj: string) {
	try {
		const data: InsertOneResult<Document> = await (await connectToMongoDB())
			.collection('MAC_BOT_PROJECTS')
			.insertOne({ name: proj });
		console.log('Project inserted:', data.insertedId);
	} catch (error) {
		console.error('Error inserting document', error);
		throw error;
	}
}

export async function listProjectNames(): Promise<string[]> {
	try {
		const data = await (await connectToMongoDB())
			.collection('MAC_BOT_PROJECTS')
			.find()
			.toArray();
		const arr: string[] = [];
		data.forEach((ele) => {
			arr.push(ele.name);
		});
		return arr;
	} catch (error) {
		console.error('Error inserting document', error);
		throw error;
	}
}

export async function addUsers(user: string) {
	try {
		const data: InsertOneResult<Document> = await (await connectToMongoDB())
			.collection('MAC_BOT_PROJECTS')
			.insertOne({ name: user });
		console.log('Project inserted:', data.insertedId);
	} catch (error) {
		console.error('Error inserting document', error);
		throw error;
	}
}

export async function listUsers(): Promise<WithId<Document>[]> {
	try {
		const data = await (await connectToMongoDB())
			.collection('MAC_BOT_PROJECTS')
			.find()
			.toArray();
		console.log(data);
		return data as WithId<Document>[];
	} catch (error) {
		console.error('Error inserting document', error);
		throw error;
	}
}
