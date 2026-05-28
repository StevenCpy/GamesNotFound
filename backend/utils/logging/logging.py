import sys

def dev_log(func, message):
    print(f"{func} - {message}")

def dev_error_database(func, error_message):
    print(f"{func} - Database error: {error_message}", file=sys.stderr)