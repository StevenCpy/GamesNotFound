CURRENT OVERALL ARCHITECTURE:
Frontend - TypeScript,React(Vercel) -> Backend - Python,fastAPI(Render) -> Database - PostgreSQL(Supabase)

POSSIBLE EVENTUAL OVERALL ARCHITECTURE:
Frontend - TypeScript,React(Vercel) -> Backend - Python,Django(Render) containerized using Docker and hosted on AWS ECS -> Database - PostgreSQL(Supabase)

-------------------------------------------------------------------------

FRONTEND:
Language: TypeScript
Chosen Framework: React
Reason:
    - Already familiar
    - Website means no download needed
    - Easy migration to Desktop app by creating wrapper around website (using Electron)

-------------------------------------------------------------------------

BACKEND:
Language: Python
Chosen framework: FastAPI
Reason:
    - Already familiar with Python

Frameworks Comparison:
Django: Steeper learning curve, slower and heavyweight.  Overkill for small projects.  Might switch to Django later on when scaling, but worth learning in the long run.
Flask: Lightweight, but slower than FastAPI.  For small projects.
FastAPI: Quick to setup and learn.

https://blog.jetbrains.com/pycharm/2025/02/django-flask-fastapi/


Backend design decision:
Supabase (BaaS - Backend as a Service) provides cloud database and authentication.  Backend code can technically be removed to let frontend directly communicate with Supabase server, but we should never trust the client.
However we can get rid of auth management by using Supabase's auth service.
Disadv:
- Less control over data validation, as users can fake data through the web console.

-------------------------------------------------------------------------

DATABASE:
Use Supabase only for free-tier database to store user logins and game scores, but keep backend code.

Database options:
- Local-hosted database eg. SQLite.  Disadv: Harder to manage and scale.
- Cloud-hosted database:
    - NoSQL document database eg. MongoDB (stores data in document format like JSON).
    - SQL relational database.  Good for storing user logins and score for each game.
        - PostgreSQL engine hosted on AWS RDS.  Disadv: Can be costly and AWS does not have feature to limit usage.
        - Supabase-hosted PostgreSQL.  Good for Google Auth and has free tier that doesn't require providing credit card info.

-------------------------------------------------------------------------

Features baseline:
- User authentication
- Store and User library
- Games sorting and searching
- Browser games
- (Later) Downloadable games (Only JS browser games for now)

Storing list of games - Progression:
Step 1 - Hard-coded array/hard-coded JSON object/JSON file.  Disadv: Not scalable as more games are added/Need to re-deploy client when adding new games.
Step 2 - Use of local SQLite database.  Database updates from backend code whenever games are added, updated or removed.  Disadv: Harder to manage and scale.
Step 3 (Goal) - Use of online database (eg. PosgreSQL or MongoDB).