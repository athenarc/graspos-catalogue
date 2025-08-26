#!/bin/bash

# MongoDB credentials
MONGO_USER=${MONGO_INITDB_ROOT_USERNAME:-graspos}
MONGO_PASS=${MONGO_INITDB_ROOT_PASSWORD:-graspos}
MONGO_HOST=${MONGO_HOST:-mongodb}
MONGO_PORT=${MONGO_CONTAINER_PORT:-27017}
DB_NAME="graspos"

# Backup folder
BACKUP_ROOT="/dumps/mongodb"
TIMESTAMP=$(date +%F_%H-%M-%S)
BACKUP_DIR="$BACKUP_ROOT/graspos_backup_$TIMESTAMP"

mkdir -p "$BACKUP_DIR"

# Run mongodump
mongodump --username $MONGO_USER \
          --password $MONGO_PASS \
          --authenticationDatabase admin \
          --host $MONGO_HOST \
          --port $MONGO_PORT \
          --db $DB_NAME \
          --out "$BACKUP_DIR"

echo "Backup completed: $BACKUP_DIR"

# Keep only the latest backup
cd "$BACKUP_ROOT" || exit
BACKUPS=($(ls -dt graspos_backup_*))
# Remove all but the first two (most recent)
if [ ${#BACKUPS[@]} -gt 2 ]; then
    for old in "${BACKUPS[@]:2}"; do
        rm -rf "$old"
        echo "Deleted old backup: $old"
    done
fi
