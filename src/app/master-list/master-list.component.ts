import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services";

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.sass']
})
export class MasterListComponent implements OnInit {

  items: any[] = []
  masterListId: string

  constructor(private fb: FirebaseService) { }

  ngOnInit() {
    this.fb.getMasterList().subscribe(items => {
      this.items = []
      this.masterListId = items[0].id
      items[0].items.forEach(item => {
        this.items.push(item)
      })
      this.items.sort()
    })
  }

  removeItem(item) {
    this.items = this.items.filter(element => element !== item)
    this.fb.updateMaster(this.masterListId, this.items)
  }
}
