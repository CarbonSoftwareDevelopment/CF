import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material';
import {ContactService} from '../contact.service';

@Component({
  selector: 'app-contact-reset-password',
  templateUrl: './contact-reset-password.component.html',
  styleUrls: ['./contact-reset-password.component.css']
})
export class ContactResetPasswordComponent implements OnInit {
  token;
  tokenValid = false;
  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private auth: AuthService,
    private matSnack: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    console.log(this.token);
    this.contactService.checkResetToken(this.token)
      .subscribe(res => {
        if (res) {
          this.tokenValid = true;
        } else {
          const sb = this.matSnack.open('Reset token has expired, please try again.', 'ok');
          sb.afterDismissed().subscribe(() => {
            this.router.navigate(['/contact-forgot']);
          });
        }
      }, er => {
        console.log(er);
      });
  }

  submit(e) {
    this.contactService.updateForgotPassword(this.token, e)
      .subscribe(res => {
        if (res) {
          const sb = this.matSnack.open('Password successfully changed', 'ok');
          sb.afterDismissed().subscribe(() => {
            this.matSnack.open('Please follow the link on your email to log in and view a file.', 'ok');
          });
        } else {
          const sb = this.matSnack.open('Unsuccessful', 'retry');
          sb.afterDismissed().subscribe(() => {
            this.submit(e);
          });
        }
      });
  }
}
