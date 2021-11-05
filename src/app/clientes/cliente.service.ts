import { Injectable } from "@angular/core";
import { Cliente } from "./cliente.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from '@angular/router'

@Injectable({providedIn: 'root'})
export class ClienteService{
    private clientes: Cliente[] = [];
    private listaClientesAtualizada = 
        new Subject<{clientes: Cliente[], maxClientes: number}>();

    constructor (
      private httpClient: HttpClient,
      private router: Router
    ){

    }
    getListaDeClientesAtualizadaObservable () {
      return this.listaClientesAtualizada.asObservable();
    }

    getClientes(pagesize: number, page: number): void {
      const parametros = `?pagesize=${pagesize}&page=${page}`
      this.httpClient.get<{mensagem: string, clientes: any, maxClientes: number}>('http://localhost:3000/api/clientes' + parametros)
        .pipe(map((dados) => {
          return {
            clientes: dados.clientes.map(cliente => {
              return {
                id: cliente._id,
                nome: cliente.nome,
                fone: cliente.fone,
                email: cliente.email,
                imagemURL: cliente.imagemURL
              }
            }),
            maxClientes: dados.maxClientes
          }
        }))
        .subscribe((dados) => {
           this.clientes = dados.clientes;
           this.listaClientesAtualizada.next({
             clientes: [...this.clientes],
             maxClientes: dados.maxClientes
            })
           this.router.navigate(['/'])
        }
      )
    }

    getCliente (idCliente: string){
      //return {...this.clientes.find(cli => cli.id === idCliente)}
      return this.httpClient.get
      <{_id: string, nome: string, fone: string, email: string, imagemURL: string}>
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

  atualizarCliente (id: string, nome: string, fone: string, email: string, imagem: File | string) {
    //const cliente: Cliente = {id, nome, fone, email, imagemURL: null};
    let clienteData: Cliente | FormData;
    if (typeof(imagem) === 'object') { //é um arquivo, precisa criar um form data
      clienteData = new FormData();
      clienteData.append('id', id);
      clienteData.append('nome', nome);
      clienteData.append('fone', fone);
      clienteData.append('email', email);
      clienteData.append('imagem', imagem, nome); //nome = nome do arquivo
    }
    else { //é uma string, vamos montar o JSON comum
      clienteData = {
        id: id,
        nome: nome,
        fone: fone,
        email: email,
        imagemURL: imagem
      }
    }
    console.log(typeof(clienteData));
    this.httpClient.put(`http://localhost:3000/api/clientes/${id}`, clienteData)
    .subscribe(res => {
      const copia = [...this.clientes];
      const indice = copia.findIndex(cli => cli.id === id);
      const cliente: Cliente = {
        id: id,
        nome: nome,
        fone: fone,
        email: email,
        imagemURL: ""
      }
      copia[indice] = cliente;
      this.clientes = copia;
      this.listaClientesAtualizada.next([...this.clientes]);
      this.router.navigate(['/'])
    });
  }
}
