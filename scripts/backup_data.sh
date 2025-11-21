#!/bin/bash
# -----------------------------------------------------
# FloodWatch - Backup Data Script
# Creates a tar.gz backup of the scripts folder.
# -----------------------------------------------------

BACKUP_DIR="/home/Aryan/FloodWatch/scripts"
DESTINATION="/home/Aryan/FloodWatch/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Make sure backup folder exists
mkdir -p "$DESTINATION"

# Name of backup file
BACKUP_FILE="$DESTINATION/floodwatch_backup_$TIMESTAMP.tar.gz"

# Print starting
echo "=========================================="
echo " FloodWatch: Backup Script"
echo " Starting backup at $TIMESTAMP"
echo "=========================================="

# Create backup
tar -czvf "$BACKUP_FILE" "$BACKUP_DIR" > /dev/null

# Check if backup succeeded
if [ $? -eq 0 ]; then
    echo "[SUCCESS] Backup created at $BACKUP_FILE"
else
    echo "[ERROR] Backup failed."
fi

echo "[DONE] Backup completed."
echo "=========================================="
