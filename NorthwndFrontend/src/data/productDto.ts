export class ProductDto {
    productId: number;
    productName: string;

    constructor(productId: number, productName: string) {
        this.productId = productId;
        this.productName = productName;
    }
}