from abc import ABC, abstractmethod
from rest_framework.response import Response
from rest_framework import status


class BaseAPIResponse(ABC):
    @abstractmethod
    def as_response(self):
        pass


class APIResponse(BaseAPIResponse):
    def __init__(self, data=None, message="Success", code=status.HTTP_200_OK, metadata=None):
        self.data = data
        self.message = message
        self.code = code
        self.metadata = metadata

    def as_response(self):
        response_data = {
            "message": self.message,
            "code": self.code,
            "data": self.data,
        }
        if self.metadata:
            response_data["metadata"] = self.metadata
        return Response(response_data, status=self.code)
