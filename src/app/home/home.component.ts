import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../chat-service.';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  apiErrorMessage: string[] = [];
  openChat: boolean = false;

  constructor(
    private formBuilder : FormBuilder,
    private chatService : ChatService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.userForm = this.formBuilder.group({
      userName: ['', [Validators.required]]
    })
  }

  submitForm(){
    this.submitted = true;
    this.apiErrorMessage = [];


    if(this.userForm.valid) {
      this.chatService.registerUser(this.userForm.value).subscribe({
        next: () => {
          this.chatService.myUserName = this.userForm.get('userName')?.value;
          this.openChat = true;
          this.userForm.reset();
          this.submitted = false;
        },
        error: error => {
          if(typeof (error.error) !== 'object') {
            this.apiErrorMessage.push(error.error)
          }
          console.log(this.apiErrorMessage.length > 0);
        }
      })
    }
  }

  closeChat(){
    this.openChat = false;
  }

}
