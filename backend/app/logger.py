import logging
import os
from logging.handlers import TimedRotatingFileHandler

log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)

log_file = os.path.join(log_dir, "app.log")

file_handler = TimedRotatingFileHandler(log_file,
                                        when="midnight",
                                        interval=1,
                                        backupCount=7,
                                        encoding="utf-8")
file_handler.suffix = "%Y-%m-%d"

console_handler = logging.StreamHandler()

formatter = logging.Formatter(
    "%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S")
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logging.basicConfig(level=logging.INFO,
                    handlers=[file_handler, console_handler])
