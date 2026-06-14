import bcrypt

def hash_password(password: str) -> bytes:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()

    password_hash = bcrypt.hashpw(password_bytes, salt)
    return password_hash

def check_password(password_hash: bytes, input_password: str) -> bool:
    input_password_bytes = input_password.encode('utf-8')

    return bcrypt.checkpw(input_password_bytes, password_hash)