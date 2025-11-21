#!/bin/bash

# Load NVM properly in non-interactive shells
export NVM_DIR="$HOME/.nvm"
source /usr/share/nvm/init-nvm.sh

# Select Node version
nvm use 18 > /dev/null

# Fetch data from backend
curl -s http://localhost:3000/api/reports > /home/Aryan/FloodWatch/scripts/latest_reports.json

# Save log
echo "Updated at: $(date)" >> /home/Aryan/FloodWatch/scripts/update.log

