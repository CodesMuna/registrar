import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // debugger
  
  const token = window.localStorage.getItem('token');

  const cloneReq =req.clone({
    setHeaders: {
      Authorization : `Bearer ${token}`
    }
  })

  return next(cloneReq);
};
