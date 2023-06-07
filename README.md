# MAC_BOT

MAC_BOT is a Discord bot designed to manage FOSS (Free and Open Source Software) projects in a smooth, simple, and efficient way.

## Installation

To use MAC_BOT in your Discord server, follow these steps:

1. Clone the repository: `git clone https://github.com/20B81A05D1/MAC_BOT.git`
2. Install the dependencies: `npm install`
3. Configure the bot by providing your Discord API token in the ./auth/keys.ts file.
4. Run the bot: node setup.ts

Make sure you have Node.js and npm installed on your system before proceeding with the installation.

## Usage

MAC_BOT offers the following commands and functionalities for managing FOSS projects:

### Auth

The `auth` command utilizes OAuth 2.0 for authentication and verification of user profiles. It combines information from Discord and GitHub profiles and stores the user profile data in MongoDB.

Command: `!/auth`

### Profile

The `profile` command is used to display the profile of the current user. It retrieves the user's profile information from the stored data in MongoDB.

Command: `/profile`

### Projects

The `projects` command provides access to different channels related to projects.

Sub-channels:
- General: A general channel for project discussions and updates.
- Ticketing: A channel dedicated to managing project issues and features.

#### Ticketing Channel

In the ticketing channel, the following commands are available for managing project tickets:

- `/r_issue`: Create a new issue for the project.
- `/r_feature`: Propose a new feature for the project.
- `/r_help`: Request assistance or support from the project admin.

### Channels

The `channels` command provides access to different channels within the Discord server.

Sub-channels:
- Bot Command: A channel for interacting with the bot and executing bot-specific commands.
- General: A general channel for non-project-related discussions.
- Media: A channel for sharing media files.
- Commands: A channel for executing general commands related to the server.

Command: `!channels`

Feel free to explore these commands and channels to effectively manage your FOSS projects using MAC_BOT.

## Configuration

MAC_BOT requires the following configuration:

1.Discord API Token: Obtain a Discord API token by creating a new bot application on the Discord Developer Portal. Place the token in the `.env` file as `DISCORD_API_TOKEN`.

## Contributing

Contributions to MAC_BOT are highly encouraged! You can contribute by:

- Adding new features
- Resolving issues
- Enhancing documentation
- Improving file structure
- Enhancing the README file and comments

Please refer to this [video tutorial](https://www.youtube.com/watch?v=nT8KGYVurIU) on how to fork the project and contribute.

When contributing, make sure to:

- Add comments to your code
- Maintain the project structure
- Update the `discord1.mdj` (StarUML) file when introducing new features (mandatory)

Please open an issue on the GitHub repository if you encounter any problems or have suggestions for improvement.

## License

This project is licensed under the [MIT License](LICENSE).

## Documentation

Additional documentation and resources can be found in the [Wiki](https://github.com/20B81A05D1/MAC_BOT/wiki) section of the repository.

## Contact

If you have any questions or feedback, feel free to reach here:

- A. Athithya Ithayan
- Email: akilanathithyaithayan.com
- Discord ID:ADIIS007#4032

## Acknowledgments

I would like to acknowledge the following individuals for their contributions to the project:

- Person 1: @basic-programmer-python
- Person 2: @anya-siri
