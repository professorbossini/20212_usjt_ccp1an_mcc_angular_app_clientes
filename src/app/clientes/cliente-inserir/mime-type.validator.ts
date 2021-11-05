import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeTypeValidator = (control: AbstractControl): Promise <{[key: string]: any}> | Observable <{[key: string]: any}> => {
    if (typeof(control.value) === 'string')
        return of(null)
    const arquivo = control.value as File
    //png: 89504e47
    //jpg: ffd8ffe0 ou ffd8ffe1 ou ffd8ffe2 ou ffd8ffe3 ou ffd8ffe8
    //bmp: 
    const leitor = new FileReader()
    const observable = new Observable((observer: Observer <{[key:string]:any}>) => {
        leitor.addEventListener('loadend', () => {
            const bytes = new Uint8Array (leitor.result as ArrayBuffer).subarray(0, 4)
            let valido: boolean = false
            let header = ""
            for (let i = 0; i < bytes.length; i++){
                header += bytes[i].toString(16)
            }
            console.log(header)
            switch(header){
                case '89504e47': //png
                case 'ffd8ffe0': //jpg
                case 'ffd8ffe1': //jpg
                case 'ffd8ffe2': //jpg
                case 'ffd8ffe3': //jpg
                case 'ffd8ffe8': //jpg
                case '42d4369c': //bmp
                    valido = true
                    break;
                default:
                    valido = false
                
            }
            observer.next(valido ? null : {mimeTypeInvalido: true})
            observer.complete()
        })
        leitor.readAsArrayBuffer(arquivo)
    })
    return observable
}