// This script is for the one-time setup of the database.
const sqlite3 = require('sqlite3').verbose();

// This will create a new file named 'floodwatch.db' in the same folder.
const db = new sqlite3.Database('./floodwatch.db', (err) => {
    if (err) {
        // Use console.error for errors to make them stand out.
        console.error("Error opening database", err.message);
    } else {
        console.log('Database connected successfully.');
        
        // The SQL command to create our 'reports' table.
        // It will only run if the table does not already exist.
        db.run(
            `CREATE TABLE IF NOT EXISTS reports (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                location TEXT NOT NULL,
                severity TEXT NOT NULL,
                description TEXT,
                lat REAL,
                lng REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
            )`, 
            (err) => {
                if (err) {
                    console.error("Error creating table", err.message);
                } else {
                    console.log("'reports' table is ready.");
                }

                // It's good practice to close the database connection
                // when this one-time script is finished.
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('Database connection closed.');
                });
            }
        );
    }
});
