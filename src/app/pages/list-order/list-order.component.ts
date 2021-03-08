import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { ConfigService, ITableCol } from 'src/app/services/config.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {

  orderProperties: { count: number } = { count: 0, };
  cols: ITableCol[] = this.configService.tableColsOrderList;

  // Pagination
  firstItem: number = 0;
  lastItem: number = 0;
  pages: number = 0;
  itemsPerPage:  number = 10;
  currentPage: number = 1;

  // Filter
  filterPhrase: string = '';
  filterKey: string = 'status';
  filterKeys: string[] = Object.keys(new Order());
  sorterDirection: number = 1;
  selectedItemToDelete: Order = new Order();
  sortby: string = '';
  colspan: number = this.cols.length + 1;
  statOrdersSubscription: Subscription = new Subscription();
  statOrderText: string = '';
  
  waiting = true;

  // Order Data Card
  orderData = {
    Id: 0,
    Customer: '',
    Product: '',
    Amount: 0,
    Status: ''
  }

  orderList$: Observable<Order[]> = this.orderService.orderList$.pipe(
    tap( orders => {
      this.orderProperties.count = orders.length;
      this.firstItem =  (this.currentPage - 1) * this.itemsPerPage;
      this.lastItem =  this.firstItem + this.itemsPerPage;
      this.pages = Math.ceil(this.orderProperties.count / this.itemsPerPage);
    }),
  );

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    let time = 500;
    this.orderService.getAll();
    this.orderList$.subscribe(
      () => setTimeout(() => { this.waiting = false }, time)
    );
    this.statOrdersSubscription = this.orderService.orderStats$ .subscribe(
      data => {
        this.statOrderText = `<span class="text-info">Total ${data.totalOrderNr} orders; </span>
        <span class="text-success">${data.paidOrderNr} paid orders worth ${data.paidOrderAmount} EUR; </span>
        <span class="text-danger">${data.shippedOrderNr} shipped, unpaid orders worth ${data.shippedOrderAmount} EUR; </span>
        <span class="text-warning">there are ${data.newOrderNr} new orders worth ${data.newOrderAmount} EUR</span>`;
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

  setToDelete(order: Order): void {
    this.selectedItemToDelete = order;
  }

  deleteItem(): void {
    const deletedId: number = this.selectedItemToDelete.id;
    this.orderService.remove(this.selectedItemToDelete).subscribe(
      () => {
        this.orderService.getAll();
        this.configService.showSuccess('Deleted successfuly.', `Order #${deletedId}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.statOrdersSubscription.unsubscribe();
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

  showDatas(item: Order): void {
    this.orderData.Id = item.id;
    this.orderData.Status = item.status;
    this.orderData.Amount = item.amount;
    this.customerService.getOneById(item.customerID).subscribe( item => this.orderData.Customer = item.lastName+' '+item.firstName );
    this.productService.getOneById(item.productID).subscribe( item => this.orderData.Product = item.type+' '+item.name );
  }

}