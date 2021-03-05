import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';
import { ConfigService, ITableCol } from 'src/app/services/config.service';
import { ProductService } from 'src/app/services/product.service'
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

  cols: ITableCol[] = this.configService.tableColsProductList;
  
  // Pagination
  pages: number = 0;
  lastItem: number = 0;
  firstItem: number = 0;
  currentPage: number = 1;
  itemsPerPage:  number = 10;
  productProperties: { count: number } = { count: 0, };

  // Filter
  filterPhrase: string = '';
  filterKey: string = 'name';
  filterKeys: string[] = Object.keys(new Product());

  // Sorter
  sortby: string = '';
  sorterDirection: number = 1;
  selectedItemToDelete: Product = new Product();
  
  // Data Row
  statProductsText: string = '';
  colspan: number = this.cols.length + 1;
  statProductscription: Subscription = new Subscription();

  // Product Data Card
  productData = {
    Id: 0,
    Name: '',
    Type: '',
    Category: '',
    Description: '',
    Price: 0,
    Featured: '',
    Active: ''
  }
  
  waiting = true;

  productList$: Observable<Product[]> = this.productService.productList$.pipe(
    tap( productList => {
      this.productProperties.count = productList.length;
      this.firstItem =  (this.currentPage - 1) * this.itemsPerPage;
      this.lastItem =  this.firstItem + this.itemsPerPage;
      this.pages = Math.ceil(this.productProperties.count / this.itemsPerPage);
    }),
  );

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.productService.getAll();
    let time = (Math.floor(Math.random() * 4) + 1) * 1000;
    this.productList$.subscribe(
      () => setTimeout(() => { this.waiting = false }, time)
    );
    this.statProductscription = this.productService.productStats$.subscribe(
      data => {
        this.statProductsText = `<span class="text-info">Selling total ${data.totalNr} products; </span>
        <span class="text-success">${data.activeNr} products are active; </span>
        <span class="text-warning">there are ${data.featuredNr} featured products`;
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

  setToDelete(order: Product): void {
    this.selectedItemToDelete = order;
  }

  deleteItem(): void {
    const deletedId: number = this.selectedItemToDelete.id;
    this.productService.remove(this.selectedItemToDelete).subscribe(
      () => {
        this.productService.getAll();
        this.configService.showSuccess('Deleted successfuly.', `Product #${deletedId}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.statProductscription.unsubscribe();
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

  showDatas(item: Product): void {
    this.productData.Id = item.id;
    this.productData.Name = item.name;
    this.productData.Type = item.type;
    this.productData.Description = item.description;
    this.productData.Price = item.price;
    if (item.featured) this.productData.Featured = 'check_circle';
    else this.productData.Featured = 'unpublished';
    if (item.active) this.productData.Active = 'check_circle';
    else this.productData.Active = 'unpublished';
    this.categoryService.getOneById(item.id).subscribe( item => this.productData.Category = item.name );
  }

}