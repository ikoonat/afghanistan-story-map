import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/afghanistan-story-map/", // important for GitHub Pages
    plugins: [react()],
});
