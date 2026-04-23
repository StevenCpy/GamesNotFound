# GamesNotFound
Personal project, definitely not a knock-off of Steam

GOAL: Platform for playing simple user-generated games on the browser.

If you're an employer, please see dev-journal if you're interested to see my progress and my notes during development.

<b><u>OVERALL ARCHITECTURE RIGHT NOW:</u></b><br>
Database - PostgreSQL(Supabase) -> Backend - Python,fastAPI(Render) -> Frontend - ReactJS(Possibly Vercel)

<b>FRONTEND:</b><br>
Frontend is a Vite project.  To run code locally, "npm run dev" inside frontend folder.  Code is not deployed yet.
I plan to host my frontend on Vercel.  Render's cold start would need me to ping the website continuously.  I'm not sure if it's possible without any defined API endpoints that would allow uptimebot.com to send HEAD requests to it.  I'll need to test this.<br>
<b>Frontend hosting COST (Vercel + CloudFlare domain name):</b> unknown

<b>BACKEND:</b><br>
Server (Backend) is in Python and built using fastAPI to define API endpoints.
Server is deployed on Render at https://gamesnotfound-server.onrender.com.  See https://gamesnotfound-server.onrender.com/docs for API schema.<br>
To run code locally from backend folder, install dependencies from requirements.txt and run "fastapi run".

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