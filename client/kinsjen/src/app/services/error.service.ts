import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  getError(err: any): string {
    if (err == null && typeof err == undefined) {
      return '';
    }
    if ('message' in err) {
      if ('name' in err) {
        return err.name + ': ' + err.message;
      }
      return err.message;
    }
    return JSON.stringify(err);
  }

}
