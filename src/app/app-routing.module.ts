import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelsPlpComponent } from './models-plp/models-plp.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'models', component: ModelsPlpComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}