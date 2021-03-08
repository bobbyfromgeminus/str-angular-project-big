import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Customer } from 'src/app/models/customer';
import { Router } from '@angular/router';
import { ConfigService, ITableCol } from 'src/app/services/config.service';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})
export class ListCustomerComponent implements OnInit {

  cols: ITableCol[] = this.configService.tableColsCustomerList;
  
  // Pagination
  pages: number = 0;
  lastItem: number = 0;
  firstItem: number = 0;
  currentPage: number = 1;
  itemsPerPage:  number = 10;
  customerProperties: { count: number } = { count: 0, };

  // Filter
  filterPhrase: string = '';
  filterKey: string = 'firstName';
  filterKeys: string[] = Object.keys(new Customer());
  
  // Sorter
  sortby: string = '';
  sorterDirection: number = 1;
  selectedItemToDelete: Customer = new Customer();
  
  // Data Row
  statCustomerText: string = '';
  colspan: number = this.cols.length + 1;
  statCustomerSubscription: Subscription = new Subscription();

  // Customer Data Card
  customerData = {
    Id: 0,
    Name: '',
    Email: '',
    Country: '',
    ZipCity: '',
    Address: '',
    Notes: '',
    Active: ''
  }

  waiting = true;

  customerList$: Observable<Customer[]> = this.customerService.customerList$.pipe(
    tap(customers => {
      this.customerProperties.count = customers.length;
      this.firstItem =  (this.currentPage - 1) * this.itemsPerPage;
      this.lastItem =  this.firstItem + this.itemsPerPage;
      this.pages = Math.ceil(this.customerProperties.count / this.itemsPerPage);
      customers.forEach(element => {
        // Address modification
        element.fullAddress = this.getAddress(element);
      })
    })
  );

  constructor(
    private customerService: CustomerService,
    private configService: ConfigService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    let time = 500;
    this.customerService.getAll();
    this.customerList$.subscribe(
      () => setTimeout(() => { this.waiting = false }, time)
    );
    this.statCustomerSubscription = this.customerService.customerStats$.subscribe(
      data => {
        this.statCustomerText = `<span class="text-info">Total ${data.customerNr} customers; </span>
        <span class="text-success">${data.activeCustomerNr} customers are active; </span>
        <span class="text-danger">${data.inactiveCustomerNr} customers are inactive</span>`;
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

  getAddress(item: Customer): string {
    return `${item.address.zip} ${item.address.country} ${item.address.city} ${item.address.street}\n${item.address.notes}`;
  }

  setToDelete(item: Customer): void {
    this.selectedItemToDelete = item;
  }

  deleteItem(): void {
    const deletedId: number = this.selectedItemToDelete.id;
    this.customerService.remove(this.selectedItemToDelete).subscribe(
      () => {
        this.customerService.getAll()
        this.configService.showSuccess('Deleted successfuly.', `Customer #${deletedId}`);
      }
    );
  }
  
  ngOnDestroy(): void {
    this.statCustomerSubscription.unsubscribe();
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

  showDatas(item: Customer): void {
    this.customerData.Id = item.id;
    this.customerData.Name = `${item.firstName} ${item.lastName}`;
    this.customerData.Email = item.email;
    this.customerData.Country = item.address.country;
    this.customerData.ZipCity = `${item.address.zip} ${item.address.city}`;
    this.customerData.Address = item.address.street;
    this.customerData.Notes = item.address.notes;
    if (item.active) this.customerData.Active = 'check_circle';
    else this.customerData.Active = 'unpublished';
  }

}