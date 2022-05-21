export class CustomerDto {
    customerId: string;
    companyName: string;

    constructor(customerId: string, companyName: string) {
        this.customerId = customerId;
        this.companyName = companyName;
    }
}