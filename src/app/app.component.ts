import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EmpModel } from './model/emp';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  empForm:FormGroup = new FormGroup({})
  empObj:EmpModel=new EmpModel();
  empList:EmpModel[]=[]

  constructor(){
    this.createForm();
    const oldData=localStorage.getItem('EmpData')
    if(oldData != null){
      const parseData=JSON.parse(oldData);
      this.empList = parseData
    }
  }

  ngOnInit() {
    this.empForm.get('name')?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        console.log('Debounced Name Input:', value);
      });
  }


  createForm(){
    this.empForm=new FormGroup({
    empId:new FormControl(this.empObj.empId),
    emailId:new FormControl(this.empObj.emailId),
    name:new FormControl(this.empObj.name),
    city:new FormControl(this.empObj.city),
    state:new FormControl(this.empObj.state),
    contactNo:new FormControl(this.empObj.contactNo),
    add:new FormControl(this.empObj.add),
    pincode:new FormControl(this.empObj.pincode),
    })
  }

  saveData(){
    const oldData=localStorage.getItem('EmpData');
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.empForm.controls['empId'].setValue(parseData.length+1);
      this.empList.unshift(this.empForm.value)
      this.empForm.reset()
    }else{
     this.empList.unshift(this.empForm.value)
    }
    localStorage.setItem('EmpData', JSON.stringify(this.empList)) 
  }

  onEdit(item:EmpModel){
    this.empObj=item;
    this.createForm()

  }

  updateData(){
    const read=this.empList.find(m=>m.empId == this.empForm.controls['empId'].value)
    if(read != undefined){
      read.add=this.empForm.controls['add'].value;
      read.name=this.empForm.controls['name'].value;
      read.contactNo=this.empForm.controls['contactNo'].value;
    }
    localStorage.setItem('EmpData', JSON.stringify(this.empList))
       this.empObj=new EmpModel();
    this.createForm()
  }

  onDel(id:number){
    const isDel=confirm("Are you sure want to delete");
    if(isDel){
    const index=this.empList.findIndex(m=>m.empId == id)
    this.empList.splice(index,1)
    localStorage.setItem('EmpData', JSON.stringify(this.empList))
    }
  }
}
