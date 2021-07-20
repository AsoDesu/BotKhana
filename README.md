# BotKhana

A Beat Saber Tournament Manager and Coordinator Bot
###### BotKhana is not affiliated with BeatKhana.

[Invite Link](https://discord.com/api/oauth2/authorize?client_id=796371697083219968&permissions=298265712&scope=bot)

[Support Server](https://discord.gg/jEHVQajmS4)

## Commands

##### Coordinator

-   `muteall/ma` - Mute every member in your current Voice Channel except yourself
-   `unmuteall/ua` - Unmute every member in your current Voice Channel except yourself
-   `multistream/ms` - Generates a Multistream link with the users in your current Voice Channel except yourself
-   `coinflip/coin` - Flips a coin
-   `pickuser/pu` - Picks a random user in your voice channel excluding yourself
-   `picknumber/pn (number)` - Picks a random number between 0 and the number given
-   `seperator/seperate/sep (optional text)` - Posts a line seperator to help organise match text channels. Includes text in seperator line if provided.

##### Info

-   `ping` - Get BotKhana's current ping
-   `help` - The Help Menu Command
-   `invite` - Get the BotKhana invite link along with the support discord

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
