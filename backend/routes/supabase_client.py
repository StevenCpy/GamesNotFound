from supabase import create_client, Client
from supabase.client import ClientOptions

import os

# database tables
USERS_TABLE = "users"
GAMES_TABLE = "games"
LIBRARY_TABLE = "library"
SCORE_TABLE = "scores"

# Other constants
SUPABASE_TIMEOUT_SECONDS = 10

# ---------------- DEFINE SUPABASE CLIENT -------------------
# SUPABASE_URL and SUPABASE_KEY stored in .env
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase_client: Client = create_client(
    url,
    key,
    options=ClientOptions(
        postgrest_client_timeout=SUPABASE_TIMEOUT_SECONDS,
        storage_client_timeout=SUPABASE_TIMEOUT_SECONDS,
        schema="public",
    )
)