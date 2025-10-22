import React, { useState } from "react";
import AfghanistanMap from "./components/mapview.jsx";
import Sidebar from "./components/sidebar.jsx";
import "./index.css"; // merged global + sidebar CSS
import "leaflet/dist/leaflet.css";

export default function App() {
    const [layers, setLayers] = useState({
        provinces: true,
        districts: false,
        regions: false,
        capitals: false,
    });

    const activeLayers = Object.keys(layers).filter((l) => layers[l]);
    const setActiveLayer = (layerName) => {
        setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
    };

    return (
        <div style={{ display: "flex", width: "100%", height: "100vh" }}>
            <Sidebar activeLayers={activeLayers} setActiveLayer={setActiveLayer} />
            <div
                className="map-wrapper"
                style={{
                    flex: 1,
                    marginLeft: "180px", // must match sidebar width
                    height: "100vh",
                    position: "relative",
                }}
            >
                <AfghanistanMap layers={layers} />
            </div>
        </div>
    );
}