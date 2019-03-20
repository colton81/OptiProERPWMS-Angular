import { Component, OnInit } from '@angular/core';
import { InboundMasterComponent } from 'src/app/inbound/inbound-master.component';
import { Router } from '../../../../node_modules/@angular/router';
import { InboundService } from 'src/app/services/inbound.service';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { TranslateService, LangChangeEvent } from '../../../../node_modules/@ngx-translate/core';
import { UOM } from 'src/app/models/Inbound/UOM';
import { OpenPOLinesModel } from 'src/app/models/Inbound/OpenPOLinesModel';
import { RecvingQuantityBin } from 'src/app/models/Inbound/RecvingQuantityBin';

@Component({
  selector: 'app-inbound-grpo',
  templateUrl: './inbound-grpo.component.html',
  styleUrls: ['./inbound-grpo.component.scss']
})
export class InboundGRPOComponent implements OnInit {

  openPOLineModel: OpenPOLinesModel[] = [];
  Ponumber: any;
  RecvbBinvalue: any="";
  uomSelectedVal: UOM;
  UOMList: UOM[];
  qty: number;
  showButton: boolean = false;
  recvingQuantityBinArray: RecvingQuantityBin[] = [];
  defaultRecvBin: boolean = false;
  serviceData: any[];
  lookupfor: string;
  showLookupLoader = true;


  constructor(private inboundService: InboundService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private inboundMasterComponent: InboundMasterComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.openPOLineModel[0] = this.inboundMasterComponent.openPOmodel;
    this.Ponumber = this.openPOLineModel[0].DOCENTRY;
    this.getUOMList();
    if (this.RecvbBinvalue == "") {
      this.defaultRecvBin = true;
      this.ShowBins();
    }
  }

  /**
    * Method to get list of inquries from server.
   */
  public ShowBins() {
    this.inboundService.getRevBins(this.openPOLineModel[0].QCREQUIRED).subscribe(
      (data: any) => {
        console.log(data);
        if (data != null) {
          if (this.defaultRecvBin == true) {
            this.RecvbBinvalue = data[0].BINNO;
            this.defaultRecvBin = false
          }
          else {
            if (data.length > 0) {
              console.log(data);
              this.showLookupLoader = false;
              this.serviceData = data;
              this.lookupfor = "RecvBinList";
              return;
            }
            else {
              this.toastr.error('', this.translate.instant("NoBinsAvailableMsg"));
            }
          }
        }
      },
      error => {
        console.log("Error: ", error);
      }
    );
  }


  OnBinChange() {
    if (this.RecvbBinvalue == "") {
      return;
    }
    this.inboundService.binChange(this.openPOLineModel[0].QCREQUIRED).subscribe(
      (data: any) => {
        console.log(data);
        if (data != null) {
          if (data.length > 0) {
            if (data[0].Result == "0") {
              this.toastr.error('', this.translate.instant("INVALIDBIN"));
              this.RecvbBinvalue = "";
              return;
            }
            else {
              this.RecvbBinvalue = data[0].ID;
              // oCurrentController.isReCeivingBinExist();
            }
          }
        }
        else {
          this.toastr.error('', this.translate.instant("INVALIDBIN"));
          this.RecvbBinvalue = "";
          return;
        }
      },
      error => {
        console.log("Error: ", error);
        this.RecvbBinvalue = "";
      }
    );
  }

  /**
   * Method to get list of inquries from server.
  */
  public getUOMList() {
    this.inboundService.getUOMs(this.openPOLineModel[0].ITEMCODE).subscribe(
      (data: any) => {
        console.log(data);

        this.openPOLineModel[0].UOMList = data;
        if (this.openPOLineModel[0].UOMList.length > 0) {
          this.uomSelectedVal = this.openPOLineModel[0].UOMList[0];
        }
      },
      error => {
        console.log("Error: ", error);
      }
    );
  }



  addQuantity() {
    if (this.qty == 0 || this.qty == undefined) {
      this.toastr.error('', this.translate.instant("EnterQuantityErrMsg"));
      return;
    }

    if (this.RecvbBinvalue == "" || this.RecvbBinvalue == undefined) {
      this.toastr.error('', this.translate.instant("INVALIDBIN"));
      return;
    }

    let result = this.recvingQuantityBinArray.find(element => element.Bin == this.RecvbBinvalue);
    if (result == undefined) {
      this.recvingQuantityBinArray.push(new RecvingQuantityBin(this.qty, this.RecvbBinvalue));
      this.showButton = true;
      this.qty = undefined;
    } else {
      this.toastr.error('', this.translate.instant("BinValidation"));
      return;
    }
  }

  save() {
    var oSubmitPOLotsObj: any = this.prepareSubmitPurchaseOrder();
    this.inboundMasterComponent.savePOLots(oSubmitPOLotsObj);
    this.inboundMasterComponent.inboundComponent = 2;
  }

  receive(e) {
    alert("Do you want to print all labels after submit ?");
    var oSubmitPOLotsObj = this.prepareSubmitPurchaseOrder();
    this.SubmitGoodsReceiptPO(oSubmitPOLotsObj);
  }

