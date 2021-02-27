import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {

  orderList$: BehaviorSubject<Order[]> = this.orderService.list$;
  selectedOrderToDelete: Order = new Order();

  phrase: string = '';

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.orderService.getAll();
  }

  onChangePhrase(event: Event): void {
    this.phrase = (event.target as HTMLInputElement).value;
  }

  setToDelete(order: Order): void {
    this.selectedOrderToDelete = order;
  }

  onDelete(): void {
      const deletedId: string = `${this.selectedOrderToDelete.id}`;
      this.orderService.remove(this.selectedOrderToDelete);
      this.orderService.showSuccess('deleted successfuly.', `Order #${deletedId}`);
    }
}
