import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup
  isFormSubmit: boolean = false
  tokenAccess: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.initLoginForm()
    // this.getFieldError()
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.pattern('^[0-9]{10}$'), Validators.required]],
      firmName: ['', Validators.required],
      firmAddress: ['', Validators.required],
    })
  }

  getFieldError(fieldName: string) {
    const field: any = this.loginForm.get(fieldName)

    if (!field) {
      throw new Error(`Field ${fieldName} not found in the form.`)
    }

    if (this.isFormSubmit || (field.dirty && field.touched)) {
      if (field.errors?.required) {
        return `${fieldName} is required.`
      }
      if (field.errors?.email) {
        return `Invalid ${fieldName} format.`
      }
      if (field.errors?.pattern) {
        return `Invalid ${fieldName} format.`
      }
    }

    return ''
  }

  handleSubmit() {
    this.isFormSubmit = true
    for (const key in this.loginForm.value) {
      if (!this.loginForm.value[key]) {
        this.getFieldError(key)
      }
    }

    if (this.loginForm.invalid) {
      return
    }
    localStorage.setItem('userToken', JSON.stringify(this.loginForm.value))
    let user = JSON.parse(localStorage.getItem('userToken') || '{}')
    if (user) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Login Successfully',
      })

      this.route.navigate(['dashboard'])
    } else {
      this.messageService.add({
        severity: 'danger',
        summary: 'Fail',
        detail: 'Login Fail',
      })
    }
    this.loginForm.reset()
    this.isFormSubmit = false
  }
}
