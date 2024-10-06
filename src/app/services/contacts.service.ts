import { Injectable } from '@angular/core';
import { Contact } from '../interfaces/contact';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageContacts } from '../interfaces/pageContacts';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) { }

  getContacts() {
    return this.http.get<Contact>('https://localhost:7271/Contacts/AllContacts');
  }

  getContactsByPage(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterValue: string) {
    return this.http.get<PageContacts>('https://localhost:7271/Contacts/ContactsByPage', {
      params: new HttpParams()
        .set('pageIndex', pageIndex)
        .set('pageSize', pageSize)
        .set('sortColumn', sortColumn)
        .set('sortOrder', sortOrder)
        .set('filterValue', filterValue)
    });
  }

  createContact(newContact: Contact) {
    return this.http.post<Contact>('https://localhost:7271/Contacts/CreateContact', newContact);
  }

  updateContact(updateContact: Contact) {
    return this.http.put<Contact>('https://localhost:7271/Contacts/UpdateContact', updateContact);
  }

  deleteContact(id: number) {
    let urlString: string = 'https://localhost:7271/Contacts/DeleteContact/' + id;
    return this.http.delete(urlString);
  }
}
