from typing import Any, Dict


def map_request_to_user_registration(api_req: Dict[str, Any]) -> Dict[str, str]:
    return {
        "username": api_req.data.get("username"),
        "email": api_req.data.get("email"),
        "first_name": api_req.data.get("firstName"),
        "last_name": api_req.data.get("lastName"),
        "password": api_req.data.get("password"),
        "password2": api_req.data.get("password2")
    }
