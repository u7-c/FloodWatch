// This code runs when the entire page is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    
    // ===================================
    // 1. MAP INITIALIZATION
    // ===================================
    // Check if the map container exists before initializing the map
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        // If there's no map on this page, stop running the map-specific code
        return; 
    }
    const alertsList = document.getElementById('alerts-list');
    
    const map = L.map('map').setView([22.5726, 88.3639], 5); // Centered on India
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // ===================================
    // 3. CUSTOM ICON DEFINITIONS
    // ===================================
    const markerReferences = {};
    const highIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    const mediumIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    const lowIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    
    
    
    // We removed the old hard-coded 'floodAlerts' array.
    // The server is now our single source of truth.
    async function fetchReportsAndDisplay(){
        try{
            const response = await fetch('http://localhost:3000/api/reports');
            if (!response.ok){
                throw new Error('failed to fetch reports from the server.');
            }
            const data = await response.json();
            const reports = data.reports;

            //clearing any existing alerts in the field
            
            alertsList.innerHTML = '';

            //looping through the reports that we fetched 
            //and displaying them on 
            //making an array of each rweport and adding hem through the fxn which i made below
            reports.forEach(report => {
                addAlertToList(report);
                addReportToMap(report);
            });
        }catch (error){
            console.log('error fetching:',error);
            //showing error messasge to the users
        }
    }
    function addAlertToList(report) {
        const newAlertItem = document.createElement('div');
        newAlertItem.className = "alert-item";
        //to add the css styles of alert-item which is same as the rest of the divs

        newAlertItem.innerHTML = //same backticks technique because we arw creating a div of same type
          `
            <div class="badge ${report.severity.toLowerCase()}">${report.severity.toUpperCase()}</div> 
            <div>
                <div class="alert-title">${report.location}</div>
                <div class="alert-meta">Updated just now</div>
            </div>
        `;

        //adding eventlistener for the fly to fxn
        newAlertItem.addEventListener('click',() => {
            const targetMarker = markerReferences[report.location];
            if(targetMarker){
                map.flyTo(targetMarker.getLatLng(),8);//flying to marker at aa size level of 8
                targetMarker.openPopup();
            }
        })

        alertsList.prepend(newAlertItem);
        //so that the newly formed div goes on the top
    }

    //the function used above to add to the map
    function addReportToMap(report){
        if(!report.lat || !report.lng){
            console.warn(`report for "${report.location}" has no coordinates. skipping map marker`);
            return;
        }
        //cuz i changed the coords coming from server.js to lat and lng so ->
        const coords = [report.lat , report.lng];
        let iconToUse, circleColor;
        if (report.severity === 'High') {
            iconToUse = highIcon; circleColor = '#e76f51';
        } else if (report.severity === 'Medium') {
            iconToUse = mediumIcon; circleColor = '#f4a261';
        } else {
            iconToUse = lowIcon; circleColor = '#2a9d8f';
        }

        const marker = L.marker(coords,{icon: iconToUse}).addTo(map);
        marker.bindPopup(`<strong>${report.location}</strong><br>Severity: ${report.severity}`);

        markerReferences[report.location] = marker;

        if(report.radius){
            L.circle(coords,{color: circleColor,fillColor: circleColor, fillOpacity: 0.3,radius: report.radius}).addTo(map);
        }
    }
    
    


    

    

    // ===================================
    // 6. MODAL CONTROL LOGIC
    // ===================================
    const reportBtn = document.getElementById('report-flood-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    // This check is important so the code doesn't crash on other pages
    if (reportBtn && closeModalBtn && modalOverlay) {
        function toggleModal() {
            modalOverlay.classList.toggle('active');
        }//modal overly because when u click the black screen u can js exit the form then

        reportBtn.addEventListener('click', toggleModal);
        closeModalBtn.addEventListener('click', toggleModal);
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                toggleModal();
            }
        });


        
        // ===================================
        // 7. FORM SUBMISSION LOGIC
        // ===================================
        const reportForm = document.getElementById('report-form');
        reportForm.addEventListener('submit', function(event) {
            //this prevents the browser from doing its default action
            event.preventDefault();
            //gonnna get all the data of the form and getting it logged inside the console
            const location = document.getElementById('location').value;
            const severity = document.getElementById('severity').value;
            const description = document.getElementById('description').value;

            //creating a data object to send
            const reportData = {location,severity,description};

            //sending the data to the backend uding the fetch api
            //its gonna make a call to the backend
            fetch('http://localhost:3000/api/reports',{
                method: 'POST',//when u want to send the data write POST otherwwise read data u use get
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData),
            })
            .then(response => {
                //checking if response was successful
                //if it fails it will directly go to catch and skip the then(success one)
                if(!response.ok){
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            //only runs if error wasnt thrown above
            .then(data => {//this is thrown back from the backend posst request of newly createds project
                console.log('success : ',data);//logging success message
                //from sbmission we get the values of location and severity and
                //then we call out the function to get the updated values in the alert section
                addAlertToList(data.data);
                addReportToMap(data.data);
                //to shut down the form
                toggleModal();
                reportForm.reset();
                
            })
            //emergency plan if stuff goes wrong
            //1 if the aBOVE THEN throws an error 
            //2 network faliure
            .catch((error) => {
                console.log('error : ',error);
                //in the real app im gonna show this to the user
                alert('there was a problem submitting your report. Please try again');
            });
        });
    }
    fetchReportsAndDisplay();
});