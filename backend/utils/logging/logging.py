import sys

def dev_log(func: str, message: str):
    print(f"{func} - {message}")

def dev_error(func: str, error_message: str):
    print(f"{func} - {error_message}", file=sys.stderr)

def dev_error_database(func: str, error_message: str):
    print(f"{func} - Database error: {error_message}", file=sys.stderr)