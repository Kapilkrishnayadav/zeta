const Parking=require("../models/ParkingList");
const geolib = require('geolib'); 
exports.searchParkingList=(async(req,res)=>{

        const { name, byRatePerHour, ratePerHour, lat, long, maxDistance, byDistance } = req.query;
    
        try {
            // MongoDB query filters
            const filters = {};
            
            // Filter by name
            if (name) {
                filters.name = { $regex: new RegExp(`.*${name}.*`, 'i') };
            }
            
            // Filter by ratePerHour
            if (byRatePerHour === 'true' && ratePerHour) {
                filters.perhourRate = { $lte: parseInt(ratePerHour) };
            }
    
            // Filter by distance (if byDistance is true and latitude and longitude provided)
            if (byDistance === 'true' && lat && long && maxDistance) {
                const userLocation = { latitude: parseFloat(lat), longitude: parseFloat(long) };
                filters.lat = { $exists: true };
                filters.long = { $exists: true };
    
                const allLocations = await Parking.find(filters);
                const filteredLocations = allLocations.filter(location => {
                    const distance = geolib.getDistance(userLocation, { latitude: location.lat, longitude: location.long });
                    console.log(distance);
                    return distance <= parseInt(maxDistance);
                });
    
                return res.json(filteredLocations);
            }
    
            // Fetch filtered locations from MongoDB
            const filteredLocations = await Parking.find(filters);
            res.json(filteredLocations);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    
    
})