  prepareSubmitPurchaseOrder(): any {
    var oSubmitPOLotsObj: any = {};
    oSubmitPOLotsObj.POReceiptLots = [];
    oSubmitPOLotsObj.POReceiptLotDetails = [];
    oSubmitPOLotsObj.UDF = [];
    oSubmitPOLotsObj.LastSerialNumber = [];

    oSubmitPOLotsObj.POReceiptLots.push({
      DiServerToken: localStorage.getItem("Token"),
      PONumber: this.Ponumber,
      CompanyDBId: localStorage.getItem("CompID"),
      LineNo: this.openPOLineModel[0].LINENUM,
      ShipQty: this.openPOLineModel[0].RPTQTY.toString(),
      OpenQty: this.openPOLineModel[0].OPENQTY,
      WhsCode: localStorage.getItem("whseId"),
      Tracking: this.openPOLineModel[0].TRACKING,
      ItemCode: this.openPOLineModel[0].ITEMCODE,
      LastSerialNumber: 0,
      Line: 0,
      UOM: -1,// this.openPOLineModel[0].UOM,
      GUID: localStorage.getItem("GUID"),
      UsernameForLic: localStorage.getItem("UserId")
      //------end Of parameter For License----
    });

    oSubmitPOLotsObj.UDF.push({
      Key: "OPTM_TARGETWHS",//UDF[iIndex].Key,
      Value: "",//this.getView().byId("txtQCWhse").getValue(),//UDF[iIndex].Value,
      //LotNo: UDF[iIndex].LotNo,
      Flag: 'D', // D = Line, H= Header, L = Lots
      LineNo: 0
    });
    oSubmitPOLotsObj.UDF.push({
      Key: "OPTM_TARGETBIN",//UDF[iIndex].Key,
      Value: "",//this.getView().byId("txtQCBin").getValue(),
      //LotNo: UDF[iIndex].LotNo,
      Flag: 'D', // D = Line, H= Header, L = Lots
      LineNo: 0
    });


    for (var iBtchIndex = 0; iBtchIndex < this.recvingQuantityBinArray.length; iBtchIndex++) {
      oSubmitPOLotsObj.POReceiptLotDetails.push({
        Bin: this.recvingQuantityBinArray[iBtchIndex].Bin,
        LineNo: this.openPOLineModel[0].LINENUM,
        LotNumber: "", //getUpperTableData.GoodsReceiptLineRow[iBtchIndex].SysSerNo,
        LotQty: this.recvingQuantityBinArray[iBtchIndex].Quantity.toString(),
        SysSerial: "0",
        ExpireDate: "",//oCurrentController.GetSubmitDateFormat(getUpperTableData.GoodsReceiptLineRow[iBtchIndex].EXPDATE), // oCurrentController.GetSubmitDateFormat(oActualGRPOModel.PoDetails[iIndex].ExpireDate),//oActualGRPOModel.PoDetails[iIndex].ExpireDate,
        VendorLot: "",//getUpperTableData.GoodsReceiptLineRow[iBtchIndex].MfgSerNo,
        //NoOfLabels: oActualGRPOModel.PoDetails[iIndex].NoOfLabels,
        //Containers: piContainers,
        SuppSerial: "",//getUpperTableData.GoodsReceiptLineRow[iBtchIndex].MfgSerNo,
        ParentLineNo: 0
        //InvType: oActualGRPOModel.GoodsReceiptLineRow[iIndex].LotStatus,
      });
    }

    // for (var iLastIndexNumber = 0; iLastIndexNumber < olastSerialNumber.LastSerialNumber.length; iLastIndexNumber++) {
    oSubmitPOLotsObj.LastSerialNumber.push({
      // LastSerialNumber: olastSerialNumber.LastSerialNumber[iLastIndexNumber],
      // LineId: olastSerialNumber.LineId[iLastIndexNumber],
      // ItemCode: oActualGRPOModel.POLinesList[0].ItemCode
    });
    // }
    // this.SubmitGoodsReceiptPO(oSubmitPOLotsObj);
    return oSubmitPOLotsObj;
  }

  SubmitGoodsReceiptPO(oSubmitPOLotsObj: any){
    this.inboundService.SubmitGoodsReceiptPO(oSubmitPOLotsObj).subscribe(
      (data: any) => {
        console.log(data);
        debugger
        if (data[0].ErrorMsg == "" && data[0].Successmsg == "SUCCESSFULLY") {
          // alert("Goods Receipt PO generated successfully with Doc No: " + data.DocEntry);
          this.toastr.success('', this.translate.instant("GRPOSuccessMessage" + data.DocEntry));
          this.inboundMasterComponent.inboundComponent = 2;
        } else if (data[0].ErrorMsg == "7001") {
          this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
            this.translate.instant("CommonSessionExpireMsg"));
          return;
        }
        else {
          // alert(data[0].ErrorMsg);
          this.toastr.success('', data[0].ErrorMsg);
        }
      },
      error => {
        console.log("Error: ", error);
        // alert("fail");
      }
    );
  }

  cancel() {
    this.inboundMasterComponent.inboundComponent = 2;
  }

}
