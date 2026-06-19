import { bootstrapApplication } from '@angular/platform-browser';
import { App, appConfig } from './app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
