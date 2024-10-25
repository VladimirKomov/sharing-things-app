from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from common.logger import Logger


class BaseAPIRequest(ABC):
    @abstractmethod
    def as_request(self):
        pass

    @abstractmethod
    def __str__(self):
        pass

    # log request
    @abstractmethod
    def log(self):
        pass


class APIRequest(BaseAPIRequest):
    def __init__(self, data: Optional[Any] = None, headers: Optional[Dict[str, str]] = None):
        self.data = data
        self.headers = headers or {}

        self.log()

    def as_request(self) -> Dict[str, Any]:
        response_data = {"data": self.data} if self.data else {}
        if self.headers:
            response_data["headers"] = self.headers
        return response_data

    def __str__(self) -> str:
        data_str = f", data: {self.data}" if self.data else ""
        headers_str = f", headers: {self.headers}" if self.headers else ""
        return f"APIRequest({data_str}{headers_str})"

    def log(self):
        Logger.log_request(str(self))
