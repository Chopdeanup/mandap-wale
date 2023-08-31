import { CanActivateFn, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';


export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router)
  let messageService = inject(MessageService)
  let getToken:any = localStorage.getItem('userToken')
  
  if(getToken){
    return true
  }
  else{
    messageService.add({
      severity: 'error',
      summary: 'Fail',
      detail: 'Please Login First',
    })
    // alert('Your not Authenticate person....')
    router.navigate(['login'])
    return false
  }

};
