import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {

  order$: Observable<Order> = this.activatedRoute.params.pipe(
    switchMap(params => this.orderService.get(params.id))
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onUpdate(order: Order): void {
    if (order.id === 0) {
      this.orderService.create(order);
      this.orderService.showSuccess('created successfuly.', 'New order');
      this.router.navigate(['orders']);
    } else {
      this.orderService.update(order);
      this.orderService.showSuccess('updated successfuly.', `Order #${ order.id}`);
      this.router.navigate(['orders']);
    }
  }

}
