#!/bin/bash
# -----------------------------------------------------
# FloodWatch - Add Alert Script
# Saves a custom alert message into alerts.log
# -----------------------------------------------------

# Path to alert log file
ALERT_LOG="/home/Aryan/FloodWatch/scripts/alerts.log"

# Create the log file if it doesn't exist
touch "$ALERT_LOG"

# Check if message was provided
if [ -z "$1" ]; then
    echo "[ERROR] No alert message provided."
    echo "Usage: ./add_alert.sh \"your-alert-message\""
    exit 1
fi

# Store alert message
ALERT_MESSAGE="$1"

# Get timestamp
TIME_NOW=$(date)

# Save alert to log file
echo "[$TIME_NOW] - $ALERT_MESSAGE" >> "$ALERT_LOG"

echo "[SUCCESS] Alert added successfully!"
echo "Saved to alerts.log"

