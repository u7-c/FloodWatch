//this is gonna be used for importing the express library
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();//now it  will use sql
//creating a express application
const app = express();

//defining the port 
const port = 3000;

//connect to sqlite database  file
const db = new sqlite3.Database('./floodwatch.db',(err)=>{
    if (err){
        console.log("Error opening database",err.message);
    } else{
        console.log("Successfully connected to the sqlite database");
    }
})

const OPENCAGE_API_KEY = '5bf27a08f689432cbaf175248df7346c';

//so we cant just fetch from 5500 to 3000 so need to import cors
app.use(cors());

//we are going to use a middleware 
//this tells the sever and understand the parse
//incoming json data from the frontend
//without this server wont understand the data we send
app.use(express.json());

//as i studied this is gonna tell me that someone wanna visit the
//home page
//shows on page      
app.get('/', (req, res) => {
    res.send('hello from the floodwatch backend server!');
});

//this where the frontend calls out to fetch reports 
app.get('/api/reports', (req, res) => {
    //sql query to get all the reports from the table
    const sql = "SELECT * FROM reports ORDER BY created_at DESC";//get the newest onw on top
    //this fetches the rows
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log('Error fetching data from database ', err.message);
            return res.status(500).json({ message: 'error reading reports data.' });
        }
        //otherwise
        res.json({reports: rows});
    })
})

//so till yet i was just cloging the submit form info from
//the user but now im gonna bring that other way around
//new route....POST ROUTE 
//http method for sending new data to a server.
app.post('/api/reports', async (req, res) => {
    const newReport = req.body;
    console.log('--- New report received on backend ---', newReport);

    //starting geocoding 
    try {
        const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(newReport.location)}&key=${OPENCAGE_API_KEY}&limit=1`;
        const response = await axios.get(geoUrl);//it will return me an envelope which i gotta decode 

        if (response.data && response.data.results.length > 0) {//as all my data is stored in response so i gotta decode it 
            const { lat, lng } = response.data.results[0].geometry;//its a classic destructuring process from lat and lng 
            newReport.lat = lat; // Add coordinates to our report
            newReport.lng = lng; 
            console.log(`Geocoding successful: ${newReport.location} -> [${lat}, ${lng}]`);
        } else {
            console.log(`Geocoding failed for: ${newReport.location}`);
        }
    } catch (error) {
        console.error('Error during geocoding:', error.message);
        // We'll continue even if geocoding fails, just without coords
    }
    const sql = `INSERT INTO reports (location , severity , description , lat , lng) VALUES (? , ? , ? , ? , ?)`;
    const params = [newReport.location, newReport.severity, newReport.description,newReport.lat,newReport.lng]
    
    // Read the existing reports from the file
    db.run(sql, params, function(err){//db.run(destination, options, callbackFunction); using run because we will change stuff from it 
        if (err) {
            console.error('Error saving files to database', err.message);
            return res.status(500).json({ message: 'Error saving report.' });
        }
        console.log(`Report successfully saved database with ID: ${this.lastID}`);//use function, it gives you access to the this keyword. Inside a successful db.run callback, this.lastID contains the unique id that the database automatically generated for the new row we just inserted.
        const savedReport = { ...newReport,id:this.lastID};
        res.status(201).json({message: 'report recieved and successfully!',data: savedReport});//thsi shows 201--- created something
        
    });
});

// 4. Start the server
app.listen(port, () => {
    console.log(`FloodWatch server is running at http://localhost:${port}`);
});

//rows and savedreport in get and post requests arre private variable
//and when thy are sent to the frontend (script.js) they are returned to there respective variables which are report and data resp
