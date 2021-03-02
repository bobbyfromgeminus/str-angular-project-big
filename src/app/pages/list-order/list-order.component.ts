import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from 'src/app/models/order';
import { ConfigService, ITableCol } from 'src/app/services/config.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {

  orderList$: BehaviorSubject<Order[]> = this.orderService.orderList$;
  
  cols: ITableCol[] = this.configService.tableColsOrderList;

  filterPhrase: string = '';
  filterKey: string = 'status';
  filterKeys: string[] = Object.keys(new Order());
  sorterDirection: number = 1;
  sortby: string = '';

  constructor(
    private orderService: OrderService,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.orderService.getAll();
  }

  changeOrder(param: string): void {
    if (this.sorterDirection === 1)  this.sorterDirection = 2;
    else this.sorterDirection = 1;
    this.sortby = param;
    let allArrow = document.querySelectorAll('.arrow');
    allArrow.forEach( element => {
      element.classList.remove('arrow__active');
    });
    let allTHead = document.querySelectorAll('.th');
    allTHead.forEach( element => {
      element.classList.remove('th__active');
    });
    document.querySelector('#thead_'+param)?.classList.add('th__active');
    if (this.sorterDirection == 1) document.querySelector('#arrow_up_'+param)?.classList.add('arrow__active');
    else document.querySelector('#arrow_down_'+param)?.classList.add('arrow__active');
  }

  originalOrder = (a:any, b:any): number => {
    return 0;
  }

  deleteItem(item: Order): void {
    this.orderService.remove(item);
  }

}
