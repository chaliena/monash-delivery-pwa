import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular'; // Install this if you haven't yet

export default defineConfig({
    base: '', // Adjust based on your deployment
    plugins: [angular()],
    resolve: {
        alias: {
            '@': '/src' // Add alias for easy imports
        }
    },
    server: {
        port: 4200, // Or your preferred port
        open: true
    }
});
