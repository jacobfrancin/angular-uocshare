import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'src/app/models/message';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector:'received',
    templateUrl:'./received.component.html',
    providers:[FollowService, MessageService]
})
export class ReceivedComponent implements OnInit{
    public title:string;
    public messages: Message[];
    public identity;
    public token;
    public url: string;
    public status: string;
    public pages;
    public total;
    public page;
    public nextpage;
    public prevpage;

    constructor( 
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _userService: UserService,
        private _messageService: MessageService)
        {
        this.title='Mensajes recibidos';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
       this.currentPage();
    }
    getMessages(token, page){
        this._messageService.getMyMessage(token, page).subscribe(
            response=>{
                if(!response.messages){
                   
                }else{
                    this.messages=response.messages; 
                    console.log(this.messages);
                    this.pages = response.pages;
                    this.total=response.total;

                }
            }, error=>{
                console.log(<any>error);
            }
        )
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
            this.getMessages(this.token, this.page);
        });
    }
}