export function toBRL(value:any):string {
    try{
        return "R$" + value.toFixed(2).replace('.',',');
    }catch(e){
        return toBRL(parseFloat(value));
    }
}
export function cotas(value:number):string {
    return ''
}

