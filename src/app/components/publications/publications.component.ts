import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from 'src/app/models/publication';
import { GLOBAL } from 'src/app/services/global';
import { PublicationService } from 'src/app/services/publication.service';
import { UserService } from "src/app/services/user.service";
import * as $ from 'jquery';

@Component({
    selector: 'publications',
    templateUrl: './publications.component.html',
    providers: [UserService, PublicationService],
})

export class PublicationsComponent implements OnInit {
    public identity;
    public token;
    public url;
    public title;
    public status;
    public page;
    public publications: Publication[];
    public total;
    public pages;
    public itemsPerPage;
    @Input() user:string;
    constructor(
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _publicationService: PublicationService,
    ) {
        this.title = 'Publicaciones';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
    }
    ngOnInit() {
        this.getPublications(this.user,this.page);
    }
    getPublications(user, page, adding=false) {
        this._publicationService.getPublicationsUser(this.token,user, page).subscribe(
            response => {
                console.log(response);
                if (response.publications) {
                    this.total=response.total_items;
                    this.pages=response.pages;
                    this.itemsPerPage=response.itemsPerPage;

                    if(!adding){
                       this.publications = response.publications; 
                    }else{
                        var arrayA=this.publications;
                        var arrayB=response.publications;
                        this.publications=arrayA.concat(arrayB);

                        $("html, body").animate({scrollTop: $('body').prop("scrollHeight")},)
                    }
                    
                    if(page > this.pages){
                      // this._router.navigate(['/home']);
                    }

                } else {
                    this.status = 'error';
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }
    public noMore=false;
    viewMore(){
        this.page+=1;
        if(this.page ==this.pages){
            this.noMore=true;
        }
        this.getPublications(this.user,this.page, true);
    }
}
