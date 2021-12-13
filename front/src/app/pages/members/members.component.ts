import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      foto: ['', Validators.compose([
        Validators.required
      ])],
      nome: ['', Validators.compose([
        Validators.required
      ])],
      dataNascimento: ['', Validators.compose([
        Validators.required
      ])],
      valorMesada: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    // your code goes here after droping files or any
    }

    onDragOver(evt) {
      console.log("Drag Over");
      return false;
    }

   onDragLeave(evt) {
     evt.preventDefault();
     evt.stopPropagation();
    }

    labelUp() {
      document.getElementById("dateLabel").style.transform = "translateY(-22px)";
      document.getElementById("dateLabel").style.color = "#7C8D93";
    }
}

