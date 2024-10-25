from abc import ABC, abstractmethod
from typing import Dict, Any

from rest_framework.response import Response
from rest_framework import status

from common.logger import logger, Logger


class BaseAPIResponse(ABC):
    @abstractmethod
    def as_response(self):
        pass

    @abstractmethod
    def __str__(self):
        pass

    # log response
    @abstractmethod
    def log(self):
        pass


class APIResponse(BaseAPIResponse):
    def __init__(self, data=None, message="Success", code=status.HTTP_200_OK, metadata=None):
        self.data = data
        self.message = message
        self.code = code
        self.metadata = metadata

        self.log()

    def as_response(self) -> Dict[str, Any]:
        response_data = {
            "message": self.message,
            "code": self.code,
            "data": self.data,
        }
        if self.metadata:
            response_data["metadata"] = self.metadata
        return Response(response_data, status=self.code)

    def __str__(self) -> str:
        metadata_str = f", metadata: {self.metadata}" if self.metadata else ""
        data_str = f", data: {self.data}" if self.data else ""
        return f"APIResponse(code: {self.code}, message: {self.message}{data_str}{metadata_str})"

    def log(self):
        Logger.log_response(str(self))
