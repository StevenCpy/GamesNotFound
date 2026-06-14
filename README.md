# GamesNotFound
Personal project, definitely not a knock-off of Steam

<b>GOAL:</b> Platform for playing JavaScript games on the browser.  Eventually, will move to allow downloading non-JS games.<br>
<b>WEBSITE:</b> [www.gamesnotfound.com](https://www.gamesnotfound.com)

<b>CURRENT FEATURES:</b>
<ul>
    <li><b>AUTH:</b> Register, Login, and persistent login using JWT authentication</li>
    <li><b>STORE:</b> Browse games written in JS</li>
    <li><b>LIBRARY SYSTEM:</b> Add & remove games from Library</li>
    <li><b>PLAYABLE GAMES:</b> Play game from the Store by clicking on "Play"
            (Hit the Target is currently the only game but more to come!)</li>
    <li><b>HIGH SCORE SYSTEM:</b> Your best score for each game is saved</li>
    <li><b>STORE SORTING:</b> Sort games by ID or name</li>
    <li><b>GAME SEARCHING:</b> Search games by name</li>
</ul>

See "dev-journal/" if you're interested to see my notes and progress during development.<br>
- Project Development Logs: [Project devlogs](https://github.com/StevenCpy/GamesNotFound/blob/main/dev-journal/project-devlog.txt)<br>
- How to run server and client locally: [How to run](https://github.com/StevenCpy/GamesNotFound/blob/main/HOW_TO_RUN.md)<br>
- System design: [Design Notes](https://github.com/StevenCpy/GamesNotFound/blob/main/dev-journal/design_notes.md)<br>

<b><u>CURRENT OVERALL ARCHITECTURE:</u></b><br>
Database - PostgreSQL(Supabase) -> Backend - Python,fastAPI(Render) -> Frontend - ReactJS(Vercel)

<b>FRONTEND:</b><br>
Frontend is a Vite project written in JavaScript using React.<br>
Frontend is deployed on Vercel at https://www.gamesnotfound.com.<br>
<b>Frontend hosting COST (Vercel "Hobby" tier + CloudFlare domain name):</b> 0 + 10/year = $10/year

<b>BACKEND:</b><br>
Server (Backend) is in Python and built using fastAPI to define API endpoints.<br>
Server is deployed on Render at https://gamesnotfound-server.onrender.com.  See https://gamesnotfound-server.onrender.com/docs for API schema.<br>

Reasons for using Render:
- Simple to deploy - add link to GitHub branch, and either deploy manually or allow automatic deployment on branch commits.
- Render has a free "Hobby" tier that allows free deployment of the server.
- On AWS EC2, it is difficult to monitor costs.  It is risky to deploy on EC2 without proper knowledge of AWS.
I will eventually switch to AWS EC2 when I switch to AWS ecosystem for more control.  AWS can be overkill for this small project.

Cons for using Render and solution:
- Render has a cold start for inactivity.  After 15mins of inactivity, the server goes to sleep and the next request will be delayed by 30-50s to wake up the server.  To solve this, I ping the server every few minutes.  I created a monitor on uptimebot.com that sends a HEAD request to my server every 12mins, keeping the server alive at all time.<br>
<b>Backend COST (Render "Hobby" tier + uptimebot):</b> $0

<b>DATABASE:</b><br>
User information are stored on Supabase in a PostgreSQL database.  Server sends queries to Supabase using Supabase's client library.<br>
<b>Database hosting COST (Supabase free tier):</b> $0

<b>TOTAL PROJECT COST:</b> $10/year