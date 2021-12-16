import { Component } from '@angular/core';
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

  fileChangeEvent(inputFile: any) : void {
    const file: File = inputFile.target.files[0];
    let error: string;

    if(!file) {
      error = "Houve um problema no upload da imagem, tente novamente";
    } else {
      if (!(file.type === 'image/png' || 'image/jpeg')) {
        error = "Apenas são permitidas imagens nos formatos PNG e JPG";
      } else {
        if(file.size > 10485760) {
          error = "O tamanho da imagem não deve ultrapassar 10MB";
        } else {
          if(!this.saveImage(file)) {
            error = "Não foi possível abrir a imagem, tente novamente";
          } else {
            return;
          }
        }
      }
    }

    this.form.controls['foto'].setErrors({ required: false });
    console.log(error);
  }

  saveImage(image: File) : boolean {
    const reader: FileReader = new FileReader();
    let imageTemp: string;

    reader.onload = (e: any) => {
      localStorage.setItem("RIOTT:imgTemp", e.target.result);
    };

    reader.readAsDataURL(image);

    imageTemp = localStorage.getItem("RIOTT:imgTemp");

    if(imageTemp) {
      //bota a img pra mostrar no form
      document.getElementById("uploadFoto").firstElementChild.setAttribute("src", imageTemp);
      return true;
    }
    return false;
  }






  cadastrarMembro() : void {
    const nome: string = this.form.controls['nome'].value;
    const dataNascimento = this.form.controls['dataNascimento'].value;
    const valorMesada = this.form.controls['valorMesada'].value;


    console.log();
    console.log(nome);
    console.log(dataNascimento);
    console.log(valorMesada);

    
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

