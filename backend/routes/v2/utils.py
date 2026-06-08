import os
import jwt

JWT_HS256_SECRET_KEY = os.environ.get("JWT_HS256_SECRET_KEY")

# JWT
def encode_HS256(payload: dict) -> str:
    payload_encoded = jwt.encode(payload, JWT_HS256_SECRET_KEY, algorithm="HS256")
    return payload_encoded

def decode_payload_HS256(Authorization: str|None = None) -> dict:
    token = Authorization.replace("Bearer ", "")
    payload_decoded = jwt.decode(token, JWT_HS256_SECRET_KEY, algorithms="HS256")
    return payload_decoded