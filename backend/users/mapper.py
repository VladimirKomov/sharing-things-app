from typing import Any, Dict


def map_request_to_user_registration(api_req: Dict[str, Any]) -> Dict[str, str]:
    data: Dict[str, str] = api_req.get("data")
    return {
        "username": data.get("username"),
        "email": data.get("email"),
        "first_name": data.get("firstName"),
        "last_name": data.get("lastName"),
        "password": data.get("password"),
        "password2": data.get("password2")
    }
