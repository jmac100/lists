import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "../services";
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { AutoCompleteComponent } from "../auto-complete/auto-complete.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  id: string
  items: any[] = []
  disabledItems: any[] = []
  location: string
  isLocked: boolean
  isDefault: boolean
  options: any
  data: string = ""

  @ViewChild(AutoCompleteComponent)
  private ac: AutoCompleteComponent

  constructor
  (
    private route: ActivatedRoute, private fb: FirebaseService,
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any
  ) 
  {
    PageScrollConfig.defaultDuration = 500
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id']
    this.getItems();
  }

  getItems() {
    this.fb.getItems(this.id).subscribe(data => {
      this.location = data.location
      this.isLocked = data.isLocked
      this.isDefault = data.isDefault
      this.items = []
      this.disabledItems = []
      data.items.forEach(element => {
        this.items.push(element)
      })
      data.disabledItems.forEach(element => {
        this.disabledItems.push(element)
      });
    })
  }

  addItems(e) {
    let items: Array<string> = e.split('\n').filter(ele => ele.length > 0)
    items.forEach(ele => this.addItem(ele))
    this.ac.clearUpload()
  }

  addItem(e){
    if (this.items.indexOf(e) > -1 || e.length === 0) {
      this.ac.clear()
      return
    }

    this.items.push(e)
    this.fb.addItem(this.id, this.location, this.isLocked, this.items, this.disabledItems, this.isDefault)
    this.ac.clear()
  }

  addButtonClicked(e) {
    if (this.ac.uploadOpen) {
      this.addItems(e.value)
    } else {
      this.addItem(e.value)
    }
  }

  enterPressed(e) {
    if (!this.ac.uploadOpen) {
      this.addItem(e.value)
    }
  }

  downloadToClipboard() {
    let selBox = document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.items.join('\r\n')

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();

    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  addToCart(item) {
    if (this.isLocked) return
    this.items = this.items.filter(element => element !== item)
    this.disabledItems.push(item)

    this.fb.updateSortOrder(this.id, this.location, this.isLocked, this.items, this.disabledItems, this.isDefault)
  }

  removeFromCart(item) {
    this.disabledItems = this.disabledItems.filter(element => element !== item)
    this.items.push(item)

    this.fb.updateSortOrder(this.id, this.location, this.isLocked, this.items, this.disabledItems, this.isDefault)
  }

  fillCart() {
    if (this.isLocked) return
    
    this.items.forEach(ele => {
      this.disabledItems.push(ele)
    })
    this.items = []
    this.fb.updateSortOrder(this.id, this.location, this.isLocked, this.items, this.disabledItems, this.isDefault)
    setTimeout(() => {
      this.goToTop()
    }, 500);
  }

  emptyCart() {
    this.disabledItems.forEach(ele => {
      this.items.push(ele)
    })
    this.disabledItems = []
    this.fb.updateSortOrder(this.id, this.location, this.isLocked, this.items, this.disabledItems, this.isDefault)
    setTimeout(() => {
      this.goToTop()
    }, 500);
  }

  emptyTrash() {
    if (confirm("This will permanently remove these items.  Continue?")) {
      this.disabledItems = []
      this.fb.updateSortOrder(this.id, this.location, this.isLocked, this.items, this.disabledItems, this.isDefault)
      setTimeout(() => {
        this.goToTop()
      }, 500);
    }
  }

  toggleLock() {
    this.fb.updateSortOrder(this.id, this.location, !this.isLocked, this.items, this.disabledItems, this.isDefault)
  }

  goToTop() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#top')
    this.pageScrollService.start(pageScrollInstance)
  }
}
