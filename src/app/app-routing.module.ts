import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { ClienteInserirComponent } from "./clientes/cliente-inserir/cliente-inserir.component";
import { ClienteListaComponent } from "./clientes/cliente-lista/cliente-lista.component";

const routes: Routes = [
    //host:porta/
    {path: '', component: ClienteListaComponent},
    //host:porta/criar
    {path: 'criar', component: ClienteInserirComponent},
    //host:porta/editar/123456
    {path: 'editar/:idCliente', component: ClienteInserirComponent},
    //host:porta/login
    {path: 'login', component: LoginComponent},
    //host:porta/signup
    {path: 'signup', component: SignupComponent},
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
