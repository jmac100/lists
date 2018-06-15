import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from "../services";

@Component({
  selector: 'auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.sass']
})
export class AutoCompleteComponent implements OnInit {

  items: any[] = []
  masterListId: string;
  uploadOpen: boolean = false
  uploadItems: string
  @Input() data: string
  @Input() dropDownSource: any[]
  @Output() onCallBack = new EventEmitter<any>()
  @Output() onBlur = new EventEmitter<any>()
  @Output() onAddButtonClicked = new EventEmitter<any>()
  @Output() onEnterPressed = new EventEmitter<any>()

  constructor(private fb: FirebaseService) { }

  ngOnInit() {
    this.fb.getMasterList().subscribe(items => {
      this.items = []
      this.masterListId = items[0].id
      items[0].items.forEach(item => {
        this.items.push(item)
      })
    })
  }

  updateMasterWithMultipleValues(vals) {
    let items: Array<string> = vals.split('\n').filter(ele => ele.length > 0)
    items.forEach(ele => this.updateMaster(ele))
  }

  updateMaster(e) {
    if (this.items.indexOf(e) === -1 && e.length > 0) {
      this.items.push(e)
      this.fb.updateMaster(this.masterListId, this.items)
    }
  }

  callBack(val) {
    if (!val) return
    this.onCallBack.emit(val)
  }

  addButtonClicked(single, multiple) {
    if (this.uploadOpen) {
      this.onAddButtonClicked.emit(multiple)
      this.updateMasterWithMultipleValues(multiple.value)
    } else {
      this.onAddButtonClicked.emit(single)
      this.updateMaster(single.value)
    }
  }

  enterPressed(e) {
    this.onEnterPressed.emit(e)
    this.updateMaster(e.value)
  }

  clear() {
    this.data = ''
  }

  clearUpload() {
    this.uploadItems = ''
  }

  toggleUpload() {
    this.uploadOpen = !this.uploadOpen
  }
}
