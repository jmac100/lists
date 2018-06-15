import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseService } from "../services";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {

  id: string
  items: any[] = []
  masterItems: any[] = []
  disabledItems: any[] = []
  selectedItems: any[] = []
  location: string
  isLocked: boolean
  isDefault: boolean
  options: any
  data: string = ""
  masterListId: string

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private fb: FirebaseService, 
    private render: Renderer) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id']
    this.getItems()
    this.getMasterList()
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

  getMasterList() {
    this.fb.getMasterList().subscribe(items => {
      this.masterItems = []
      this.masterListId = items[0].id
      items[0].items.forEach(item => {
        this.masterItems.push(item)
      })
      this.masterItems.sort()
    })
  }

  toggleSelected(event: any) {
    if (!event.target.classList.contains('list-item')) return
    event.target.classList.toggle('master-item-selected')
    const isSelected = event.target.classList.contains('master-item-selected')

    const item = event.target.firstElementChild.textContent

    if (isSelected) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(element => element !== item)
    }
  }

  addToList() {
    this.items = this.items.concat(this.selectedItems.filter(element => {
      return this.items.indexOf(element) < 0
    }))
    this.disabledItems = this.disabledItems.filter(element => {
      return this.selectedItems.indexOf(element) < 0
    })
    this.fb.addItem(this.id, this.location, this.isLocked, this.items, this.disabledItems, this.isDefault)
    this.router.navigate(['/lists', this.id])
  }
}