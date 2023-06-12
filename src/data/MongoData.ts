import { MongoClient, Db, InsertOneResult, WithId } from 'mongodb';
import { loadEnv } from '../utils/loadEnv';
import { UserData } from '../interfaces/UserData';

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
		console.error('Error inserting project to Db\n', error);
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
		console.error('Error displaying projects\n', error);
		throw error;
	}
}

export async function addUsers(user: UserData): Promise<boolean> {
	try {
		const data: InsertOneResult<Document> = await (await connectToMongoDB())
			.collection('MAC_BOT_USERS')
			.insertOne(user);
		console.log('Project inserted:', data.insertedId);
		return true;
	} catch (error) {
		console.error('Error inserting user\n', error);
		throw error;
	}
}

export async function listUsers(): Promise<WithId<Document>[]> {
	try {
		const data = await (await connectToMongoDB())
			.collection('MAC_BOT_USERS')
			.find()
			.toArray();
		console.log(data);
		return data as WithId<Document>[];
	} catch (error) {
		console.error('Error finding users\n', error);
		throw error;
	}
}
