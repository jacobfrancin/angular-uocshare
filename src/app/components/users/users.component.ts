import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Follow } from 'src/app/models/follow';
import { User } from 'src/app/models/user';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [UserService, FollowService],
})

export class UsersComponent implements OnInit, DoCheck {
    public title: string;
    public identity;
    public token;
    public status: string;
    public url: string;
    public page;
    public nextpage;
    public prevpage;
    public total;
    public pages;
    public users: User[];
    public follows;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService

    ) {
        this.title = 'Estudiantes';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.currentPage();
    }
    currentPage() {
        this._route.params.subscribe(params => {
            let page = +params['page'];
            this.page = page;
            if (!params['page']) {
                page = 1;
            }

            if (!page) {
                page = 1;
            } else {
                this.nextpage = page + 1;
                this.prevpage = page - 1;

                if (this.prevpage <= 0) {
                    this.prevpage = 1;
                }
            }
            //Devolver usuarios
            this.getUsers(page);
        });
    }
    getUsers(page) {
        this._userService.getUsers(page).subscribe(
            response => {
                if (!response.users) {
                    this.status = 'error';
                } else {
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.users_following;

                    if (page > this.pages) {
                        this._router.navigate(['/estudiantes', 1]);
                    }
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );

    }
    public followUserOver;
    mouseEnter(user_id) {
        this.followUserOver = user_id;
    }
    mouseLeave(user_id) {
        this.followUserOver = 0;
    }

    followUser(followed) {
        var follow = new Follow('', this.identity._id, followed);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {
                if (!response.follow) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    this.follows.push(followed);
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    unfollowUser(followed) {
        this._followService.deleteFollow(this.token, followed).subscribe(
            response=>{
                var search=this.follows.indexOf(followed);
                if(search != -1){
                    this.follows.splice(search, 1);
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }

        );
    } 
    ngDoCheck(){
        return this._userService.getCounters();
    }
}