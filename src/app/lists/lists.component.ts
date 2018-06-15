import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services";
import { Router } from "@angular/router";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.sass']
})
export class ListsComponent implements OnInit {

  locations: any[] = []
  newLocation: string

  constructor(private fb: FirebaseService, private router: Router) { }

  ngOnInit() {
    this.fb.getLists().subscribe(items => {
      this.locations = []
      items.forEach(item => {
        this.locations.push({ id: item.id, name: item.location, isDefault: item.isDefault })
      })
      if (localStorage.getItem('redirect')){
        const defaultListId = this.locations.filter(list => list.isDefault)[0].id;
        localStorage.removeItem('redirect');
        this.router.navigate([`lists/${defaultListId}`]);
      }
    })
  }

  addList() {
    if (this.newLocation.length === 0) return
    
    let item = {
      disabledItems: [],
      items: [],
      isLocked: false,
      location: this.newLocation,
      isDefault: false
    }
    this.fb.addList(item)
    this.newLocation = ''
  }

  removeList(id) {
    if (confirm('This will permanently remove the list and all of its items.  Continue?')) {
      this.fb.removeList(id) 
    }
  }
}
