from abc import ABC, abstractmethod
from rest_framework.response import Response
from rest_framework import status


class BaseAPIError(ABC):
    @abstractmethod
    def as_response(self):
        pass


class APIError(BaseAPIError):
    def __init__(self, message: str, code: int = status.HTTP_400_BAD_REQUEST, details: str = None):
        self.message = message
        self.code = code
        self.details = details

    def as_response(self):
        error_response = {
            "error": {
                "message": self.message,
                "code": self.code,
            }
        }
        if self.details:
            error_response["error"]["details"] = self.details
        return Response(error_response, status=self.code)
