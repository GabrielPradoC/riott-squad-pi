import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { MemberService } from 'src/app/@core/services/member.service';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { environment } from 'src/environments/environment';
import { Member } from 'src/models/member.model';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit  {
  private form: FormGroup;
  static fileTemp: File;
  public members: Member[];
  public idSelected: number;

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
    this.getMembers();
    window.onload = function () {
      MembersComponent.initAttributesDrop();
      MembersComponent.initAttributesDate();
    }
  }

  getMembers() {
    const id = localStorage.getItem("riott:userId");
    this.service.List(`${environment.API}user/${id}/members`)
      .subscribe(
        complete => {
          this.members = complete.data.children;
        },
        error => console.log(error)
      );
  }

  static initAttributesDrop() : void {
    document.getElementById("uploadFoto").ondragover = (event) => { event.preventDefault(); }
    document.getElementById("uploadFoto").ondrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
  
      if(files.length > 1) {
        alert("É permitido o envio de apenas uma imagem");
      } else {
        MembersComponent.fileTemp = files.item(0);
      }
    }
  }

  static initAttributesDate() : void {
    const today: Date = new Date();
    const month: string = "-" + (today.getMonth() + 1) + "-";

    document.getElementById("dataNascimento").setAttribute("min", (today.getFullYear() - 18) + month + (today.getDate()+1));
    document.getElementById("dataNascimento").setAttribute("max", today.getFullYear() + month + (today.getDate()-1));
  }

  getFileDrop(): void {
    MembersComponent.fileTemp = null;
    
    setTimeout(() => { this.checkFile(MembersComponent.fileTemp); }, 100);
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

    document.getElementById("uploadFoto").firstElementChild.firstElementChild.setAttribute("class", "default");
    document.getElementById("uploadFoto").firstElementChild.firstElementChild.setAttribute("src", "../../../assets/file.ico");
    this.form.controls['foto'].setErrors({ required: true });
    alert(error);
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
    MembersComponent.fileTemp = image;

    if(imageTemp) {
      document.getElementById("uploadFoto").firstElementChild.firstElementChild.setAttribute("class", "imgUpload");
      document.getElementById("uploadFoto").firstElementChild.firstElementChild.setAttribute("src", imageTemp);
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
    document.getElementById("dateLabel").style.transform = "translateY(-22px)";
    document.getElementById("dateLabel").style.color = "#7C8D93";
  }

  onChange(): void {
    const birthday = (<HTMLSelectElement>document.getElementById("dataNascimento")).value;
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
    let value: string = (<HTMLSelectElement>document.getElementById("valorMesada")).value;

    value = value.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    value = value.replace(/(\d)(\d\d$)/,"$1,$2");    //Coloca vírgula entre o penúltimo e antepenúltimo dígitos

    (<HTMLSelectElement>document.getElementById("valorMesada")).value = value;
  }

  cadastrarMembro() : void {
    const photo = MembersComponent.fileTemp;
    const name: string = this.form.controls['nome'].value;
    const birthday: string = this.changeFormatDate(this.form.controls['dataNascimento'].value);
    const allowance: string = (<HTMLSelectElement>document.getElementById("valorMesada")).value.replace(",", ".");
    const parent = parseInt(localStorage.getItem("riott:userId"));

    this.service.postFormData({name, parent, birthday, allowance, photo}, `${environment.API}member`).subscribe(
      complete => {
        dialogBoxComponent.showDialogbox("divCadastrarMembro", "sucessMsgCreateMember")
      },
      error => dialogBoxComponent.showDialogbox("divCadastrarMembro", "errorMsgCreateMember")
    );
  }

  changeFormatDate(date: string) : string {
    const newDate: Date = new Date(date);
    return newDate.toLocaleDateString();
  }

  cancelarCadastro(): void {
    dialogBoxComponent.showDialogbox("divCadastrarMembro", "warningMsgCreateMember");
  }

  redirectLists() {
    setTimeout(() => {
      this.router.navigate(['/pages/lists']);
    }, 200);
  }

  saveId(id: number) : void {
    this.idSelected = id;
  }

  removerMembro(): void {
    this.service.Remove(`${environment.API}member/${this.idSelected}`).subscribe(
      complete => {
        this.getMembers();
        dialogBoxComponent.showDialogbox("warningMsgDeleteMember", "sucessMsgDeleteMember")
      }
    );
  }
}