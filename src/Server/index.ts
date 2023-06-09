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

	if (code) {
		const formData = new url.URLSearchParams({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			grant_type: 'authorization_code',
			code: code!.toString(),
			redirect_uri: `http://localhost:${port}`,
		});
		const recivedToken = await axios.post(
			'https://discord.com/api/v10/oauth2/token',
			formData.toString(),
		);
		console.log(recivedToken.data);
	} else {
		console.log('There is no code');
		response.sendStatus(400);
	}
});

app.listen(port, () =>
	console.log(`App listening at http://localhost:${port}`),
);
