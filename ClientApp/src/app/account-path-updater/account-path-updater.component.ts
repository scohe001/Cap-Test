import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountmanagerService } from '../accountmanager.service';
import { Account } from '../interfaces/account';

@Component({
  selector: 'app-account-path-updater',
  templateUrl: './account-path-updater.component.html',
  styleUrls: ['./account-path-updater.component.css']
})
export class AccountPathUpdaterComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService) { }

  async ngOnInit() {
    console.log("Re-navigating to the specific account path!");
    let id = this.route.snapshot.paramMap.get('id');
    let account: Account = await this.accountManager.GetAccount(id);

    // Add full name to the end of the link
    this.router.navigate([account.FirstName + account.LastName], {
     relativeTo: this.route,
     queryParamsHandling: 'merge',
     replaceUrl: true, // Prevent this from being stored in history
   });
  }

}
