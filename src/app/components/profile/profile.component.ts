import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Follow } from 'src/app/models/follow';
import { User } from 'src/app/models/user';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    providers: [UserService, FollowService]
})

export class ProfileComponent implements OnInit {
    public identity;
    public token;
    public url;
    public title;
    public stats;
    public followed;
    public following;
    public status: string;
    public user: User;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ) {
        this.title = 'Perfil';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.following = false;
        this.followed = false;
    }

    ngOnInit() {
        this.loadPage();
    }
    loadPage() {
        this._route.params.subscribe(params => {
            let id = params['id'];
            this.getUser(id);
            this.getCounters(id);
        })

    }
    getUser(id) {
        this._userService.getUser(id).subscribe(
            response => {
                if (response.user) {
                    this.user = response.user;

                    if (response.following && response.following._id) {
                        this.following = true;
                    } else {
                        this.following = false;
                    }
                    if (response.followed && response.followed._id ) {
                        this.followed = true;
                    } else {
                        this.followed = false;
                    }
                } else {
                    this.status = 'eror';
                }
            },
            error => {
                this._router.navigate(['/perfil', this.identity._id])
            }
        )
    }

    getCounters(id) {
        this._userService.getCounters(id).subscribe(
            response => {
                this.stats = response;
            },
            error => {
                console.log(<any>error);
            }
        )
    }

    followUser(followed) {
        var follow = new Follow('', this.identity._id, followed);
        this._followService.addFollow(this.token, follow).subscribe(
            response => {
                this.following = true;
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    unfollowUser(followed) {
        this._followService.deleteFollow(this.token, followed).subscribe(
            response => {
                this.following = false;
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    public followUserOver;
    mouseEnter(user_id){
        this.followUserOver=user_id;
    }
    mouseLeave(){
        this.followUserOver=0;
    }
}