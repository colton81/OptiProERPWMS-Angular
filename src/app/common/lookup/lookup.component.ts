import { Component, OnInit, setTestabilityGetter, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
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
import { GridComponent } from '@progress/kendo-angular-grid';
import { UIHelper } from 'src/app/helpers/ui.helpers';
import { State } from '@progress/kendo-data-query';
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
  @Output() lookupkey = new EventEmitter();
  @Input() ruleselected: any;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  public table_head: ColumnSetting[] = [];
  dialogOpened: boolean = true;
  lookupTitle: string;
  pagable:boolean=false;
  pagesize:number=50;
  isMobile: boolean;
  isColumnFilter: boolean = false;
  isColumnGroup: boolean = false;
  gridHeight: number;
  showLoader: boolean = false;
  grid: any;



  constructor(private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  close_kendo_dialog() {
    this.dialogOpened = false;
  }

  ngOnInit() {
  }

  async ngOnChanges(): Promise<void> {
    if (this.lookupfor == "toWhsList") {
      this.showToWhsList();
    } else if (this.lookupfor == "ItemCodeList") {
      this.showItemCodeList();
    } else if (this.lookupfor == "BatchNoList") {
      this.showBatchNoList();
    } else if (this.lookupfor == "NTrackFromBin") {
      this.showNTrackFromBinList();
    } else if (this.lookupfor == "SBTrackFromBin") {
      this.showSBTrackFromBinList();
    } else if (this.lookupfor == "toBinsList") {
      this.showSBTrackFromBinList();
    }

    else if (this.lookupfor == "out-customer") {
      this.showCustomerList();
    }
    else if (this.lookupfor == "out-items") {
      this.showAvaliableItems();
    }

    else if (this.lookupfor == 'out-order') {
      this.showOutSOList();
    }
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
    this.lookupTitle = this.translate.instant("WarehouseList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showAvaliableItems() {
    this.pagable=true;
    this.pagesize=50;
    this.table_head = [
      {
        field: 'LOTNO',
        title: 'Serial',
        type: 'text',
        width: '100'
      },
    
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'TOTALQTY',
        title: this.translate.instant("AvailableQty"),
        type: 'numeric',
        width: '100'
      },
    ];
    this.lookupTitle = this.translate.instant("AvaliableMeterial");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }


  showItemCodeList() {
    this.table_head = [
      {
        field: 'ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'ITEMNAME',
        title: this.translate.instant("ItemName"),
        type: 'text',
        width: '100'
      },
    ];
    this.lookupTitle = this.translate.instant("ItemCodeList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showBatchNoList() {
    this.table_head = [
      {
        field: 'LOTNO',
        title: this.translate.instant("LotNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'TOTALQTY',
        title: this.translate.instant("TOTALQTY"),
        type: 'text',
        width: '100'
      },
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'ITEMNAME',
        title: this.translate.instant("ItemName"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("BinNoList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showNTrackFromBinList() {
    this.table_head = [
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'TOTALQTY',
        title: this.translate.instant("TOTALQTY"),
        type: 'text',
        width: '100'
      },
      {
        field: 'WHSCODE',
        title: this.translate.instant("WhseCode"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("BinNoList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showSBTrackFromBinList() {
    this.table_head = [
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'WHSCODE',
        title: this.translate.instant("WhseCode"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("BinNoList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showToBinsList() {
    this.table_head = [
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'WHSCODE',
        title: this.translate.instant("WhseCode"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("BinNoList");
  }

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

    this.lookupTitle = this.translate.instant("CustomerList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }



  showOutSOList() {


    this.table_head = [
      {
        field: 'DOCNUM',
        title: 'SO#',
        type: 'text',
        width: '100'
      },
      {
        field: 'DOCDUEDATE',
        title: 'Del. Date',
        type: 'date',
        width: '100'
      }

    ];

    this.lookupTitle = this.translate.instant("SalesOrderList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  on_item_select(selection) {
    const lookup_key = selection.selectedRows[0].dataItem;
    console.log("lookup_key - " + lookup_key);
    console.log(lookup_key);
    this.lookupkey.emit(lookup_key);
    this.lookupvalue.emit(Object.values(lookup_key));
    console.log(selection);
    selection.selectedRows = [];
    selection.index = 0;
    selection.selected = false;
    this.serviceData = [];
    this.dialogOpened = false;
  }

  onFilterChange(checkBox:any,grid:GridComponent)
    {
      if(checkBox.checked==false){
        this.clearFilter(grid);
      }
    }
  clearFilter(grid:GridComponent){      
    this.clearFilters()
  }

  public state: State = {
      skip: 0,
      take: 5,

      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
  };
  public clearFilters() {
    this.state.filter = {
      logic: 'and', 
      filters: []
    };
  }
}
