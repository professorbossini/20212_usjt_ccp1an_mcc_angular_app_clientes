import { Injectable } from "@angular/core";
import { Cliente } from "./cliente.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from '@angular/router'

@Injectable({providedIn: 'root'})
export class ClienteService{
    private clientes: Cliente[] = [];
    private listaClientesAtualizada = new Subject<Cliente[]>();

    constructor (
      private httpClient: HttpClient,
      private router: Router
    ){

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
              email: cliente.email,
              imagemURL: cliente.imagemURL
            }
          })
        }))
        .subscribe((clientes) => {
           this.clientes = clientes;
           this.listaClientesAtualizada.next([...this.clientes])
           this.router.navigate(['/'])
        }
      )
    }

    getCliente (idCliente: string){
      //return {...this.clientes.find(cli => cli.id === idCliente)}
      return this.httpClient.get
      <{_id: string, nome: string, fone: string, email: string}>
      (`http://localhost:3000/api/clientes/${idCliente}`);
    }

  adicionarCliente (nome: string, fone: string, email: string, imagem: File) {
    //const cliente: Cliente = { nome, fone, email }

    const dadosCliente = new FormData();
    dadosCliente.append("nome", nome);
    dadosCliente.append("fone", fone);
    dadosCliente.append("email", email);
    dadosCliente.append("imagem", imagem);

    this.httpClient.post<{mensagem: string, cliente: Cliente}>
    ('http://localhost:3000/api/clientes', dadosCliente)
    .subscribe((dados) => {
      const cliente: Cliente = {
        id: dados.cliente.id,
        nome: nome,
        fone: fone,
        email: email,
        imagemURL: dados.cliente.imagemURL
      };
      this.clientes.push(cliente);
      //operador spread ...
      this.listaClientesAtualizada.next([...this.clientes]);
      this.router.navigate(['/'])
    })
  }

  removerCliente (id: string): void{
    this.httpClient.delete(`http://localhost:3000/api/clientes/${id}`)
    .subscribe(() => {
        this.clientes = this.clientes.filter (cli => cli.id !== id)
        this.listaClientesAtualizada.next([...this.clientes])
    })
  }

  atualizarCliente (id: string, nome: string, fone: string, email: string) {
    const cliente: Cliente = {id, nome, fone, email, imagemURL: null};
    this.httpClient.put(`http://localhost:3000/api/clientes/${id}`, cliente)
    .subscribe(res => {
      const copia = [...this.clientes];
      const indice = copia.findIndex(cli => cli.id === cliente.id);
      copia[indice] = cliente;
      this.clientes = copia;
      this.listaClientesAtualizada.next([...this.clientes]);
    });
  }

}
