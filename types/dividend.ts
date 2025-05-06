import {Stock} from './stock';
export interface Dividend{
    stock:Stock;
    payout:number;
    yield: number;
    paydate: Date;
    //type:'DIVIDENDO'| 'JCP';
    //status: 'PAGO'| 'AGENDADO';
}