import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector:'login',
    templateUrl:"./login.component.html",
    providers:[UserService]
})

export class LoginComponent implements OnInit{
    public title:string;
    public user:User;
    public status:string;
    public identity:any;
    public token:any;
    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService:UserService
    ){
        this.title='Identificate';
        this.user=new User("", "", "", "", "", "", "ROLE_USER", "");
        this.status='';
        this.identity=null;
        this.token=null;
    }
    ngOnInit(){

    }
    onSubmit(){
        this._userService.login(this.user).subscribe(
            response=>{
                this.identity=response.user;
                if(!this.identity || !this.identity._id){
                    this.status='error';
                }else{
                    //Persistir datos usuario
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                    //Conseguir token
                    this.gettoken();
                }
            },
            error=>{
                var errorMessage=<any>error;
                if(errorMessage !=null){
                    this.status='error';
                }

            }
        );
    }

    gettoken(){
        this._userService.login(this.user, 'true').subscribe(
            response=>{
                this.token=response.token;

                if(this.token.length <=0){
                    this.status='error';
                }else{
                

                    localStorage.setItem('token', this.token);

                    this.getCounters();
                   
                }
            },
            error=>{
                var errorMessage=<any>error;
                if(errorMessage !=null){
                    this.status='error';
                }

            }
        );
    }

    getCounters(){
        this._userService.getCounters().subscribe(
            response=>{
                localStorage.setItem('stats', JSON.stringify(response));
                this.status='success';
                this._router.navigate(['/']);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    }
