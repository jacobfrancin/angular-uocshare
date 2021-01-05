import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from 'src/app/models/user';
import { GLOBAL } from 'src/app/services/global';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from '../../services/user.service';


@Component({
    selector:'user-edit',
    templateUrl:'./user-edit.component.html',
    providers:[UserService, UploadService]
})

export class UserEditComponent implements OnInit{
    public title:string;
    public user:User;
    public identity;
    public token;
    public status:string;
    public url:string;

    constructor( 
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _uploadService:UploadService
        
        )
        {
        this.title='Actualizar mis datos';
        this.user=this._userService.getIdentity();
        this.identity=this.user;
        this.token=this._userService.getToken();
        this.url=GLOBAL.url;
    }

    ngOnInit(){
        console.log('user-edit.component se ha cargado');
    }
    onSubmit(){
        this._userService.updateUser(this.user).subscribe(
            response=>{
                if(!response.user){
                    this.status='error';
                }else{
                    this.status='success';
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.identity=this.user;

                    //Subida imagen perfil
                    this._uploadService.makeFilesRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload, this.token, 'image')
                    .then((result:any) => {
                        this.user.image = result.user.image;
                        localStorage.setItem('identity', JSON.stringify(this.user));
                    });
                }
            },
            error=>{
                var errorMessage=<any>errorMessage;

                if(errorMessage !=null){
                    this.status='error';
                }
            }
        )
    }
    public filesToUpload:Array<File>;
    fileChangeEvent(fileInput:any){
        this.filesToUpload=<Array<File>>fileInput.target.files;
    }
}