STATUS_SUCCESS_MESSAGE = "Success"
STATUS_FAIL_MESSAGE = "Fail"

def status_success(body: dict|None = None) -> dict:
    return (body or {}) | {"status": STATUS_SUCCESS_MESSAGE}

def status_fail(details: str) -> dict:
    return {"details": details, "status": STATUS_FAIL_MESSAGE}