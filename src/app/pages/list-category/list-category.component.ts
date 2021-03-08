import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { ConfigService, ITableCol } from 'src/app/services/config.service';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {

  billProperties: { count: number } = { count: 0, };
  cols: ITableCol[] = this.configService.tableColsCategoryList;

  // Pagination
  firstItem: number = 0;
  lastItem: number = 0;
  pages: number = 0;
  itemsPerPage:  number = 10;
  currentPage: number = 1;

  // Filter
  filterPhrase: string = '';
  filterKey: string = 'name';
  filterKeys: string[] = Object.keys(new Category());

  // Sorter
  sortby: string = '';
  sorterDirection: number = 1;
  selectedItemToDelete: Category = new Category();

  // Data Row
  colspan: number = this.cols.length + 1;
  statCategoriesSubscription: Subscription = new Subscription();
  statCategoryText: string = '';

  // Category Data Card
  categoryData = {
    Id: 0,
    Name: '',
    Description: ''
  }

  waiting = true;

  categoryList$: Observable<Category[]> = this.categoryService.categoryList$.pipe(
    tap( billList => {
      this.billProperties.count = billList.length;
      this.firstItem =  (this.currentPage - 1) * this.itemsPerPage;
      this.lastItem =  this.firstItem + this.itemsPerPage;
      this.pages = Math.ceil(this.billProperties.count / this.itemsPerPage);
    }),
  );

  constructor(
    private categoryService: CategoryService,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    let time = 500;
    this.categoryService.getAll();
    this.categoryList$.subscribe(
      () => setTimeout(() => { this.waiting = false }, time)
    )
    this.statCategoriesSubscription = this.categoryService.categoryStats$.subscribe(
      data => {
        this.statCategoryText = `<span class="text-info">Total ${data.categoryNr} categories. </span>`;
      }
    )
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

  setToDelete(order: Category): void {
    this.selectedItemToDelete = order;
  }

  deleteItem(): void {
    const deletedId: number = this.selectedItemToDelete.id;
    this.categoryService.remove(this.selectedItemToDelete).subscribe(
      () => {
        this.categoryService.getAll();
        this.configService.showSuccess('Deleted successfuly.', `Category #${deletedId}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.statCategoriesSubscription.unsubscribe();
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

  showDatas(item: Category): void {
    this.categoryData.Id = item.id;
    this.categoryData.Name = item.name;
    this.categoryData.Description = item.description;
  }

}