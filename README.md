# BotKhana

A Beat Saber Tournament Manager and Coordinator Bot

###### BotKhana is not affiliated with BeatKhana.

![size](https://img.shields.io/github/repo-size/AsoDesu/BotKhana)

[Invite Link](https://discord.com/api/oauth2/authorize?client_id=796371697083219968&permissions=298265712&scope=bot)
[Support Server](https://discord.gg/jEHVQajmS4)
[Trello](https://trello.com/b/8kefuCCH/botkhana-development)

## Commands

_(Required Argument)_
_[(Optional Argument)]_
Don't include the brackets/square brackets when running the command

##### Coordinator

-   `muteall/ma` - Mute every member in your current Voice Channel except yourself
-   `unmuteall/ua` - Unmute every member in your current Voice Channel except yourself
-   `movein/mi (mentions)` - Moves mentioned users into your voice channel
-   `moveout/mo` - Moves users in your voice channel to the lobby voice channel
-   `multistream/ms` - Generates a Multistream link with the users in your current Voice Channel except yourself
-   `coinflip/coin` - Flips a coin
-   `pickuser/pu` - Picks a random user in your voice channel excluding yourself
-   `picknumber/pn (number)` - Picks a random number between 0 and the number given
-   `seperator/seperate/sep [(text)]` - Posts a line seperator to help organise match text channels. Includes text in seperator line if provided.

##### Info

-   `ping` - Get BotKhana's current ping
-   `help` - The Help Menu Command
-   `faq` - Additional help for certain common errors
-   `invite` - Get the BotKhana invite link along with the support discord
-   `map/bs/bsr (map key) [(difficulty)]` - Get map data from [beatsaver.com](https://beatsaver.com)
-   `tournament/t` - Get info on the linked tournament
-   `user (@User)` - Get info on a user from BeatKhana.com

#### Tournament Assistant

-   `setquals/setqualschannel (Channel)` - Set the channel where qualifer results will be sent
-   `connect (IP:PORT) [(Password)]` - Connect a TA server to your discord
-   `disconnect` - Disconnect TA from your discord
-   `reconnect` - Reconnect TA to your discord (if TA server crashed)

##### BeatKhana

-   `addtournament/addtourney/addt (TournamentID)` - Links a tournament on BeatKhana! to your discord server.
-   `removetournament/removetourney/removet (Tournament ID)` - Unlink a tournament from this discord server.
-   `listtournaments/listtourneys/listt` - Lists all the tournaments linked to your discord server.
-   `settings (Tournament ID) [(Setting)] [(Value)]` - Change a tournaments settings
-   `sync (Tournament ID)` - Manually sync the members who have signed up.
-   `nextmatch` - Get your next match _(For Players)_

## FAQ

-   **What does the bot do?**
    BotKhana is a bot which has many functions, and even more planned, but overall it's a bot used for Beat Saber Tournaments. BotKhana can, Automatically sync signups to a role, allow players to see everything they need for their next match from 1 command\*, And allow coordinators to quickly mute and unmute their matchrooms.
-   **Doesn't (Insert Bot Name Here) do that?**
    Probably, several functions of this bot were inspired from other bots such as [Coordy-McCoordFace](https://github.com/Sirspam/Coordy-McCoordFace) or [Paul](https://github.com/Ryeera/Paul)
-   **Are there any past tournaments which have used BotKhana?**
    Yes, So far only the 115 Royale have used BotKhana. However 115 Royale used a Beta version of the bot built into [Dumb Bot](https://github.com/AsoDesu/no-bot)
-   **Whats Planned?**
    A lot is planned, you can see the development board [here](https://trello.com/b/8kefuCCH/botkhana-development)

## Common Errors

-   **That tournament doesn't exist.** - Make sure that your tournament is set to public in BeatKhana Settings. ![BK_Settings](https://i.imgur.com/SA9NZCe.png)

## Contributing

-   Take a look at `.env.example` for what the .env file should look like
-   For Auto-Formating, Keep it to `Tab Size: 4` in VS Code
-   **Always submit pull requests on the `dev` branch, don't PR to `main`**
