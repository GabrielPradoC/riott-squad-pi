import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberService } from 'src/app/@core/services/member.service';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { MembersComponent } from 'src/app/pages/members/members.component';
import { environment } from 'src/environments/environment';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-form-member',
  templateUrl: './form-member.component.html',
  styleUrls: ['./form-member.component.scss']
})
export class FormMemberComponent implements OnInit {
  @Input() typeForm: number;
  @Input() memberId: string;

  public form: FormGroup;
  private fileTemp: File;

  constructor(private fb: FormBuilder, private service: MemberService, private router: Router) {
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
        Validators.required,
        Validators.minLength(3)
      ])]
    });
  }

  ngOnInit() {
    if(this.typeForm == 1) {
      this.trocaIds();
      this.setValuesMember();
    }

    this.initAttributesDrop();
    this.initAttributesDate();
  }

  trocaIds() {
    document.getElementsByName("divFormulario").item(1).setAttribute("id", "divFormulario2");
    document.getElementsByName("sucessMsgFormulario").item(1).setAttribute("id", "sucessMsgFormulario2");
    document.getElementsByName("errorMsgFormulario").item(1).setAttribute("id", "errorMsgFormulario2");
    document.getElementsByName("foto").item(1).setAttribute("id", "foto2");
    document.getElementsByName("nome").item(1).setAttribute("id", "nome2");
    document.getElementsByName("labelNome").item(1).setAttribute("for", "nome2");
    document.getElementsByName("dataNascimento").item(1).setAttribute("id", "dataNascimento2");
    document.getElementsByName("labelDataNascimento").item(1).setAttribute("for", "dataNascimento2");
    document.getElementsByName("valorMesada").item(1).setAttribute("id", "valorMesada2");
    document.getElementsByName("labelValorMesada").item(1).setAttribute("for", "valorMesada2");
  }

  setValuesMember() : void {
    //fazer requisicao pelo id e preencher os forms

    this.form.controls['nome'].setValue("edit");
  }

  initAttributesDrop() : void {
    const element: HTMLElement = <HTMLSelectElement>document.getElementsByName("uploadFoto").item(this.typeForm);

    element.ondragover = (event) => { event.preventDefault(); }
    element.ondrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
  
      if(files.length > 1) {
        alert("É permitido o envio de apenas uma imagem");
      } else {
        this.fileTemp = files.item(0);
      }
    }
  }

  initAttributesDate() : void {
    const dateElement: Element = document.getElementsByName("dataNascimento").item(this.typeForm);
    const today: Date = new Date();
    const month: string = "-" + this.fixDate(today.getMonth() + 1) + "-";

    dateElement.setAttribute("min", (today.getFullYear() - 18) + month + this.fixDate(today.getDate()));
    dateElement.setAttribute("max", today.getFullYear() + month + this.fixDate(today.getDate()));
  }

  fixDate(date: number): string {
    if(date < 10) {
      return "0" + date;
    }
    return date.toString();
  }

  getFileDrop(): void {
    this.fileTemp = null;
    
    setTimeout(() => { this.checkFile(this.fileTemp); }, 100);
  }

  fileChangeEvent(inputFile: any) : void {
    this.checkFile(inputFile.target.files[0]);
  }

  async checkFile(file: File) {
    let error: string;

    if(!file) {
      error = "Houve um problema no upload da imagem, tente novamente";
    } else {
      if (!(file.type === 'image/png' || file.type === 'image/jpeg')) {
        error = "Apenas são permitidas imagens nos formatos PNG e JPG";
      } else {
        if(file.size > 10485760) {
          error = "O tamanho da imagem não deve ultrapassar 10MB";
        } else {
          if(!(await this.saveImage(file))) {
            error = "Não foi possível abrir a imagem, tente novamente";
          } else {
            this.form.controls['foto'].setErrors(null);

            return;
          }
        }
      }
    }

    this.changeImage("default",  "../../../assets/file.ico");
    this.form.controls['foto'].setErrors({ required: true });
    alert(error);
  }

  changeImage(classChange: string, path: string) {
    const elementImage: Element = document.getElementsByName("uploadFoto").item(this.typeForm).firstElementChild.firstElementChild;

    elementImage.setAttribute("class", classChange);
    elementImage.setAttribute("src", path);
  }

  async saveImage(image: File): Promise<boolean> {
    const reader: FileReader = new FileReader();
    let imageTemp: string;
    localStorage.removeItem("RIOTT:imgTemp");

    reader.onload = (e: any) => {
      localStorage.setItem("RIOTT:imgTemp", e.target.result);
    };

    reader.readAsDataURL(image);

    await this.delay(100);
  
    imageTemp = localStorage.getItem("RIOTT:imgTemp");
    this.fileTemp = image;

    if(imageTemp) {
      this.changeImage("imgUpload",  imageTemp);
      return true;
    }
    return false;
  }

  delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  labelUp(): void {
    const elementDateLabel: HTMLElement = document.getElementsByName("labelDataNascimento").item(this.typeForm);

    elementDateLabel.style.transform = "translateY(-22px)";
    elementDateLabel.style.color = "#7C8D93";
  }

  onChange(): void {
    const birthday: string = (<HTMLSelectElement>document.getElementsByName("dataNascimento").item(this.typeForm)).value;
    if(birthday) {
      const year = parseInt(birthday.substring(0, 4));
      const month = parseInt(birthday.substring(5, 7));
      const day = parseInt(birthday.substring(8, 10));
      const today = new Date();

      if((year > (today.getFullYear()-18)) && (year < today.getFullYear())) {
        return;
      } else if(year === (today.getFullYear()-18)) {
        if(month > (today.getMonth()+1)) {
          return;
        } else if(month === (today.getMonth()+1)) {
          if(day > today.getDate()) {
            return;
          }
        }
      } else if(year === today.getFullYear()) {
        if(month < (today.getMonth()+1)) {
          return;
        } else if(month === (today.getMonth()+1)) {
          if(day < today.getDate()) {
            return;
          }
        }
      }

      if(year >= today.getFullYear()) {
        alert("Data inválida, insira uma data menor que a atual")
      } else {
        alert("O membro deve ser menor de 18 anos")
      }
      this.form.controls['dataNascimento'].setErrors({ required: true });
    }
  }

  mask(): void{
    let value: string = (<HTMLSelectElement>document.getElementsByName("valorMesada").item(this.typeForm)).value;

    value = value.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    value = value.replace(/(\d)(\d\d$)/,"$1,$2");    //Coloca vírgula entre o penúltimo e antepenúltimo dígitos

    (<HTMLSelectElement>document.getElementsByName("valorMesada").item(this.typeForm)).value = value;
  }

  cadastrarMembro() : void {
    const photo = this.fileTemp;
    const name: string = this.form.controls['nome'].value;
    const birthday: string = MembersComponent.prototype.changeFormatDate(this.form.controls['dataNascimento'].value);
    const allowance: string = (<HTMLSelectElement>document.getElementsByName("valorMesada").item(this.typeForm)).value.replace(",", ".");
    const parent = parseInt(localStorage.getItem("riott:userId"));

    this.service.postFormData({name, parent, birthday, allowance, photo}, `${environment.API}member`).subscribe(
      complete => {
        dialogBoxComponent.showDialogbox("divFormulario", "sucessMsgFormulario")
      },
      error => dialogBoxComponent.showDialogbox("divFormulario", "errorMsgFormulario")
    );
  }

  editarMembro() {
  }

  cancelar(): void {
    if(this.typeForm == 0) {
      dialogBoxComponent.showDialogbox("divFormulario", "warningMsgFormulario");
    } else {
      ModalComponent.prototype.hideModal();
    }
  }

  textSucess() : string {
    if(this.typeForm == 0) {
      return 'Membro adicionado com sucesso!'
    }  {
      return 'Membro editado com sucesso!';
    }
  }

  redirectLists() {
    if(this.typeForm == 0) {
      setTimeout(() => {
        this.router.navigate(['/pages/lists']);
      }, 200);
    }
  }

  completeEdit() {
    if(this.typeForm == 0) {
      return ''
    }  {
      return '2';
    }
  }
}
