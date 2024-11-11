import logging
from datetime import datetime

# logger for the application
logger = logging.getLogger('myapp')


class Logger:
    @staticmethod
    def log_response(res_str: str = ""):
        logger.info(f'INFO: {Logger.get_current_data_time()}: {res_str}')

    @staticmethod
    def log_error(error_str: str = ""):
        logger.error(f'ERROR: {Logger.get_current_data_time()}: {error_str}')

    @staticmethod
    def log_request(request_str: str = ""):
        logger.info(f'INFO: {Logger.get_current_data_time()}: {request_str}')

    @staticmethod
    def get_current_data_time() -> str:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
