import { motion } from "framer-motion";
import "./sidebar.css";

export default function Sidebar({ activeLayers, setActiveLayer }) {
    const sections = [
        { id: "provinces", label: "Provinces" },
        { id: "districts", label: "Districts" },
        { id: "regions", label: "Regions" },
        { id: "capitals", label: "Capitals" },
    ];

    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0, transition: { type: "spring", stiffness: 120 } }}
            className="sidebar"
        >
            <h1>Afghanistan Map</h1>
            <div className="buttons">
                {sections.map((sec) => (
                    <button
                        key={sec.id}
                        onClick={() => setActiveLayer(sec.id)}
                        className={activeLayers.includes(sec.id) ? "active" : ""}
                    >
                        {sec.label}
                    </button>
                ))}
            </div>
            <div className="footer">
                <img
                    src="https://raw.githubusercontent.com/ikoonat/afghanistan-map/main/src/assets/afghanmedallion.png"
                    alt="Afghan Medallion"
                    width="120"
                    height="100"
                />
            </div>
        </motion.div>
    );
}
