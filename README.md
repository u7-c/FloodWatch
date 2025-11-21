🌊 FloodWatch

FloodWatch is a full-stack, real-time web application designed to keep communities safe by providing up-to-date flood alerts and empowering citizens to report local conditions. It combines official data with crowdsourced intelligence on an interactive, dynamic map.

🚀 Features

Frontend (Client-Side)

Interactive Map: A dynamic map powered by Leaflet.js that displays real-time flood alerts with custom markers and danger zones.

Dynamic Alert System: A responsive sidebar that automatically updates with live flood data fetched from the server.

"Click-to-Fly" Navigation: Clicking an alert in the list smoothly animates the map to the affected location.

Community Reporting: A dedicated interface for users to submit flood reports, complete with live image previews.

Responsive Design: A modern, clean UI built with HTML5 and CSS3 using Flexbox and Grid for full responsiveness across devices.

Backend (Server-Side)

RESTful API: Built with Node.js and Express, featuring endpoints for retrieving reports (GET) and submitting new ones (POST).

Geocoding: Integrated OpenCage API to automatically convert user-submitted location text (e.g., "Amritsar, Punjab") into precise GPS coordinates.

Data Persistence: Powered by a SQLite database (floodwatch.db) to store all official and community reports permanently.

Security: Implemented CORS protection and SQL Prepared Statements to prevent injection attacks.

Unix Integration (Automation Scripts)

FloodWatch includes a suite of Bash scripts for system automation and maintenance:

update_flood_data.sh: Automatically fetches the latest flood reports from the backend server and logs the activity.

add_alert.sh: A CLI tool for administrators to manually add flood alerts directly from the terminal.

backup_data.sh: Creates compressed .tar.gz backups of all logs and scripts for data safety.

clean_logs.sh: Automatically deletes log files older than 7 days to manage disk space.

Cron Job: Configured to run the update script every 30 minutes for fully automated data fetching.

🛠️ Tech Stack

Frontend: HTML5, CSS3, JavaScript (ES6+), Leaflet.js

Backend: Node.js, Express.js

Database: SQLite

APIs: OpenCage Geocoding API

DevOps/Scripting: Bash, Cron

📦 Installation & Setup

Clone the Repository

git clone [https://github.com/your-username/FloodWatch.git](https://github.com/your-username/FloodWatch.git)
cd FloodWatch


Install Backend Dependencies

npm install


Database Setup
Run the one-time setup script to create the floodwatch.db file and tables:

node database.js


Start the Server

node server.js


The server will start at http://localhost:3000.

Launch the Frontend
Open index.html in your browser (or use Live Server in VS Code).

📜 Unix Script Usage

Ensure your backend server is running before using these scripts.

Update Flood Data:

bash scripts/update_flood_data.sh


Add Manual Alert:

bash scripts/add_alert.sh "Heavy rainfall in Solan"


Backup System:

bash scripts/backup_data.sh


Clean Old Logs:

bash scripts/clean_logs.sh


🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.