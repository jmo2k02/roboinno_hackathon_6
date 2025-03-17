import { Routes } from '@angular/router';
import { SvgUploadComponent } from './modules/components/svg-upload/svg-upload.component';
import { LandingComponent } from './modules/components/landing/landing.component';

export const routes: Routes = [
    {
        component: SvgUploadComponent,
        path: "upload"
    },
    {
        component: LandingComponent,
        pathMatch: "full",
        path: ""
    }
];
