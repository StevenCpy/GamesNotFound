Running fastAPI server locally:<br>
From backend folder, 
- Install dependencies from requirements.txt.
- Run "fastapi dev" which will run main.py using Uvicorn.<br>

Running client locally:<br>
From frontend folder,
- "npm run dev" to run in development mode, or
- "npm run build" followed by "npm run preview" for the production build.<br>
Note that "npm run preview" runs on port 4173 by default, which is not allowed by the server's CORS policy.
You can switch to port 5173.