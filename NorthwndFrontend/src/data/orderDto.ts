export class OrderDto {
    orderId: number;
    orderDate?: Date;
    employee?: string;
    shippedDate?: Date;
    freight?: number;
    shipName?: string;

    constructor(orderId: number, orderDate?: Date, employee?: string, shippedDate?: Date, freight?: number, shipName?: string) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.employee = employee;
        this.shippedDate = shippedDate;
        this.freight = freight;
        this.shipName = shipName;
    }
}