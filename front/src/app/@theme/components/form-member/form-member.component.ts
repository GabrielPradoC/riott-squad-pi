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
  public error: string;

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
      this.setValuesMember();
    }

    this.initAttributesDrop();
    this.initAttributesDate();
  }

  /**
   * Preenche o formulário com os dados do membro selecionado
   */
   setValuesMember() : void {
    this.service.LoadMemberByID(`${environment.API}member`, this.memberId).subscribe(
      complete => {
        let member = complete.data;

        this.changeImage("imgUpload", "data:image/png;base64," + member.photo);
        this.form.controls['foto'].setErrors(null)
        this.form.controls['nome'].setValue(member.name);
        this.form.controls['dataNascimento'].setValue(member.birthday.toString().substring(0, 10));
        this.labelUp();
        this.form.controls['valorMesada'].setValue(member.allowance.toString(0).replace(".", ","));
      })
  }

  /**
   * Transforma a div uploadFoto em um espaço para arrastar arquivos e assegura o recebimento de apenas um arquivo por vez
   * Quando recebido, envia o arquivo único para checagem
   */
  initAttributesDrop() : void {
    const element: HTMLElement = <HTMLSelectElement>document.getElementsByName("uploadFoto").item(this.typeForm);

    element.ondragover = (event) => { event.preventDefault(); }
    element.ondrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
  
      if(files.length > 1) {
        alert("É permitido o envio de apenas uma imagem");
      } else {
        this.checkFile(files.item(0));
      }
    }
  }

  /**
   * Define limites mínimo e máximo para a data de nascimento
   */
  initAttributesDate() : void {
    const dateElement: Element = document.getElementsByName("dataNascimento").item(this.typeForm);
    const today: Date = new Date();
    const month: string = "-" + this.fixDate((today.getMonth() + 1)%12) + "-";

    dateElement.setAttribute("min", (today.getFullYear() - 18) + month + this.fixDate(today.getDate()));
    dateElement.setAttribute("max", today.getFullYear() + month + this.fixDate(today.getDate()));
  }

  /**
   * Coloca um zero à esquerda de valores com apenas um dígito
   * @param date - número referente ao dia ou mês
   * @returns string de dois caracteres representando o dia ou mês
   */
  fixDate(date: number): string {
    if(date < 10) {
      return "0" + date;
    }
    return date.toString();
  }

  /**
   * Função chamada quando o input foto é alterado, envia o arquivo para checagem
   * @param inputFile - arquivo recebido pelo input
   */
  fileChangeEvent(inputFile: any) : void {
    this.checkFile(inputFile.target.files[0] || this.fileTemp);
  }

  /**
   * Faz as validações necessárias para o arquivo e troca a foto de membro de acordo com o resultado
   * @param file - arquivo recebido
   * @returns void
   */
  async checkFile(file: File) : Promise<void> {
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

  /**
   * Altera a foto de membro no formulário de cadastro/edição
   * @param classChange - classe desejada para o elemento de foto de membro
   * @param path - imagem a ser mostrada pelo elemento
   */
  changeImage(classChange: string, path: string) {
    const elementImage: Element = document.getElementsByName("uploadFoto").item(this.typeForm).firstElementChild.firstElementChild;

    elementImage.setAttribute("class", classChange);
    elementImage.setAttribute("src", path);
  }

  /**
   * Lê o arquivo, salva a imagem no localStorage e mostra ela no formulário
   * @param image - arquivo de imagem recebido
   * @returns booleano mostrando se a função foi executada sem problemas
   */
  async saveImage(image: File): Promise<boolean> {
    const reader: FileReader = new FileReader();
    let imageTemp: string;

    localStorage.removeItem("RIOTT:imgTemp");
    this.fileTemp = image;

    reader.onload = (e: any) => {
      localStorage.setItem("RIOTT:imgTemp", e.target.result);
    };
    reader.readAsDataURL(image);

    await this.delay(100);

    imageTemp = localStorage.getItem("RIOTT:imgTemp");
    if(imageTemp) {
      this.changeImage("imgUpload",  imageTemp);
      return true;
    }
    return false;
  }

  /**
   * Função pra pausar a execução de uma função por um tempo
   * @param ms - tempo desejado para o delay
   * @returns uma promise apenas para que a função que a chamou fique aguardando o retorno
   */
  delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  /**
   * Faz a transição da label da data de nascimento para cima e muda sua cor
   */
  labelUp(): void {
    const elementDateLabel: HTMLElement = document.getElementsByName("labelDataNascimento").item(this.typeForm);

    elementDateLabel.style.transform = "translateY(-22px)";
    elementDateLabel.style.color = "#7C8D93";
  }

  /**
   * Verifica se a data de nascimento inserida pelo teclado respeita os limites mínimo e máximo de data
   * @returns void
   */
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
          if(day >= today.getDate()) {
            return;
          }
        }
      } else if(year === today.getFullYear()) {
        if(month < (today.getMonth()+1)) {
          return;
        } else if(month === (today.getMonth()+1)) {
          if(day <= today.getDate()) {
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

  /**
   * Máscara para manter o valor da mesada na formatação correta de valor
   */
  mask(): void{
    let value: string = (<HTMLSelectElement>document.getElementsByName("valorMesada").item(this.typeForm)).value;

    value = value.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    value = value.replace(/(\d)(\d\d$)/,"$1,$2");    //Coloca vírgula entre o penúltimo e antepenúltimo dígitos

    (<HTMLSelectElement>document.getElementsByName("valorMesada").item(this.typeForm)).value = value;
  }

  /**
   * Pega valores do formulário e id de usuário e redireciona para a função adequada
   */
  acaoMembro() : void {
    let body: Map<string, string | File> = new Map();
    let formData: FormData;

    body.set("parent", localStorage.getItem("riott:userId"));

    if(this.form.controls['nome'].dirty) {
      body.set("name", this.form.controls['nome'].value);
    }
    
    if(this.form.controls['dataNascimento'].dirty) {
      body.set("birthday", MembersComponent.prototype.changeFormatDate(this.form.controls['dataNascimento'].value));
    }

    if(this.form.controls['valorMesada'].dirty) {
      body.set("allowance", (<HTMLSelectElement>document.getElementsByName("valorMesada").item(this.typeForm)).value.replace(",", "."));
    }

    if(this.fileTemp && this.fileTemp.name != "File name") {
      body.set("photo", this.fileTemp)
    }

    formData = this.createFormData(body);

    if(this.typeForm == 0) {
      this.cadastrarMembro(formData);
    } else {
      this.editarMembro(formData);
    }
  }

  /**
   * Pega os dados recebidos e os coloca em um formData
   * @param body - dados do formulário de membro
   * @returns formData criado
   */
  createFormData(body: Map<string, string | File>) : FormData {
    const formData: FormData = new FormData();

    body.forEach((item, key) => {
      formData.append(key, <string | Blob>item.valueOf())
    })

    return formData;
  }

  /**
   * Faz a requisição de criação e redireciona para o dialog-box adequado
   * @param formData - informações do membro a ser criado
   */
  cadastrarMembro(formData: FormData) : void {
    this.service.createMember(formData, `${environment.API}member`).subscribe(
      complete => {
        dialogBoxComponent.showDialogbox("divFormulario", "sucessMsgFormulario")
      },
      error => {
        this.error = dialogBoxComponent.formatError(error.error.error);
        dialogBoxComponent.showDialogbox("divFormulario", "errorMsgFormulario");
      }
    );
  }

  /**
   * Faz a requisição de edição e redireciona para o dialog-box adequado
   * @param formData - novas informações do membro a ser alterado
   */
  editarMembro(formData: FormData) {
    this.service.editMember(formData, `${environment.API}member/${this.memberId}`).subscribe(
      complete => {
        dialogBoxComponent.showDialogbox("divFormulario2", "sucessMsgFormulario2")
      },
      error => {
        this.error = dialogBoxComponent.formatError(error.error.error);
        dialogBoxComponent.showDialogbox("divFormulario2", "errorMsgFormulario2");
      }
    );
  }

  /**
   * Mostra dialog-box para confirmar a ação, caso esteja criando um membro, ou apenas fecha o modal, caso contrário
   */
  cancelar(): void {
    if(this.typeForm == 0) {
      dialogBoxComponent.showDialogbox("divFormulario", "warningMsgFormulario");
    } else {
      ModalComponent.prototype.hideModal();
    }
  }

  /**
   * @returns frase de sucesso de acordo com o tipo de formulário
   */
  textSucess() : string {
    if(this.typeForm == 0) {
      return 'Membro adicionado com sucesso!'
    }  {
      return 'Membro editado com sucesso!';
    }
  }

  /**
   * Aguarda um tempo para o modal fechar e redireciona para a página de listas
   */
  redirectLists() {
    if(this.typeForm == 0) {
      setTimeout(() => {
        this.router.navigate(['/pages/lists']);
      }, 200);
    }
  }

  /**
   * @returns string para complementar o id com '2' caso seja o formulário de edição
   */
  completeEdit() {
    if(this.typeForm == 0) {
      return ''
    }  {
      return '2';
    }
  }
}
