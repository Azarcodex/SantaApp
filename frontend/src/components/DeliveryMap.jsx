import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDeliveries, useUpdateDelivery } from '../hooks/useSantaData';

// Fix for default Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DeliveryMap = () => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const markersRef = useRef({});

    const { data: deliveries, isLoading, error } = useDeliveries();
    const updateStatusMutation = useUpdateDelivery();
    const [updatingId, setUpdatingId] = useState(null);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapRef.current) {
            console.log("Map already initialized, skipping...");
            return;
        }

        console.log("Initializing new map instance...");
        try {
            // Create map instance
            mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2);

            // Add Standard OpenStreetMap tiles (most reliable)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapRef.current);

            // Force reflow
            setTimeout(() => {
                if (mapRef.current) {
                    mapRef.current.invalidateSize();
                }
            }, 500);

        } catch (err) {
            console.error("Error initializing map:", err);
        }

        // Cleanup
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Update Markers
    useEffect(() => {
        if (!mapRef.current || !deliveries) return;

        deliveries.forEach(delivery => {
            const color = getColor(delivery.status);

            if (markersRef.current[delivery.id]) {
                // Update existing
                markersRef.current[delivery.id].setStyle({ color: color, fillColor: color });
                bindPopupContent(markersRef.current[delivery.id], delivery);
            } else {
                // Create new
                const circle = L.circleMarker([delivery.lat, delivery.lng], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.7,
                    radius: 10
                }).addTo(mapRef.current);

                markersRef.current[delivery.id] = circle;
                bindPopupContent(circle, delivery);
            }
        });
    }, [deliveries, updatingId]);

    const getColor = (status) => {
        switch (status) {
            case 'Delivered': return '#4ade80';
            case 'In Progress': return '#facc15';
            case 'Not Started': return '#f87171';
            default: return '#94a3b8';
        }
    };

    const bindPopupContent = (marker, delivery) => {
        const popupContent = document.createElement('div');
        popupContent.className = "p-2 min-w-[200px]";

        popupContent.innerHTML = `
            <h3 class="font-bold text-lg mb-1">${delivery.country}</h3>
             <div class="text-sm text-gray-600 mb-2">
                Gifts: ${delivery.giftsDelivered.toLocaleString()}
            </div>
            <div class="text-xs font-bold uppercase mb-3" style="color: ${getColor(delivery.status)}">
                Status: ${delivery.status}
            </div>
        `;

        const btnContainer = document.createElement('div');
        btnContainer.className = "flex flex-col gap-2";

        if (delivery.status !== 'Delivered') {
            const btn = createBtn('Mark Delivered', 'bg-green-500 hover:bg-green-600', () => handleStatusUpdate(delivery.id, 'Delivered'));
            btnContainer.appendChild(btn);
        }
        if (delivery.status === 'Not Started') {
            const btn = createBtn('Start Delivery', 'bg-yellow-500 hover:bg-yellow-600', () => handleStatusUpdate(delivery.id, 'In Progress'));
            btnContainer.appendChild(btn);
        }
        if (delivery.status !== 'Not Started') {
            const btn = createBtn('Reset Status', 'bg-red-500 hover:bg-red-600', () => handleStatusUpdate(delivery.id, 'Not Started'));
            btnContainer.appendChild(btn);
        }

        popupContent.appendChild(btnContainer);
        marker.bindPopup(popupContent);
    };

    const createBtn = (text, classes, onClick) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = `${classes} text-white text-xs py-1 px-2 rounded transition-colors w-full mb-1`;
        btn.onclick = (e) => {
            e.stopPropagation();
            onClick();
            if (mapRef.current) mapRef.current.closePopup();
        };
        return btn;
    };


    const handleStatusUpdate = (id, newStatus) => {
        setUpdatingId(id);
        updateStatusMutation.mutate({ id, status: newStatus }, {
            onSettled: () => setUpdatingId(null)
        });
    };

    if (isLoading) return <div className="p-12 text-white text-2xl animate-pulse">Loading Satellite Map... 🛰️</div>;
    if (error) return <div className="p-12 text-red-500 text-2xl">Satellite Link Offline! 🚫</div>;

    return (
        <div className="h-full flex flex-col p-6">
            <h1 className="text-4xl font-bold text-white mb-6 flex items-center gap-3" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>
                🗺️ Global Delivery Network
            </h1>

            <div className="flex-1 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl relative bg-slate-100" style={{ minHeight: '600px' }}>
                <div ref={mapContainerRef} style={{ height: '600px', width: '100%', display: 'block' }} />
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-6 text-white text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Delivered</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> In Progress</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div> Not Started</div>
            </div>
        </div>
    );
};

export default DeliveryMap;
