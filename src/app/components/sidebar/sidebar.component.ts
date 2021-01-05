import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from 'src/app/models/publication';
import { GLOBAL } from 'src/app/services/global';
import { PublicationService } from 'src/app/services/publication.service';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector:'sidebar',
    templateUrl:'./sidebar.component.html',
    providers:[UserService, PublicationService, UploadService,]
})

export class SidebarComponent implements OnInit{
    public identity;
    public token;
    public stats;
    public url;
    public status;
    public publication:Publication;
    public title;
 

    constructor(
        private _userService:UserService,
        private _publicationService:PublicationService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _uploadService:UploadService
    ){
        this.identity=this._userService.getIdentity();
        this.token=this._userService.getToken();
        this.stats=this._userService.getStats();
        this.title='Perfil'
        this.url=GLOBAL.url;
        this.publication=new Publication("","","","",this.identity._id);
    }

    ngOnInit(){

    }
    onSubmit(form, $event){
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response=>{
                if(response.publication){

                   if(this.filesToUpload && this.filesToUpload.length){
                    this._uploadService.makeFilesRequest(this.url+'upload-image-pub/'+ response.publication._id, [],this.filesToUpload, this.token, 'image')
                    .then((result:any)=>{
                        this.status='success'; 
                        this.publication.file=result.image;
                        form.reset();
                        this._router.navigate(['/timeline']);
                        this.sended.emit({send:'true'});
                    });
                   }else{
                    this.status='success'; 
                    form.reset();
                    this._router.navigate(['/timeline']);
                    this.sended.emit({send:'true'});
                   }
                    
                }else{
                    this.status='error';
                }
            },
            error=>{
                var errorMessage =<any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.status='error;'
                }
            }
        );
    }

    public filesToUpload:Array<File>;
    fileChangeEvent(fileInput:any){
        this.filesToUpload= <Array<File>>fileInput.target.files;
    }
       //Output
       @Output() sended=new EventEmitter();

       sendPublication(event){
       
       }
   
}