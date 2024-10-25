from abc import ABC, abstractmethod
from typing import Any

from rest_framework.response import Response
from rest_framework import status

from common.logger import Logger


class BaseAPIError(ABC):
    @abstractmethod
    def as_response(self):
        pass

    @abstractmethod
    def __str__(self):
        pass

    # log error
    @abstractmethod
    def log(self):
        pass


class APIError(BaseAPIError):
    def __init__(self, message: str, code: int = status.HTTP_400_BAD_REQUEST, details: Any = None):
        self.message = message
        self.code = code
        self.details = details

        self.log()

    def as_response(self) -> Response:
        error_response = {
            "error": {
                "message": self.message,
                "code": self.code,
            }
        }
        if self.details:
            error_response["error"]["details"] = self.details
        return Response(error_response, status=self.code)

    def __str__(self) -> str:
        details_str = f", data: {self.details}" if self.details else ""
        return f"APIResponse(code: {self.code}, message: {self.message}{details_str})"

    def log(self):
        Logger.log_error(str(self))
