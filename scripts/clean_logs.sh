#!/bin/bash
# -----------------------------------------------------
# FloodWatch - Log Cleaner Script
# Deletes logs older than 7 days.
# -----------------------------------------------------

LOG_DIR="/home/Aryan/FloodWatch/scripts"

echo "=========================================="
echo " FloodWatch: Clean Logs Script"
echo "=========================================="

# Show current log files
echo "[INFO] Existing log files:"
ls -lh "$LOG_DIR"

# Find & delete logs older than 7 days
echo "[INFO] Removing logs older than 7 days..."
find "$LOG_DIR" -name "*.log" -mtime +7 -exec rm {} \;

echo "[DONE] Old logs cleaned."
echo "=========================================="
