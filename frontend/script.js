// This code runs when the entire page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize the map
    // We are telling Leaflet to create a map inside the HTML element with the id 'map'.
    // We're setting the initial view to coordinates for New Delhi, India, with a zoom level of 5.
    const map = L.map('map').setView([28.6139, 77.2090], 5);

    // 2. Add the map's background layer (the tiles)
    // This is the visual style of the map. We're using OpenStreetMap, which is a free map provider.
    // The attribution is important to give credit to OpenStreetMap contributors.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    //basically we are just defining all this up
    const floodalerts = [
        {
            location: 'Mumbai, Maharashtra',
            severity: 'high',
            coords: [19.0760, 72.8777],
            radius: 5000 //50km
        },
        {
            location: 'Chennai, Tamil Nadu',
            severity: 'Medium',
            coords: [13.0827, 80.2707],
            radius: 3000 //30km
        },
        {
            location: 'Kolkata, West Bengal',
            severity: 'Low',
            coords: [22.5726, 88.3639],
            radius: 15000 //115km
        }
    ];
    
    //creating customized icons
    const highIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const mediumIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const lowIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    const markerReferences = {};


    //looping through the alerts and add markers to the map
    floodalerts.forEach(alert => {
        //creating a marker at the alerts coordinates
        let iconToUse;
        let circleColor;
        if(alert.severity === 'High'){
            iconToUse = highIcon;
            circleColor = '#e76f51';
        }
        else if(alert.severity === 'Medium'){
                iconToUse = mediumIcon;
                circleColor = '#f4a261';
        }
        else{
            iconToUse = lowIcon;
            circleColor = '#2a9d8f';
        }
        
        const marker = L.marker(alert.coords, {icon: iconToUse}).addTo(map);

        L.circle(alert.coords, {
            color: circleColor,
            fillColor: circleColor,
            fillOpacity: 0.3,
            radius: alert.radius
        }).addTo(map);
        //creatring a text taht pops up when clicked
        const popupContent = `
            <strong>${alert.location}</strong><br>
            Severity: ${alert.severity}
        `;
        //binding this pop up content to the marker below
        marker.bindPopup(popupContent);

        markerReferences[alert.location] = marker;
    })

    //linking sidebar to map

    const alertItems = document.querySelectorAll('.alert-item');

    //adding event listener for each of the alert items
    alertItems.forEach(item => {
        item.addEventListener('click', ()=>{
            //finding the location name from the item clicked
            const locationName = item.querySelector('.alert-title').textContent;

            //finding the corresponding marker for it
            const targetMarker = markerReferences[locationName];

            if(targetMarker){
                //getting the coordinates of the marker of the marker
                const coords = targetMarker.getLatLng();//this gets the latitudes and the longitudes and stuff
                map.flyTo(coords,10);//this is gonna do a animation effecytt just like moving the map to the desired location with a smooth animation and map level 10

                //opening the marker popup
                targetMarker.openPopup();
            }
        })
    })
});

    