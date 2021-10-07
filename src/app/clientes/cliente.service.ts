import { Injectable } from "@angular/core";
import { Cliente } from "./cliente.model";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class ClienteService{
    private clientes: Cliente[] = [];
    private listaClientesAtualizada = new Subject<Cliente[]>();

    getClientes(): Cliente[] {
        return [...this.clientes]
    }

    adicionarCliente (nome: string, fone: string, email: string) {
        const cliente: Cliente = { nome, fone, email }
        this.clientes.push(cliente);
        this.listaClientesAtualizada.next([...this.clientes]);
    }

    getListaDeClientesAtualizadaObservable () {
      return this.listaClientesAtualizada.asObservable();
    }
}
