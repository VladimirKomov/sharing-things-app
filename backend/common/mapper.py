from typing import Dict, Any, Optional

from rest_framework import status

from common.errors import APIError
from common.request import APIRequest
from common.responses import APIResponse


def map_request_to_request(request: Dict[str, Any]) -> Dict[str, Any]:
    return APIRequest(data=request.data, headers=request.headers).as_request()


def map_api_error_as_resp(
        message: str,
        code: int,
        details: Optional[dict] = None
) -> APIError:
    return APIError(message=message, code=code, details=details).as_response()


def map_to_api_response_as_resp(
        data: Optional[Any] = None,
        message: str = "Success",
        code: int = status.HTTP_200_OK,
        metadata: Optional[dict] = None
) -> APIResponse:
    return APIResponse(data=data, message=message, code=code, metadata=metadata).as_response()
