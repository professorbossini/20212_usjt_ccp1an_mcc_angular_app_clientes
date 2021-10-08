import { Injectable } from "@angular/core";
import { Cliente } from "./cliente.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ClienteService{
    private clientes: Cliente[] = [];
    private listaClientesAtualizada = new Subject<Cliente[]>();

    constructor (private httpClient: HttpClient){

    }

    getClientes(): void {
        // return [...this.clientes]
        this.httpClient.get<{mensagem: string, clientes: Cliente[]}>('http://localhost:3000/api/clientes')
        .subscribe((dados) => {
           this.clientes = dados.clientes 
           this.listaClientesAtualizada.next([...this.clientes])
        })
    }

    adicionarCliente (nome: string, fone: string, email: string) {
        const cliente: Cliente = { nome, fone, email }
        this.httpClient.post<{mensagem: string}>('http://localhost:3000/api/clientes', cliente)
        .subscribe((dados) => {
            this.clientes.push(cliente);
            //operador spread ...
            this.listaClientesAtualizada.next([...this.clientes]);
        })

    }

    getListaDeClientesAtualizadaObservable () {
      return this.listaClientesAtualizada.asObservable();
    }
}
