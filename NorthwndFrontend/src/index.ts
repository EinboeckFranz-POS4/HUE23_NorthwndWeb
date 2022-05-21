import {CustomerDto} from "./DataFetcher";

const baseUrl: string = 'https://localhost:5001/';

$(_ => {
    fillAlphabet();
});

function getCustomer(char: string): void {
    $.getJSON(`${baseUrl}customers?initial=${char}`)
        .then((data: CustomerDto[]) => {
            console.table(data)
        });
}

function fillAlphabet() {
    const alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < alphabet.length; i++) {
        $('<p>').html(alphabet.charAt(i))
            .on('click', x => console.log(x))
            .appendTo('#sth')
    }
}