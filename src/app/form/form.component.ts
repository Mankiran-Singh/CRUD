import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { productsArray } from 'src/productsArray';
import { map } from 'rxjs';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
 
  editMode:boolean=false
  currentProductId:number=0
  products:any=[];
  constructor(private http:HttpClient,private router:Router,private userDataService:UserDataService){
    
    this.userDataService.dataEmitter.subscribe((res)=>{
      console.log(res)
         this.productForm.setValue({
           id:res.data.id,
           name:res.data.name,
           price:res.data.price,
           product:res.data.product
         })
         this.editMode=res.editMode
         this.currentProductId=res.currentProductId
    })
  }
  ngOnInit(): void {
    this.getDataProducts().subscribe((res)=> {
      this.products=res;
    })
  }
  productForm=new FormGroup({
    id:new FormControl('',[Validators.required]),
    name:new FormControl('',[Validators.required]),
    price:new FormControl('',[Validators.required]),
    product:new FormControl('',[Validators.required]),
  })
 
  showErrors=false;
  postProducts(data:any){
     if(this.editMode==false)
     {
       if(this.productForm.valid){
           this.http.post('http://localhost:3000/products',data)
           .subscribe((res) => {
              this.getDataProducts().subscribe((res)=> {
                this.products=res;
              })
            });
        }else{
          this.showErrors=true
       }
    }
     else{
      this.updateProduct(this.currentProductId,data)
    }
  }

  get id(){
    return this.productForm.get('id')
  }
  get name(){
    return this.productForm.get('name')
  }
  get price(){
    return this.productForm.get('price')
  }
  get product(){
    return this.productForm.get('product')
  }

  getDataProducts(){
   return this.http.get('http://localhost:3000/products')
  }
  
  updateProduct(id:number,prod:any){
    this.http.put(`http://localhost:3000/products/${id}`,prod).subscribe((res)=>{
      this.getDataProducts().subscribe((res)=> {
        this.products=res;
      })
    })
    this.productForm.setValue({
      id:'',
      name:'',
      price:'',
      product:''
    })
    this.editMode=false
  }
  getRequest() {
    this.getDataProducts().subscribe((res)=> {
      this.products=res;
    })
  }
}
