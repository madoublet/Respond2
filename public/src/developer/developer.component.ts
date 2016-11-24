import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../shared/services/site.service';

declare var toast: any;
declare var __moduleName: string;

@Component({
    selector: 'respond-developer',
    templateUrl: 'developer.component.html',
    providers: [SiteService]
})

export class DeveloperComponent {

  id;
  errorMessage;
  selectedOption;
  addVisible: boolean = false;
  removeVisible: boolean = false;
  drawerVisible: boolean = false;
  settingsVisible: boolean = false;

  constructor (private _siteService: SiteService, private _router: Router) {}

  /**
   * Init pages
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');
    this.settingsVisible = false;
    this.drawerVisible = false;

    this.list();

  }

  /**
   * Updates the list
   */
  list() {

    this.reset();
  }

  /**
   * Resets an modal booleans
   */
  reset() {
    this.drawerVisible = false;
  }

  /**
   * Sets the list item to active
   *
   * @param {String} option
   */
  setActive(option) {
    this.selectedOption = option;
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * Reload system files
   */
  reload() {

    this._siteService.reload()
                     .subscribe(
                       data => { toast.show('success'); },
                       error => { toast.show('failure');  }
                      );

  }

  /**
   * Reindex pages
   */
  reindex() {

    this._siteService.reindex()
                     .subscribe(
                       data => { toast.show('success'); },
                       error => { toast.show('failure');  }
                      );

  }

  /**
   * Republish site
   */
  sitemap() {
    this._siteService.sitemap()
                     .subscribe(
                       data => { toast.show('success'); },
                       error => { toast.show('failure');  }
                      );
  }

  /**
   * Migrate R5 site
   */
  migrate() {
    this._siteService.migrate()
                     .subscribe(
                       data => { toast.show('success'); },
                       error => { toast.show('failure');  }
                      );
  }

  /**
   * handles error
   */
  failure (obj) {

    console.log(obj);

    toast.show('failure');

    if(obj.status == 401) {
      this._router.navigate( ['/login', this.id] );
    }

  }


}