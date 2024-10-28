import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchupPodcastInterface, customPodcastInterface } from '../_model/all.interface';


@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  public invokeFirstComponentFunction = new EventEmitter<catchupPodcastInterface>();    
  public subsVar: Subscription;    
    
  constructor() { }    
    
  playOrPause(parameter:catchupPodcastInterface) {  
    
    this.invokeFirstComponentFunction.emit(parameter);    
  } 
}

