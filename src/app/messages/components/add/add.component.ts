
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/message';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    providers: [FollowService, MessageService]
})
export class AddComponent implements OnInit {
    public title: string;
    public message: Message
    public identity;
    public token;
    public url: string;
    public status: string;
    public follows;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _userService: UserService,
        private _messageService: MessageService) {

        this.title = 'Enviar mensaje';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.message = new Message('', '', '', '', this.identity._id, '');
    }

    ngOnInit() {
        this.getMyFollows();

    }

    onSubmit(form){
        this._messageService.addMessage(this.token, this.message).subscribe(
            response=>{
                this.status='success';
                form.reset();
            },error=>{
                this.status='error';
                console.log(<any>error);
            }
        )
    }
    getMyFollows(){
        this._followService.getMyFollows(this.token).subscribe(
            response=>{
              
                this.follows=response.follows;  
                console.log(this.follows);
                
            }, error=>{
                console.log(<any>error);
            }
        )
    }
}