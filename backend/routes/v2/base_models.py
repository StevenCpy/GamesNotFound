from pydantic import BaseModel

# ----------------------------------------------------------------- #
#                            BASE MODELS                            #
# ----------------------------------------------------------------- #
class User(BaseModel):
    username: str
    password: str