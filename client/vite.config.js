import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // mobile থেকে access করার জন্য
    port: 5173, // আপনার ইচ্ছেমতো port
  },
});
