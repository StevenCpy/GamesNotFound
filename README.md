# GamesNotFound
Personal project, definitely not a knock-off of Steam

<span style="color:green">**GOAL:**</span> Platform for playing JavaScript games on the browser.  Eventually, will move to allow downloading non-JS games.<br>
<span style="color:green">**LIVE WEBSITE:**</span> [www.gamesnotfound.com](https://www.gamesnotfound.com)

**CURRENT FEATURES:**
- <span style="color:green">**AUTH:**</span> Register, Login, and persistent login using JWT authentication
- <span style="color:green">**STORE:**</span> Browse games written in JS
- <span style="color:green">**LIBRARY SYSTEM:**</span> Add & remove games from Library
- <span style="color:green">**PLAYABLE GAMES:**</span> "Play" button on game cards to start games
                            (Hit the Target is currently the only game but more to come!)
- <span style="color:green">**HIGH SCORE SYSTEM:**</span> Your best score for each game is saved
- <span style="color:green">**STORE SORTING:**</span> Sort games by ID or name
- <span style="color:green">**GAME SEARCHING:**</span> Search games by name

See "dev-journal/" if you're interested to see my notes and progress during development.<br>
- <span style="color:orange">Project Development Logs:</span> [Project devlogs](https://github.com/StevenCpy/GamesNotFound/blob/main/dev-journal/project-devlog.txt)
- <span style="color:orange">How to run server and client locally:</span> [How to run](https://github.com/StevenCpy/GamesNotFound/blob/main/HOW_TO_RUN.md)
- <span style="color:orange">System design:</span> [System Design](https://github.com/StevenCpy/GamesNotFound/blob/main/dev-journal/system-design.md)

<span style="color:green"><u>**CURRENT OVERALL ARCHITECTURE:**</u></span><br>
Frontend - TypeScript,React(Vercel) -> Backend - Python,fastAPI(Render) -> Database - PostgreSQL(Supabase)

<span style="color:green">**FRONTEND:**</span><br>
Frontend is a Vite project written in TypeScript using React.<br>
Frontend is deployed on Vercel at https://www.gamesnotfound.com.<br>
**Frontend hosting COST (Vercel "Hobby" tier + CloudFlare domain name):** 0 + 10/year = $10/year

<span style="color:green">**BACKEND:**</span><br>
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

<span style="color:green">**DATABASE:**</span><br>
User information are stored on Supabase in a PostgreSQL database.  Server sends queries to Supabase using Supabase's client library.<br>
**Database hosting COST (Supabase free tier):** $0

**TOTAL PROJECT COST:** $10/year