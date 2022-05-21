export class OrderDetailDto {
    orderId: number;
    quantity: number;
    unitPrice: number;
    productId: number;
    product?: string;
    category?: string;

    constructor(orderId: number, quantity: number, unitPrice: number, productId: number, product: string, category: string) {
        this.orderId = orderId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.productId = productId;
        this.product = product;
        this.category = category;
    }
}