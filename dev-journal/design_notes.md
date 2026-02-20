Frontend: React JS
Start with website, then create wrapper around website to make Desktop app
Why? No download needed to see UI

Backend: Django (Python)

Database: ???

Basic Features:
- Sign up/Login
- UI to allow browsing games
    - Personalized library for games that user added from Store
    - Store tab to browse games
- Download games

How to keep list of games
Step 1 - Hard-coded array.  Disadv: Not scalable/cannot add, remove or update games on the fly.(current approach)
Step 2 - Hard-coded JSON file.  Disadv: Same as above.
Step 3 - JSON file that updates from JS code whenever games are added, updated or removed. Disadv: If one user adds game, the update is not shared with other users.
Step 4 - Use of SQLite local database to fill array.  Database updates from JS code whenever games are added, updated or removed.  Disadv: Same as above.
Step 5 (Goal) - Use of online database (eg. PosgreSQL or MongoDB) to fill array.

SQL vs NoSQL: NoSQL more straightforward to fetch data if all users have same view of games, but SQL better if each user has a different view of games.
Game cover images stored in the data structure as the image name instead of the image itself.