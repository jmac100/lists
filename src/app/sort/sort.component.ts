import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "../services";

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.sass']
})
export class SortComponent implements OnInit {

  id: string
  items: any[] = []
  disabledItems: any[] = []
  location: string
  isLocked: boolean
  isDefault: boolean
  options: any

  constructor(private route: ActivatedRoute, private fb: FirebaseService) { 
    this.options = {
      onUpdate: (event: any) => {
        this.fb.updateSortOrder(this.id, this.location, this.isLocked, this.items, this.disabledItems, this.isDefault)
      }
    }
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

}
