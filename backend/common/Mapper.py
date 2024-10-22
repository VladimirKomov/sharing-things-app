def map_request_to_user_registration(data: dict) -> dict:
    return {
        "username": data.get("username"),
        "email": data.get("email"),
        "first_name": data.get("firstName"),
        "last_name": data.get("lastName"),
        "password": data.get("password"),
        "password2": data.get("password2")
    }