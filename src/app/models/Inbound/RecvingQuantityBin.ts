export class RecvingQuantityBin{
    
    public VendorLot: string;
    public LotNumber: string;
    public LotQty: number;
    public Bin: string;
    public expiryDate: string;
    // public Bin: string;

    constructor(MfrSerial: string, serial: string, qty:number, bin: string, expiryDate: string){
        this.VendorLot = MfrSerial;
        this.LotNumber = serial;
        this.LotQty = qty;
        this.Bin = bin;
        this.expiryDate = expiryDate;
    }
}