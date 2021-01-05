import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from 'src/app/models/publication';
import { GLOBAL } from 'src/app/services/global';
import { PublicationService } from 'src/app/services/publication.service';
import { UserService } from "src/app/services/user.service";
import * as $ from 'jquery';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService, PublicationService],
})

export class TimelineComponent implements OnInit {
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
    public showImage;

    constructor(
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _publicationService: PublicationService,
    ) {
        this.title = 'Timeline';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
    }
    ngOnInit() {
        this.getPublications(this.page);
    }
    getPublications(page, adding = false) {
        this._publicationService.getPublications(this.token, page).subscribe(
            response => {
                console.log(response);
                if (response.publications) {
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage = response.itemsPerPage;

                    if (!adding) {
                        this.publications = response.publications;
                    } else {
                        var arrayA = this.publications;
                        var arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);

                        $("html, body").animate({ scrollTop: $('body').prop("scrollHeight") },)
                    }

                    if (page > this.pages) {
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
    public noMore = false;
    viewMore() {
        this.page += 1;
        if (this.page == this.pages) {
            this.noMore = true;
        }
        this.getPublications(this.page, true);
    }

    refresh(event?) {
        this.getPublications(1);
    }

    showThisImage(id) {
        this.showImage = id;
    }
    hideThisImage(id) {
        this.showImage = 0;
    }

    deletePublication(id) {
        this._publicationService.deletePublication(this.token, id).subscribe(
            response => {
                this.refresh();
            },
            error => {
                console.log(<any>error)
            }
        );
    }
}
