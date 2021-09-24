import { Component } from "@angular/core";

@Component({
    selector: 'app-cliente-inserir',
    templateUrl: './cliente-inserir.component.html'
})
export class ClienteInserirComponent{

    nome: string
    fone: string
    email: string


    onAdicionarCliente(){
        console.log("Inserindo cliente...")
    }

}