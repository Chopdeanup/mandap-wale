import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user:any 
  visible: boolean = false;
  addProductForm!: FormGroup;
  editingIndex: number = -1;
  productList:any[] =  []


  constructor(private fb:FormBuilder){
    this.addProductForm = this.fb.group({
      products: this.fb.array([]),
    });
  }
   

  ngOnInit(){
    
   this.getAllData()
    this.addProduct()
  
  }

  getAllData(){
    let userDetails:any =localStorage.getItem('userToken');
    this.productList = JSON.parse(localStorage.getItem('productList') || "[]")
    this.user =JSON.parse(userDetails)
  }

  showDialog() {
    if(this.productList){
        // this.addProductForm.patchValue({
        //   productName: products.productName,
        // });
    } 
    this.visible = true;
}

  getFirstLetters(inputString: string): string {
    const words = inputString.split(' ');
    const firstLetters = words?.map(word => word.charAt(0));
    return firstLetters.join('');
  }

  addProduct() {
    const productGroup = this.fb.group({
      productName: [''],
    });
    this.products.push(productGroup);
  }

  addRemove(i:number){
    this.products.removeAt(i);
  }

  onSubmit() {
    console.log("=-=-=-=-=-",this.addProductForm.value);
    localStorage.setItem('productList', JSON.stringify(this.addProductForm.value.products))
    this.addProductForm.reset()
    this.visible = false;
  }

  get products():FormArray{
    return this.addProductForm.get('products') as FormArray;
  }

}
