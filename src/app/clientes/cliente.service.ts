import { Injectable } from "@angular/core";
import { Cliente } from "./cliente.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class ClienteService{
    private clientes: Cliente[] = [];
    private listaClientesAtualizada = new Subject<Cliente[]>();
    
    constructor (private httpClient: HttpClient){

    }
    getListaDeClientesAtualizadaObservable () {
      return this.listaClientesAtualizada.asObservable();
    }

    getClientes(): void {
      this.httpClient.get<{mensagem: string, clientes: any}>('http://localhost:3000/api/clientes')
        .pipe(map((dados) => {
          return dados.clientes.map(cliente => {
            return {
              id: cliente._id,
              nome: cliente.nome,
              fone: cliente.fone,
              email: cliente.email
            }
          })
        }))
        .subscribe((clientes) => {
           this.clientes = clientes;
           this.listaClientesAtualizada.next([...this.clientes])
        }
      )
    }

    getCliente (idCliente: string){
        return {...this.clientes.find(cli => cli.id === idCliente)}
    }

    adicionarCliente (nome: string, fone: string, email: string) {
        const cliente: Cliente = { nome, fone, email }
        this.httpClient.post<{mensagem: string, id: string}>('http://localhost:3000/api/clientes', cliente)
        .subscribe((dados) => {
            cliente.id = dados.id
            this.clientes.push(cliente);
            //operador spread ...
            this.listaClientesAtualizada.next([...this.clientes]);
        })

    }

    removerCliente (id: string): void{
        this.httpClient.delete(`http://localhost:3000/api/clientes/${id}`)
        .subscribe(() => {
            this.clientes = this.clientes.filter (cli => cli.id !== id)
            this.listaClientesAtualizada.next([...this.clientes])
        })
    }

}
