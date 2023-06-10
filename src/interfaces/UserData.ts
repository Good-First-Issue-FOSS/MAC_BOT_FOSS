export interface UserData {
	_id: string;
	name: string;
	refresh_token: string;
	isEmailPresent: boolean;
	email: string | null;
	isGuthub: boolean;
	github: {
		type: string;
		id: string;
		name: string;
		visibility: number;
		show_activity: boolean;
		verified: boolean;
		metadata_visibility: number;
	};
}
