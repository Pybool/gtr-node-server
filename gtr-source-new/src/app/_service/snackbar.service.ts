import { Injectable, ApplicationRef, ComponentRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { SnackBarComponent } from '../raffledraw/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private snackBarRef: ComponentRef<SnackBarComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  show(message: string, isError:boolean = false, duration: number = 3000): void {
    if (!this.snackBarRef) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(SnackBarComponent);
      this.snackBarRef = factory.create(this.injector);
      this.appRef.attachView(this.snackBarRef.hostView);
      const domElem = (this.snackBarRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    }
    if(!isError){
      this.snackBarRef.instance.show(message, isError,  duration);
    }else{
      this.snackBarRef.instance.show(message, isError, duration);
    }
    
  }

  hide(): void {
    if (this.snackBarRef) {
      this.snackBarRef.instance.hide();
      this.appRef.detachView(this.snackBarRef.hostView);
      this.snackBarRef.destroy();
      this.snackBarRef = null;
    }
  }
}
