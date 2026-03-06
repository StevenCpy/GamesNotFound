OVERALL ARCHITECTURE:
Frontend (React) -> Backend (Python) containerized using Docker and hosted on AWS ECS -> Supabase database (for user auth)

-------------------------------------------------------------------------

FRONTEND: React JS

Frontend design decision:
I know React.
Start with website, then create wrapper around website to make Desktop app
Why? No download needed to see UI

-------------------------------------------------------------------------

BACKEND: Django/Flask/FastAPI (Python)

Django: Steeper learning curve, Slower and heavyweight.  Overkill for small projects.  Might switch to Django later on when scaling.  Large projects.  Worth learning in the long run.
Flask: Lightweight.  Slower than FastAPI.  Small projects.
FastAPI: Quick to learn.

https://blog.jetbrains.com/pycharm/2025/02/django-flask-fastapi/


Backend design decision:
Supabase (BaaS - Backend as a Service) provides cloud database and authentication.  Backend code can be removed and let frontend directly communicate with Supabase server.  We can get rid of user logins through backend using this service.
Disadv:
- Less control over score data, as users can send fake scores through the web console.
- Risk of Supabase API keys getting leaked on frontend unless environment variables are used instead.

-------------------------------------------------------------------------

DATABASE: Use Supabase only for free-tier database to store user logins and game scores, but keep backend code.

Database options:
- Local-hosted database eg. SQLite.  Disadv: Every time database deployed, user data and scores erased
- Cloud-hosted database:
    - NoSQL document database eg. MongoDB (stores data in document format like JSON).
    - SQL relational database.  Good for storing user logins and score for each game.
        - PostgreSQL engine hosted on AWS RDS.  Disadv: Can be costly and AWS does not have feature to limit usage.
        - Supabase-hosted PostgreSQL.  Good for Google Auth and has free tier that doesn't require providing credit card info.

-------------------------------------------------------------------------

Basic Features:
- Sign up/Login
- UI to allow browsing games
    - Personalized library for games that user added from Store
    - Store tab to browse games
- Download games (allow users to play games directly on browser for now, since people reluctant to download)

How to keep list of games
Step 1 - Hard-coded array.  Disadv: Not scalable/cannot add, remove or update games on the fly.(current approach)
Step 2 - Hard-coded JSON file.  Disadv: Same as above.
Step 3 - JSON file that updates from JS code whenever games are added, updated or removed. Disadv: If one user adds game, the update is not shared with other users.
Step 4 - Use of SQLite local database to fill array.  Database updates from JS code whenever games are added, updated or removed.  Disadv: Same as above.
Step 5 (Goal) - Use of online database (eg. PosgreSQL or MongoDB) to fill array.

SQL vs NoSQL: NoSQL more straightforward to fetch data if all users have same view of games, but SQL better if each user has a different view of games.
Game cover images stored in the data structure as the image name instead of the image itself.