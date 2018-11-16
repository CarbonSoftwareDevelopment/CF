import {Component, OnChanges, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import {AdminService} from '../../Admin/admin.service';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.css']
})
export class AddFileComponent implements OnInit {
  fileForm: FormGroup;
  propForm: FormGroup;
  contactsForm: FormGroup;
  propTypes: String[] = [];
  filteredProps: Observable<any[]>;
  actionTypes: String[] = [];
  filteredActions: Observable<any[]>;
  deedsOffices: String[] = [];
  filteredDeeds: Observable<any[]>;
  milestonesLists: String[] = [];
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private adminService: AdminService
  ) {
    this.createFileForm();
    this.createPropertyForm();
    this.adminService.getProperties()
      .subscribe(res => {
        if (res) {
          this.propTypes = res.propertyTypes;
          this.actionTypes = res.actionTypes;
          this.deedsOffices = res.deedsOffices;
          // ======= Autocomplete Filters =============
          this.filteredProps = this.propType.valueChanges
            .pipe(
              startWith(''),
              map(prop => prop ? this.filterProps(prop) : this.propTypes.slice())
            );
          this.filteredActions = this.action.valueChanges
            .pipe(
              startWith(''),
              map(ac => ac ? this.filterActions(ac) : this.actionTypes.slice())
            );
          this.filteredDeeds = this.deedsOffice.valueChanges
            .pipe(
              startWith(''),
              map(d => d ? this.filterDeeds(d) : this.deedsOffices.slice())
            );
          // ======= Autocomplete Filters =============
        }
      }, err => {
        console.log(err);
      });
    this.adminService.getAllMilestoneLists()
      .subscribe(res => {
        if (res) {
          this.milestonesLists = res.map((ml) => ml.title);
        }
      }, err => {
        console.log(err);
      });
  }
  ngOnInit() {}
  // ======= File Form functions ===============

    // ====auto complete functions=======
  filterProps(val: string) {
    let results = this.propTypes.filter(prop =>
      prop.toLowerCase().indexOf(val.toLowerCase()) === 0);
    if (results.length < 1) {
      results = ['Would you like to add *' + val + '* to Property Types?'];
    }
    return results;
  }
  propTypeSelected(option) {
    if (option.value.indexOf('Would you like to add') > - 1) {
      const newState = option.value.split('*')[1];
      this.propTypes.push(newState);
      // TODO: persist prop type to database
      this.propType.setValue(newState);
    }
  }
  filterActions(val: string) {
    let results = this.actionTypes.filter(ac =>
      ac.toLowerCase().indexOf(val.toLowerCase()) === 0);
    if (results.length < 1) {
      results = ['Would you like to add *' + val + '* to Action Types?'];
    }
    return results;
  }
  actionTypeSelected(option) {
    if (option.value.indexOf('Would you like to add') > - 1) {
      const newState = option.value.split('*')[1];
      this.actionTypes.push(newState);
      // TODO: persist prop type to database
      this.action.setValue(newState);
    }
  }
  filterDeeds(val: string) {
    let results = this.deedsOffices.filter(d =>
      d.toLowerCase().indexOf(val.toLowerCase()) === 0);
    if (results.length < 1) {
      results = ['Would you like to add *' + val + '* to Deeds Offices?'];
    }
    return results;
  }
  deedsSelected(option) {
    if (option.value.indexOf('Would you like to add') > - 1) {
      const newState = option.value.split('*')[1];
      this.deedsOffices.push(newState);
      // TODO: persist prop type to database
      this.deedsOffice.setValue(newState);
    }
  }
    // ====auto complete functions=======

  createFileForm() {
    this.fileForm = this.fb.group({
      fileRef: ['', Validators.required],
      action: ['', Validators.required],
      ourRef: [this.auth.getName(), Validators.required],
      milestoneProc: ['', Validators.required] // TODO: get milestone lists from DB
    });
  }
  get fileRef () {
    return this.fileForm.get('fileRef');
  }
  get action () {
    return this.fileForm.get('action');
  }
  get ourRef () {
    return this.fileForm.get('ourRef');
  }
  get milestoneProc () {
    return this.fileForm.get('milestoneProc');
  }
  // ======= File Form functions ===============
  // ======= Property Form functions ===============
  createPropertyForm() {
    this.propForm = this.fb.group({
      propType: ['', Validators.required],
      deedsOffice: ['', Validators.required],
      erfNum: ['', Validators.required],
      portionNum: ['', Validators.required]
    });
  }
  get deedsOffice () {
    return this.propForm.get('deedsOffice');
  }
  get erfNum () {
    return this.propForm.get('erfNum');
  }
  get portionNum () {
    return this.propForm.get('portionNum');
  }
  get propType () {
    return this.propForm.get('propType');
  }
  // ======= Property Form functions ===============

}
