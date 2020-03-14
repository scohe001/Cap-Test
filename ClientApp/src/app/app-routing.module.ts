import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsertableComponent } from './usertable/usertable.component';
import { AlltransactiontableComponent } from './alltransactiontable/alltransactiontable.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: 'accounts', component: UsertableComponent },
  { path: 'transactions', component: AlltransactiontableComponent },
  { path: '**', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
