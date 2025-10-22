import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { provinces, getDistrictColor, getDistrictHoverColor } from "../palette.js";

const getProvinceColors = (features) => {
    const colors = {};
    features.forEach((f) => {
        const id = f.properties?.ID || f.properties?.name;
        colors[id] = provinces[Math.floor(Math.random() * provinces.length)];
    });
    return colors;
};

const createStarIcon = (size = 16, color = "#ff0067") =>
    L.divIcon({
        html: `<span style="font-size:${size}px; color:${color}">&#9733;</span>`,
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });

export default function AfghanistanMap({ layers }) {
    const [geoData, setGeoData] = useState({});
    const [provinceColors, setProvinceColors] = useState({});

    useEffect(() => {
        Object.entries(layers).forEach(([name, isActive]) => {
            if (isActive && !geoData[name]) {
                (async () => {
                    try {
                        const res = await fetch(`${import.meta.env.BASE_URL}data/${name}.geojson`);
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        const data = await res.json();
                        if (name === "provinces") setProvinceColors(getProvinceColors(data.features));
                        setGeoData((prev) => ({ ...prev, [name]: data }));
                    } catch (err) {
                        console.error(`Error loading ${name}`, err);
                        setGeoData((prev) => ({ ...prev, [name]: { features: [] } }));
                    }
                })();
            }
        });
    }, [layers]);

    const getFeatureColor = (layerName, feature) => {
        if (layerName === "provinces") {
            const id = feature.properties?.ID || feature.properties?.name;
            return provinceColors[id] || "#888";
        } else if (layerName === "districts") {
            return getDistrictColor(feature.properties?.palette_index || 0);
        } else if (layerName === "regions") {
            return feature.properties?.color || "#bbb";
        }
        return "#888";
    };

    const onEachFeature = (layerName) => (feature, layer) => {
        const props = feature.properties;
        let popupContent = "";
        if (layerName === "provinces") {
            popupContent = `Province: ${props?.NAME_1 || props?.NAME || props?.name}`;
        } else if (layerName === "districts") {
            popupContent = `District: ${props?.NAME || props?.name}<br>Province: ${props?.Province || props?.province}`;
        } else if (layerName === "regions") {
            popupContent = `Region: ${props?.region_name}<br>Province: ${props?.province_name}<br>Includes: ${props?.description}`;
        }

        layer.bindPopup(`<b>${popupContent}</b>`);

        if (layerName === "districts") {
            const index = props?.palette_index || 0;
            layer.on({
                mouseover: (e) => e.target.setStyle({ fillColor: getDistrictHoverColor(index) }),
                mouseout: (e) => e.target.setStyle({ fillColor: getDistrictColor(index) }),
            });
        } else if (layerName === "regions") {
            const base = props?.color || "#bbb";
            const hover = props?.hover_color || base;
            layer.on({
                mouseover: (e) => e.target.setStyle({ fillColor: hover }),
                mouseout: (e) => e.target.setStyle({ fillColor: base }),
            });
        }
    };

    return (
        <MapContainer
            center={[33.9391, 67.7099]}
            zoom={6}
            style={{ width: "100%", height: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />

            {Object.entries(geoData).map(([layerName, data]) =>
                layers[layerName] && data ? (
                    layerName === "capitals" ? (
                        data.features.map((feature) => {
                            const [lon, lat] = feature.geometry.coordinates;
                            return (
                                <Marker
                                    key={feature.id || feature.properties?.name}
                                    position={[lat, lon]}
                                    icon={createStarIcon(
                                        feature.properties?.marker_size || 16,
                                        feature.properties?.color || "#ff0067"
                                    )}
                                >
                                    <Popup>
                                        <b>
                                            Capital: {feature.properties?.name}<br />
                                            Province: {feature.properties?.province}
                                        </b>
                                    </Popup>
                                </Marker>
                            );
                        })
                    ) : (
                        <GeoJSON
                            key={layerName}
                            data={data}
                            style={(feature) => ({
                                color: "#444",
                                weight: layerName === "regions" ? 2 : 1,
                                fillColor: getFeatureColor(layerName, feature),
                                fillOpacity: layerName === "regions" ? 0.35 : 0.6,
                            })}
                            onEachFeature={onEachFeature(layerName)}
                        />
                    )
                ) : null
            )}
        </MapContainer>
    );
}

        
