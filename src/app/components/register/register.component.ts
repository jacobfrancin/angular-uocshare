import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector:'register',
    templateUrl:"./register.component.html",
    providers:[UserService]
})

export class RegisterComponent implements OnInit{
    public title:string;
    public user:User;
    public status:string;
    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService
    ){
        this.title='Registrate';
        this.user=new User("",
        "",
        "",
        "",
        "",
        "",
        "ROLE_USER",
        "");
        this.status='';
       
    }
    ngOnInit(){

    }
    onSubmit(form){
        this._userService.register(this.user).subscribe(
            response=>{
                if(response.user && response.user._id){
                   
                    this.status='success';
                    form.reset();
                }else{
                    this.status='error';
                }
            },
            error=>{
                console.log(<any>error)
            }
        );
    }
}