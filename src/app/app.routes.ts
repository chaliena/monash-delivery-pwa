import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'; // Standalone import
import { ListDriversComponent } from './components/list-drivers/list-drivers.component';
import { AddDriverComponent } from './components/add-driver/add-driver.component';
import { DeleteDriverComponent } from './components/delete-driver/delete-driver.component';
import { ListPackagesComponent } from './components/list-packages/list-packages.component';
import { AddPackageComponent } from './components/add-package/add-package.component';
import { DeletePackageComponent } from './components/delete-package/delete-package.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { HomeComponent } from './components/home/home.component';
import { UpdateDriverComponent } from './components/update-driver/update-driver.component';
import { UpdatePackageComponent } from './components/update-package/update-package.component';
import { HttpClientModule } from '@angular/common/http';
import { InvalidDataComponent } from './components/invalid-data/invalid-data.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './services/authentication-guard.service';

export const routes: Routes = [
    { path: '32510799/Chaliena/api/v1', component: HomeComponent, pathMatch: 'full' },  // No trailing slash
    { path: '32510799/Chaliena/api/v1/drivers', component: ListDriversComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/drivers/add', component: AddDriverComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/drivers/delete', component: DeleteDriverComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/drivers/update', component: UpdateDriverComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/packages', component: ListPackagesComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/packages/add', component: AddPackageComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/packages/delete', component: DeletePackageComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/packages/update', component: UpdatePackageComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/stats', component: StatisticsComponent, canActivate: [AuthGuard] },
    { path: '32510799/Chaliena/api/v1/login', component: LoginComponent },
    { path: '32510799/Chaliena/api/v1/signup', component: SignupComponent },
    { path: '32510799/Chaliena/api/v1/invalid-data', component: InvalidDataComponent },
    { path: '', redirectTo: '32510799/Chaliena/api/v1', pathMatch: 'full' },  // Redirect base to home
    { path: '**', component: PageNotFoundComponent }  // Wildcard route for 404
];
