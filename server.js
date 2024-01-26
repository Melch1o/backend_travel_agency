const express = require('express');
const path = require('path') 
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    try {
        res.render('home')
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.get('/travelagency', async (req, res) => {
    try {
        var lat, lon, tour_title_s, tour_desc_s, price
        var weather_discount_s = false
        switch(req.query.tour) {
            case "maldives":
                lat = 3.25;
                lon = 73.00;
                tour_title_s = "Maldives"
                tour_desc_s = "The Maldives, reputed worldwide as a PREMIUM destination with stunning island resorts offering premium accommodation, exceptional service, delectable cuisine, high-end amenities & exotic Spas, amidst mesmeric surroundings. It is the ideal destination for travelers seeking an upscale, tropical beach holiday experience"
                price = 600;
                switch(req.query.hotel) {
                    case "low":
                        price += 40
                        break;
                    case "mid":
                        price += 160
                        break;
                    case "high":
                        price += 300
                        break;
                    default:
                        price +=300
                        break;
                }   
                price = price * req.query.people_count;
                break;
            case "seychelles":
                lat = -4.58;
                lon = 55.66;
                tour_title_s = "Seychelles"
                tour_desc_s = "Located off Africa’s eastern coast, the Seychelles is a total of 115 islands strewn over 1100km, home to some of the world’s most beautiful and pristine beaches known for white sands, turquoise waters, lush greenery and lined by majestic granite boulders.ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ"
                price = 500;
                switch(req.query.hotel) {
                    case "low":
                        price += 25
                        break;
                    case "mid":
                        price += 150
                        break;
                    case "high":
                        price += 280
                        break;
                    default:
                        price +=280
                        break;
                }   
                price = price * req.query.people_count;
                break;
            case "srilanka":
                lat = 7.00;
                lon = 81.00;
                tour_title_s = "Sri Lanka"
                tour_desc_s = "Sri Lanka, known as the ‘pearl of the Indian Ocean’ hangs like a teardrop off of the coast of southern India. Home to varied landscapes and opportunities for adventure, Sri Lanka is blessed with mystical ancient sites and cities, impressive wildlife, palm-fringed beaches, and rolling green hills dotted with tea plantations."
                price = 450;
                switch(req.query.hotel) {
                    case "low":
                        price += 20
                        break;
                    case "mid":
                        price += 130
                        break;
                    case "high":
                        price += 300
                        break;
                    default:
                        price +=300
                        break;
                }   
                price = price * req.query.people_count;
                break;
            default:
                throw new Error("Invalid tour")
        }

        const apiKey = '24d64906-30b8-4cf8-bb29-aa672b6bfbd5'; 
        const response = await axios.get(`https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`, { 
            headers: { 
                'X-Yandex-API-Key': apiKey 
            } 
        })
        
        if(response.data.fact.temp < 25) {
            price -= price/10
            weather_discount_s = true
        }

        res.render('tour', {
            tour_title: tour_title_s,
            tour_desc: tour_desc_s,
            weather: "Temperature: " + response.data.fact.temp + "°C",
            pricing: price + "$",
            weather_discount: weather_discount_s
        })

    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
