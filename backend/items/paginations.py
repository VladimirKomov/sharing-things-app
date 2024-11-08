from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from common.mapper import map_to_api_response_as_resp


class ItemsPagination(PageNumberPagination):
    page_size_query_param = 'limit'  # count of elements
    page_query_param = 'page'  # number of page
    max_page_size = 100  # max count

    def get_paginated_response(self, data):
        return map_to_api_response_as_resp(
            data={
                'items': data,
                'totalItems': self.page.paginator.count,
                'totalPages': self.page.paginator.num_pages,
                'currentPage': self.page.number,
                'hasNextPage': self.page.has_next(),
                'hasPreviousPage': self.page.has_previous()
            },
            message="Items retrieved successfully",
            code=status.HTTP_200_OK
        )
