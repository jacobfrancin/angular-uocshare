import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import{ModuleWithProviders} from '@angular/core';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';
import { UserGuard } from "./services/user.guard";


const appRoutes:Routes=[
    {path:'', component:TimelineComponent, canActivate:[UserGuard]},
    {path:'home',  component:TimelineComponent, canActivate:[UserGuard]},
    {path:'login', component:LoginComponent},
    {path:'registro', component:RegisterComponent},
    {path:'mis-datos', component:UserEditComponent, canActivate:[UserGuard]},
    {path:'estudiantes', component:UsersComponent, canActivate:[UserGuard]},
    {path:'estudiantes/:page', component:UsersComponent, canActivate:[UserGuard]}, 
    {path:'timeline', component:TimelineComponent, canActivate:[UserGuard]},
    {path:'perfil/:id', component:ProfileComponent, canActivate:[UserGuard]},
    {path:'siguiendo/:id/:page', component:FollowingComponent, canActivate:[UserGuard]},
    {path:'seguidores/:id/:page', component:FollowedComponent, canActivate:[UserGuard]},
    {path:'**',component:TimelineComponent, canActivate:[UserGuard]}
   
];

export const appRoutingProviders: any[]=[];
export const routing:ModuleWithProviders<any>= RouterModule.forRoot(appRoutes);