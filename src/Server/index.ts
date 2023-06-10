import express, { Request, Response } from 'express';
import { loadEnv } from '../utils/loadEnv';
import axios from 'axios';
import url from 'url';

const app = express();
const port = 53134;
const CLIENT_ID = loadEnv().APPLICATION_ID;
const CLIENT_SECRET = loadEnv().CLIENT_SECRET;

app.get('/', async (request: Request, response: Response) => {
	console.log(request.query);
	const { code } = request.query;
	let flag = 0;
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
	if (flag == 0) {
		response.sendFile('index.html', { root: './src/server/' });
	} else {
		response.sendFile('index.html', { root: './src/server/' });
	}
});

app.listen(port, () =>
	console.log(`App listening at http://localhost:${port}`),
);
