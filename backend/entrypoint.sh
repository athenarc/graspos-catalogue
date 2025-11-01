#!/bin/bash
set -e

echo "[$(date)] Starting entrypoint..."

# 1. Export all env vars for cron jobs
printenv | grep -v "no_proxy" > /etc/environment

# 2. Fix permissions / format for cron jobs file
dos2unix /etc/cron.d/my-cron-job || true
chmod 0644 /etc/cron.d/my-cron-job

# 3. Register cron jobs
crontab /etc/cron.d/my-cron-job

# 4. Prepare logs
touch /var/log/cron.log /var/log/mongo_backup.log
chmod 666 /var/log/*.log

# 5. Start cron daemon in background
echo "[$(date)] Starting cron..."
cron

# 6. Confirm cron is running
ps aux | grep cron

# 7. Show installed cron jobs
echo "=== Installed crontab ==="
crontab -l
echo "=========================="

# 8. Start FastAPI
echo "[$(date)] Starting Uvicorn..."
exec uvicorn main:app --host 0.0.0.0 --port 8080 --reload
