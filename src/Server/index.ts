import express, { Request, Response } from 'express';
import { loadEnv } from '../utils/loadEnv';
import { UserData } from '../interfaces/UserData';
import axios from 'axios';
import url from 'url';
import { addUsers } from '../data/MongoData';

const app = express();
const port = 53134;
const CLIENT_ID = loadEnv().APPLICATION_ID;
const CLIENT_SECRET = loadEnv().CLIENT_SECRET;

app.get('/', async (request: Request, response: Response) => {
	try {
		console.log(request.query);
		const { code } = request.query;
		let flag = 0;
		const problemArray: string[] = [];
		// Initalizing storage data
		const data: UserData = {
			id: '',
			name: '',
			refresh_token: '',
			isEmailPresent: false,
			email: null,
			isGuthub: false,
			github: {
				type: '',
				id: '',
				name: '',
				visibility: 0,
				show_activity: false,
				verified: false,
				metadata_visibility: 0,
			},
			_id: undefined,
		};
		if (code) {
			// getting initial token
			const formData = new url.URLSearchParams({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				grant_type: 'authorization_code',
				code: code?.toString(),
				redirect_uri: `http://localhost:${port}`,
			});
			const recivedToken = await axios.post(
				'https://discord.com/api/v10/oauth2/token',
				formData.toString(),
			);
			data.refresh_token = recivedToken.data.refresh_token;
			console.log(recivedToken.data);

			// getting user's discord data
			if (recivedToken.data.expires_in) {
				const userData = await axios.get(
					'https://discord.com/api/v10/users/@me',
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${recivedToken.data.access_token}`,
						},
					},
				);
				console.log(userData.data);
				if (userData.data.email) {
					data.id = userData.data.id;
					data._id = userData.data.id.toString();
					data.name = userData.data.username;
					data.isEmailPresent = true;
					data.email = userData.data.email;
				} else {
					data.id = userData.data.id;
					data._id = userData.data.id.toString();
					data.name = userData.data.username;
					data.isEmailPresent = false;
					problemArray.push('No Email Attached to github Retry!');
				}
			} else {
				console.log('Skipped User Data due to token absence!');
				flag++;
			}

			// getting user's github data
			if (recivedToken.data.expires_in) {
				const gitData = await axios.get(
					'https://discord.com/api/v10/users/@me/connections',
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${recivedToken.data.access_token}`,
						},
					},
				);
				console.log(gitData.data);
				gitData.data.forEach(
					(element: {
						type: string;
						name: string;
						id: string;
						visibility: number;
						show_activity: boolean;
						verified: boolean;
						metadata_visibility: number;
					}) => {
						if (element.type === 'github') {
							data.isGuthub = true;
							data.github.type = element.type;
							data.github.name = element.name;
							data.github.id = element.id;
							data.github.visibility = element.visibility;
							data.github.show_activity = element.show_activity;
							data.github.verified = element.verified;
							data.github.metadata_visibility = element.metadata_visibility;
						} else {
							data.isGuthub = false;
							problemArray.push('Link Your Github to Discord and Retry');
						}
					},
				);
			} else {
				console.log('Skipped Git Data due to token absence!');
				flag++;
			}

			response.status(200);
		} else {
			console.log('There is no code');
			flag++;
			response.status(400);
		}
		// sending responce
		if (flag == 0) {
			console.log('Data to be sent to MongoDb');
			console.log(data);
			const result = await addUsers(data);
			if (result) {
				response.sendFile('success.html', { root: './src/server/' });
			} else {
				response.sendFile('failure.html', { root: './src/server/' });
			}
		} else {
			response.sendFile('failure.html', { root: './src/server/' });
		}
	} catch (error) {
		console.log(error);
		response.sendFile('failure.html', { root: './src/server/' });
	}
});

app.listen(port, () =>
	console.log(`App listening at http://localhost:${port}`),
);
