import { Component, OnInit, setTestabilityGetter, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
// import { CommonService } from '../../../services/common.service';
// import * as XLSX from 'ts-xlsx';
// import { FeaturemodelService } from '../../../services/featuremodel.service';
// import { ModelbomService } from '../../../services/modelbom.service';
// import { CommonData, ColumnSetting } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'bootstrap';
import { ColumnSetting } from 'src/app/models/CommonData';
import { OutboundData } from 'src/app/models/outbound/outbound-data';
import { TranslateService, LangChangeEvent } from '../../../../node_modules/@ngx-translate/core';
// import { UIHelper } from '../../../helpers/ui.helpers';
// import { Http, ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
  @ViewChild("lookupsearch") _el: ElementRef;
  // input and output emitters
  @Input() serviceData: any;
  @Input() lookupfor: any;
  @Input() fillLookupArray: any;
  @Input() selectedImage: any
  @Output() lookupvalue = new EventEmitter();
  @Input() ruleselected: any;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  public table_head: ColumnSetting[] = [];
  dialogOpened: boolean = true;

  constructor(private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  public close_kendo_dialog() {
    this.dialogOpened = false;
  }

  ngOnInit() {
  }

  async ngOnChanges(): Promise<void> {
    if (this.lookupfor == "toWhsList") {
      this.showToWhsList();
    }
<<<<<<< HEAD

    if (this.lookupfor == "out-customer") {
      this.showCustomerList();
    }

=======
>>>>>>> 5dc38d05d9a197b0d9095062b2c8a716de51f3ea
  }

  showToWhsList() {
    this.table_head = [
      {
        field: 'WHSCODE',
        title: this.translate.instant("WhseCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'WHSName',
        title: this.translate.instant("WhseName"),
        type: 'text',
        width: '100'
      },
    ];

    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }
<<<<<<< HEAD


  showCustomerList() {


    this.table_head = [
      {
        field: 'CUSTOMER CODE',
        title: 'CUSTOMER CODE',
        type: 'text',
        width: '100'
      },
      {
        field: 'CUSTOMER NAME',
        title: 'CUSTOMER NAME',
        type: 'text',
        width: '100'
      }

    ];



    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        // $("#lookup_modal").modal('show');
      }
    }

  }


  on_item_select(selectedValue: any) {
    if (this.lookupfor == "out-customer") {
      console.log("Selectde",selectedValue);
      let outbounddata = localStorage.getItem('outboundData')
      if(outbounddata==undefined){
        let outboundData:any=new OutboundData();
       // outboundData.CustomerData=selectedValue.SelectedItem[0];  
        localStorage.setItem("outboundData",outboundData);

      }



    }
    this.close_kendo_dialog();
=======
  
  
  on_item_select(selection) {
    const lookup_key = selection.selectedRows[0].dataItem;
    console.log("lookup_key - " + lookup_key);
    console.log(lookup_key);
    this.lookupvalue.emit(Object.values(lookup_key));
    console.log(selection);
    selection.selectedRows = [];
    selection.index = 0;
    selection.selected = false;
    this.serviceData = [];
    this.dialogOpened = false;
>>>>>>> 5dc38d05d9a197b0d9095062b2c8a716de51f3ea
  }
}
