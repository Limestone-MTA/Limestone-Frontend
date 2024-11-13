import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Function to load the config.js dynamically
function loadAppConfig(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'assets/config.js'; // Load the config file from the assets folder
    script.onload = () => {
      resolve(); // Resolve the promise once config.js is loaded
    };
    script.onerror = () => reject('Could not load config.js');
    document.head.appendChild(script); // Dynamically append the script to the <head>
  });
}

// Wait for config.js to load before bootstrapping Angular app
loadAppConfig()
  .then(() => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  })
  .catch(err => {
    console.error('Error loading configuration:', err);
    // Optionally, handle the error (e.g., show a friendly message or default config)
  });
