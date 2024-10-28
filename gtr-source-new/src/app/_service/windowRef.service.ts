import {Inject, Injectable} from '@angular/core';
import { PLATFORM_ID } from "@angular/core";
function _window(): any {
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRef {
  [x: string]: any;
    constructor(@Inject(PLATFORM_ID) private platformId: any) { }   
  get nativeWindow(): any {

    return _window();
  }
}