import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DeliveryMap from './components/DeliveryMap';
import Elves from './components/Elves';
import Toys from './components/Toys';
import SystemHealth from './components/SystemHealth';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                {/* Admin Routes wrapped in Layout */}
                <Route path="/admin" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="map" element={<DeliveryMap />} />
                    <Route path="elves" element={<Elves />} />
                    <Route path="toys" element={<Toys />} />
                    <Route path="health" element={<SystemHealth />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
