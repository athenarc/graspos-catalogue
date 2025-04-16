#!/bin/bash

# Export current environment to be available for cron
printenv | grep -v "no_proxy" >> /etc/environment

# Start cron in background
cron

# Optionally kick off FastAPI or other services
uvicorn main:app --host 0.0.0.0 --port 8080 --reload