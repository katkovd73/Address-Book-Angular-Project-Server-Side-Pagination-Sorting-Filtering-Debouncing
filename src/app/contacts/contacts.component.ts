import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ContactsService } from '../services/contacts.service';
import { Contact } from '../interfaces/contact';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../dialogs/update-dialog/update-dialog.component';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements AfterViewInit {

  totalRecordCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  sortOrder: string = "asc";
  sortColumn: string = "firstName";
  filterValue: string = "";

  debounce: any;

  contactsDataArray: any = [];

  dataSource = new MatTableDataSource<Contact>();

  columnsToDisplay = ['firstName', 'lastName', 'phoneNumber', 'address', 'Update', 'Delete'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private contactsService: ContactsService, private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.initialLoad();
  }

  initialLoad() {
    this.contactsService.getContactsByPage(this.pageIndex, this.pageSize, this.sortColumn, this.sortOrder, this.filterValue)
      .subscribe({
        next: (data) => {
          this.contactsDataArray = data.pageContacts;
          this.dataSource = new MatTableDataSource<Contact>(this.contactsDataArray);
          this.totalRecordCount = data.contactsTotalCount;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.dataSource.paginator = this.paginator;
          console.log('Initial data loaded successfully');
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getContactsByPage();
  }

  getContactsByPage() {
    this.contactsService.getContactsByPage(this.pageIndex, this.pageSize, this.sortColumn, this.sortOrder, this.filterValue)
      .subscribe({
        next: (data) => {
          this.contactsDataArray = data.pageContacts;
          this.dataSource = new MatTableDataSource<Contact>(this.contactsDataArray);
          this.totalRecordCount = data.contactsTotalCount;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('Page data loaded successfully');
        }
      });
  }

  onSortChange(event: Sort) {
    console.log(event);
    this.sortColumn = event.active;
    this.sortOrder = event.direction.toString();
    this.pageIndex = 0;
    this.getContactsByPage();
  }

  onUpdate(contact: Contact) {
    let dialogRef = this.dialog.open(UpdateDialogComponent, {
      height: '500px',
      width: '500px',
      data: contact,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateDataSource();
    });
  }

  onDelete(contact: Contact) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '500px',
      width: '500px',
      data: contact,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateDataSource();
    });
  }

  updateDataSource() {
    this.contactsService.getContacts().subscribe({
      next: (data) => {
        console.log(data);
        this.contactsDataArray = data;
        this.dataSource = new MatTableDataSource<Contact>(this.contactsDataArray);
        console.log(this.dataSource);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.firstName.toLowerCase().includes(filter) || data.lastName.toLowerCase().includes(filter);
        };
        console.log('Data loaded successfully');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.previousFilterValue = filterValue;
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.filterValue = filterValue;
      this.pageIndex = 0;
      this.getContactsByPage();
    }, 1000);
  }

}
