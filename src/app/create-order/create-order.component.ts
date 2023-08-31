import {
  Component,
  Input,
  SimpleChange,
  ViewChild,
  ElementRef,
} from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent {
  @ViewChild('pdfContent') pdfContent!: ElementRef
  @Input() addProductForm: any
  @Input() getAllData: any
  @Input() user: any

  pdfUrl!: string
  pdfTitle = 'Check out this PDF!'

  visible: boolean = false
  orderListForm!: FormGroup
  productList: any = []
  getOrderDetail: any
  getOrder: any = []
  updateArray: any = []
  totalAmount: any
  constructor(private fb: FormBuilder) {
    this.orderListForm = fb.group({
      customerName: [''],
      customerAddress: [''],
      orders: this.fb.array([]),
    })
  }

  ngOnInit() {
    this.getAllOrder()
    this.addOrder()
    console.log('user', this.user)
    console.log('user5465', this.getOrder)
  }

  getAllOrder() {
    let localDataForProduct: any = localStorage.getItem('productList') || []
    this.productList = JSON.parse(localDataForProduct)
    let localDataForOrder: any = localStorage.getItem('orderList') || []
    this.getOrderDetail = JSON.parse(localDataForOrder)
    this.getOrder = this.getOrderDetail.orders

    this.updateArray = this.getOrderDetail.orders?.map(
      (item: any, index: number) => {
        return {
          ...item,
          id: index + 1,
        }
      },
    )

    this.totalAmount = this.getOrder?.reduce(
      (acc: any, itt: any) => acc + itt.price * itt.qty,
      0,
    )
  }

  onChanges(change: SimpleChange) {
    if (change) {
      console.log('=-=-=-=-=-=change', change)

      let a: any = localStorage.getItem('productList') || []
      this.productList = JSON.parse(a)
    }
  }

  get orders(): FormArray {
    return this.orderListForm.get('orders') as FormArray
  }

  showDialog() {
    this.getAllData()
    this.visible = true
  }

  addOrder() {
    let orderField = this.fb.group({
      selectProduct: [''],
      qty: [''],
      price: [''],
      id: [this.getOrder?.length],
    })
    this.orders.push(orderField)
  }
  removeOrder(i: number) {
    this.orders.removeAt(i)
  }
  onSubmit() {
    console.log('=-=-=-=-=-', this.orderListForm.value)
    localStorage.setItem('orderList', JSON.stringify(this.orderListForm.value))
    this.orderListForm.reset()
    this.getAllData()
    this.getAllOrder()
    this.visible = false
  }

  generatePDF() {
    let UserName = this.user?.firmName
    let arr = UserName.split(' ')

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }

    let str2 = arr.join(' ')
    const content: HTMLElement = this.pdfContent.nativeElement
    const pdf = new jsPDF('p', 'mm', 'a4')

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      pdf.text('Thank You', 150, imgHeight + 35)
      pdf.text(`${str2}`, 150, imgHeight + 41)
      pdf.save('document.pdf')
    })
  }

  sharePDFOnWhatsApp() {
    let UserName = this.user?.firmName
    let arr = UserName.split(' ')
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }
    let str2 = arr.join(' ')

    const content: HTMLElement = this.pdfContent.nativeElement
    const pdf = new jsPDF('p', 'mm', 'a4')

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      pdf.text('Thank You', 150, imgHeight + 35)
      pdf.text(`${str2}`, 150, imgHeight + 41)

      let final: any = pdf.output('blob')

      this.pdfUrl = URL.createObjectURL(final)
      // const blobUrl = URL.createObjectURL(final)
      // console.log('mmmmmmmmm', blobUrl)

      // const downloadLink = document.createElement('a');
      // downloadLink.href = this.pdfUrl;

      const pdfFile = new Blob([final], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(pdfFile)

      // const pdfBlob = new Blob([/* Provide the Blob data here */], { type: 'application/pdf' });

      // const formData = new FormData();
      // formData.append('document', pdfFile, pdfFile.name);
      const pdfUrl = URL.createObjectURL(pdfFile)
      const whatsappMessage = `Check out this PDF! `
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
        blobUrl,
      )}&attachment=${encodeURIComponent(blobUrl)}`

      // Open WhatsApp with the generated PDF file attached
      // window.location.href = whatsappUrl;
      // const whatsappMessage = 'Download the PDF: ' + blobUrl;

      // const whatsappShareUrl = `whatsapp://send?text=${encodeURIComponent(blobUrl)}`;

      window.open(whatsappUrl)
    })
  }
}
