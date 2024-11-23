import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_service/auth.inteceptor';
import { TimeoutInterceptor } from './_service/timeout.interceptor';

export const GLOBAL_HTTP_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
