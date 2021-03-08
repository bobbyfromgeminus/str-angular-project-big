import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Bill } from 'src/app/models/bill';
import { BillService } from 'src/app/services/bill.service';
import { ConfigService, ITableCol } from 'src/app/services/config.service';

@Component({
  selector: 'app-list-bill',
  templateUrl: './list-bill.component.html',
  styleUrls: ['./list-bill.component.scss']
})
export class ListBillComponent implements OnInit {

  billProperties: { count: number } = { count: 0, };
  cols: ITableCol[] = this.configService.tableColsBillList;

  // Pagination
  firstItem: number = 0;
  lastItem: number = 0;
  pages: number = 0;
  itemsPerPage:  number = 10;
  currentPage: number = 1;

  // Filter
  filterPhrase: string = '';
  filterKey: string = 'status';
  filterKeys: string[] = Object.keys(new Bill());

  // Sorter
  sortby: string = '';
  sorterDirection: number = 1;
  selectedItemToDelete: Bill = new Bill();
  
  // Data Row
  statBillText: string = '';
  colspan: number = this.cols.length + 1;
  statBillsSubscription: Subscription = new Subscription();

  // Bill Data Card
  billData = {
    Id: 0,
    OrderId: 0,
    Amount: 0,
    Status: ''
  }

  waiting = true;

  billList$: Observable<Bill[]> = this.billService.billList$.pipe(
    tap( billList => {
      this.billProperties.count = billList.length;
      this.firstItem =  (this.currentPage - 1) * this.itemsPerPage;
      this.lastItem =  this.firstItem + this.itemsPerPage;
      this.pages = Math.ceil(this.billProperties.count / this.itemsPerPage);
    }),
  );

  constructor(
    private billService: BillService,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    let time = 500;
    this.billService.getAll();
    this.billList$.subscribe(
      () => setTimeout(() => { this.waiting = false }, time)
    );
    this.statBillsSubscription = this.billService.billStats$.subscribe(
      data => {
        this.statBillText = `<span class="text-info">Total ${data.totalBillNr} bills; </span>
        <span class="text-success">${data.paidBillNr} paid bill worth ${data.paidAmount} EUR; </span>
        <span class="text-danger">${data.unPaidBillNr} unpaid bill worth ${data.unPaidAmount} EUR</span>`;
      }
    );
  }

  changeOrder(param: string): void {
    if (this.sortby === '' || this.sortby != param) {
      this.sorterDirection = 1;
    }
    if (this.sortby === param) {
      if (this.sorterDirection === 1) this.sorterDirection = 2;
      else this.sorterDirection = 1;
    }
    this.sortby = param;
    let allArrow = document.querySelectorAll('.arrow');
    allArrow.forEach(element => {
      element.classList.remove('arrow__active');
    });
    let allTHead = document.querySelectorAll('.th');
    allTHead.forEach(element => {
      element.classList.remove('th__active');
    });
    document.querySelector('#thead_' + param)?.classList.add('th__active');
    if (this.sorterDirection == 1) document.querySelector('#arrow_up_' + param)?.classList.add('arrow__active');
    else document.querySelector('#arrow_down_' + param)?.classList.add('arrow__active');
  }

  originalOrder = (a: any, b: any): number => {
    return 0;
  }

  setToDelete(order: Bill): void {
    this.selectedItemToDelete = order;
  }

  deleteItem(): void {
    const deletedId: number = this.selectedItemToDelete.id;
    this.billService.remove(this.selectedItemToDelete).subscribe(
      () => {
        this.billService.getAll();
        this.configService.showSuccess('Deleted successfuly.', `Bill #${deletedId}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.statBillsSubscription.unsubscribe();
  }

  // Beállítja az aktuális oldalszámot
  changePageNumber(page: number): void {
    this.currentPage = page;
    this.firstItem =  (this.currentPage - 1) * this.itemsPerPage;
    this.lastItem =  this.firstItem + this.itemsPerPage;
  }

  numSequence(n: number): Array<number> { 
    return Array(n); 
  }

  showDatas(item: Bill): void {
    this.billData.Id = item.id;
    this.billData.OrderId = item.orderID;
    this.billData.Amount = item.amount;
    this.billData.Status = item.status;
  }

}