import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { ClienteInserirComponent } from "./clientes/cliente-inserir/cliente-inserir.component";
import { ClienteListaComponent } from "./clientes/cliente-lista/cliente-lista.component";

const routes: Routes = [
    {path: '', component: ClienteListaComponent},
    {path: 'criar', component: ClienteInserirComponent},
    //localhost:4200/editar/123456
    {path: 'editar/:idCliente', component: ClienteInserirComponent}
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule{

}