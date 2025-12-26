import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// TEMP DATA (acts like database)
let christmasState = {
    dashboard: {
        giftsPrepared: 500000,
        giftsDelivered: 320000,
        countriesCovered: 120,
        pendingDeliveries: 80,
    },

    deliveries: [
        { id: 1, country: "India", status: "Delivered", giftsDelivered: 50000, lat: 20.5937, lng: 78.9629 },
        { id: 2, country: "USA", status: "In Progress", giftsDelivered: 30000, lat: 37.0902, lng: -95.7129 },
        { id: 3, country: "Germany", status: "Not Started", giftsDelivered: 0, lat: 51.1657, lng: 10.4515 },
        { id: 4, country: "Australia", status: "Not Started", giftsDelivered: 0, lat: -25.2744, lng: 133.7751 },
        { id: 5, country: "Brazil", status: "In Progress", giftsDelivered: 15000, lat: -14.2350, lng: -51.9253 },
        { id: 6, country: "Japan", status: "Delivered", giftsDelivered: 12000, lat: 36.2048, lng: 138.2529 },
        { id: 7, country: "United Kingdom", status: "Delivered", giftsDelivered: 8000, lat: 55.3781, lng: -3.4360 },
        { id: 8, country: "China", status: "Delivered", giftsDelivered: 60000, lat: 35.8617, lng: 104.1954 },
        { id: 9, country: "Russia", status: "In Progress", giftsDelivered: 25000, lat: 61.5240, lng: 105.3188 },
        { id: 10, country: "Canada", status: "In Progress", giftsDelivered: 5000, lat: 56.1304, lng: -106.3468 },
        { id: 11, country: "France", status: "Not Started", giftsDelivered: 0, lat: 46.2276, lng: 2.2137 },
        { id: 12, country: "South Africa", status: "Not Started", giftsDelivered: 0, lat: -30.5595, lng: 22.9375 },
        { id: 13, country: "Mexico", status: "In Progress", giftsDelivered: 11000, lat: 23.6345, lng: -102.5528 },
        { id: 14, country: "Italy", status: "Not Started", giftsDelivered: 0, lat: 41.8719, lng: 12.5674 },
        { id: 15, country: "Spain", status: "Not Started", giftsDelivered: 0, lat: 40.4637, lng: -3.7492 },
        { id: 16, country: "Egypt", status: "Delivered", giftsDelivered: 15000, lat: 26.8206, lng: 30.8025 },
        { id: 17, country: "Argentina", status: "In Progress", giftsDelivered: 7000, lat: -38.4161, lng: -63.6167 },
        { id: 18, country: "Saudi Arabia", status: "Delivered", giftsDelivered: 9000, lat: 23.8859, lng: 45.0792 },
        { id: 19, country: "New Zealand", status: "Delivered", giftsDelivered: 2000, lat: -40.9006, lng: 174.8860 },
        { id: 20, country: "Greenland", status: "Not Started", giftsDelivered: 0, lat: 71.7069, lng: -42.6043 }
    ],

    elves: [
        { id: 1, name: "Buddy", role: "Toy Maker", status: "Working" },
        { id: 2, name: "Snowy", role: "Packer", status: "Resting" },
        { id: 3, name: "Jingle", role: "Delivery", status: "Working" },
    ],

    toys: {
        production: 70,
        packed: 55,
        ready: 40,
    },

    system: {
        sleighFuel: 85,
        reindeerEnergy: 90,
        weather: "Clear",
    },

    notifications: [
        {
            id: 1,
            message: "Delivery completed in India",
            time: new Date(),
        },
    ],
};

// SIMULATION: Update data every 5 seconds
setInterval(() => {
    christmasState.dashboard.giftsDelivered += 500;
    christmasState.dashboard.pendingDeliveries = Math.max(0, christmasState.dashboard.pendingDeliveries - 1);
}, 5000);

// ROUTE 1: Dashboard data
app.get("/api/dashboard", (req, res) => {
    res.json(christmasState.dashboard);
});

app.get("/api/deliveries", (req, res) => {
    res.json(christmasState.deliveries);
});

app.get("/api/elves", (req, res) => {
    res.json(christmasState.elves);
});

app.get("/api/toys", (req, res) => {
    res.json(christmasState.toys);
});

app.get("/api/system", (req, res) => {
    res.json(christmasState.system);
});

app.get("/api/notifications", (req, res) => {
    res.json(christmasState.notifications);
});

app.put("/api/deliveries/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const delivery = christmasState.deliveries.find(d => d.id === parseInt(id));
    if (delivery) {
        delivery.status = status;
        res.json(delivery);
    } else {
        res.status(404).json({ message: "Delivery not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Santa server running on port ${PORT}`);
});
