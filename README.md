# GamesNotFound
Personal project, definitely not a knock-off of Steam

**GOAL:** Platform for playing JavaScript games on the browser.  Eventually, will move to allow downloading non-JS games.<br>
**LIVE WEBSITE:** [www.gamesnotfound.com](https://www.gamesnotfound.com)

**CURRENT FEATURES:**
- **AUTH:** Register, Login, and persistent login using JWT authentication
- **STORE:** Browse games written in JS
- **LIBRARY SYSTEM:** Add & remove games from Library
- **PLAYABLE GAMES:** "Play" button on game cards to start games
                            (Hit the Target is currently the only game but more to come!)
- **HIGH SCORE SYSTEM:** Your best score for each game is saved
- **STORE SORTING:** Sort games by ID or name
- **GAME SEARCHING:** Search games by name

See "dev-journal/" if you're interested to see my notes and progress during development.<br>
- Project Development Logs: [Project devlogs](https://github.com/StevenCpy/GamesNotFound/blob/main/dev-journal/project-devlog.txt)
- How to run server and client locally: [How to run](https://github.com/StevenCpy/GamesNotFound/blob/main/HOW_TO_RUN.md)
- System design: [System Design](https://github.com/StevenCpy/GamesNotFound/blob/main/dev-journal/system-design.md)

<u>**CURRENT OVERALL ARCHITECTURE:**</u><br>
Frontend - TypeScript,React(Vercel) -> Backend - Python,fastAPI(Render) -> Database - PostgreSQL(Supabase)

<u>**FRONTEND:**</u><br>
Frontend is a Vite project written in TypeScript using React.<br>
Frontend is deployed on Vercel at https://www.gamesnotfound.com.<br>
**Frontend hosting COST (Vercel "Hobby" tier + CloudFlare domain name):** 0 + 10/year = $10/year

<u>**BACKEND:**</u><br>
Backend is in Python and built using fastAPI to define API endpoints.<br>
Backend is deployed on Render at https://gamesnotfound-server.onrender.com.<br>
See https://gamesnotfound-server.onrender.com/docs for API schema.

Reasons for using Render:
- Simple to deploy - add link to GitHub branch, and either deploy manually or allow automatic deployment on branch commits.
- Render has a free "Hobby" tier that allows free deployment of the server.
- On AWS EC2, it is difficult to monitor costs.  It is risky to deploy on EC2 without proper knowledge of AWS.
I will eventually switch to AWS EC2 when I switch to AWS ecosystem for more control.  AWS can be overkill for this small project.

Cons for using Render and solution:
- Render has a cold start for inactivity.  After 15mins of inactivity, the server goes to sleep and the next request will be delayed by 30-50s to wake up the server.  To solve this, I ping the server every few minutes.  I created a monitor on uptimebot.com that sends a HEAD request to my server every 12mins, keeping the server alive at all time.<br>
**Backend COST (Render "Hobby" tier + uptimebot):** $0

<u>**DATABASE:**</u><br>
User information are stored on Supabase in a PostgreSQL database.  Server sends queries to Supabase using Supabase's client library.<br>
**Database hosting COST (Supabase free tier):** $0

**TOTAL PROJECT COST:** $10/year