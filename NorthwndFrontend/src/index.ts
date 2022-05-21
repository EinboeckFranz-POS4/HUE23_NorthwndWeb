import {CustomerDto, OrderDto, OrderDetailDto, ProductDto} from './models';

const baseUrl: string = 'https://localhost:5001/';

$(_ => {
    fillInitials();
});

function fillInitials() {
    $.getJSON(`${baseUrl}Customers/initials`)
        .then((data: string[]) => {
            data.forEach(x => {
                $('<p>').html(x).attr('id', x).on('click', _ => loadCustomersStartingWith(x)).appendTo('#customerInitials');
            });
        });
}

function loadCustomersStartingWith(initial: string) {
    $.getJSON(`${baseUrl}Customers?initial=${initial}`)
        .then((data: CustomerDto[]) => {
            $('#customerInitials')
                .children()
                .children()
                .empty();

            const customerList = $('<ul>').appendTo($(`#${initial}`));
            data.forEach((x: CustomerDto) => {
                const customerElement = $('<li>')
                    .html(x.companyName)
                    .attr('data-id', x.customerId)
                    .on('click', _ => loadOrdersOfCustomer(x.companyName, x.customerId))
                    .appendTo(customerList);

                customerElement
                    .on('mouseenter', _ => customerElement.addClass('hovering'))
                    .on('mouseleave', _ => customerElement.removeClass('hovering'));
            });
        });
}

function loadOrdersOfCustomer(customerName: string, customerId: string) {
    $('#columnCustomerOrderHeader').html(`Orders of ${customerId}`);

    $.getJSON(`${baseUrl}Orders?customerId=${customerId}`)
        .then((data: OrderDto[]) => {
            const table = $('#ordersTable')

            table.children().empty();
            createTableHeader(data[0], table);
            data.forEach((x: OrderDto) => {
                const tableRow = $('<tr>')
                    .append($('<td>').html(x.orderDate?.toString().split('T')[0] ?? 'No order Date set'))
                    .append($('<td>').html(x.employee?.toString() ?? 'No employee set'))
                    .append($('<td>').html(x.shippedDate?.toString().split('T')[0] ?? 'Not shipped yet'))
                    .append($('<td>').html(x.freight?.toString() ?? 'No freight set'))
                    .append($('<td>').html(x.shipName?.toString() ?? 'No ship name set'));

                tableRow
                    .on('click', _ => loadOrderDetailsOfOrder(x))
                    .on('mouseenter', _ => tableRow.addClass('hovering'))
                    .on('mouseleave', _ => tableRow.removeClass('hovering'))
                    .appendTo(table);
            });
        });
}

function loadOrderDetailsOfOrder(order: OrderDto) {
    $('#columnOrderDetailsHeadline').val(order.orderId).html(`Order Nr. ${order.orderId}`);
    $.getJSON(`${baseUrl}OrderDetails?orderId=${order.orderId}`)
        .then((data: OrderDetailDto[]) => {
            const table = $('#orderDetailsTable')

            table.children().empty();
            if(data.length !== 0) {
                createTableHeader(data[0], table, true)
                data.forEach((x: OrderDetailDto) => {
                    $('<tr>')
                        .append($('<td>').html(x.quantity?.toString() ?? 'No quantity set'))
                        .append($('<td>').html(x.product?.toString() ?? 'No product set'))
                        .append($('<td>').html(x.category?.toString()?? 'No category set'))
                        .append($('<td>').html(x.unitPrice?.toString() ?? 'No unitprice set'))
                        .append($('<td>').append(
                            $('<button>')
                                .addClass('bi-trash redButton')
                                .on('click', _ => deleteOrderDetail(x, order)))
                        ).appendTo(table);
                });
            }
            createTableFooter(data, table, order);
        });
}

function createTableHeader(ofElement: object, table: JQuery, appendEmptyCell: boolean = false) {
    const headerRow = $('<tr>');
    const properties = Object.getOwnPropertyNames(ofElement)
        .map(x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`);

    if(appendEmptyCell)
        properties.push(' ');

    properties.forEach(x => {
        if(x.indexOf('Id') === -1)
            $('<th>').html(x).appendTo(headerRow)
    });
    headerRow.appendTo(table);
}

function createTableFooter(data: OrderDetailDto[], table: JQuery, order: OrderDto) {
    const sum = data.map(x => x.quantity * x.unitPrice).reduce((a, b) => a + b, 0);
    $('<tr>')
        .append($('<td>').html('Total: ').attr('colspan', '3').addClass('total'))
        .append($('<td>').html(sum.toFixed(2))).appendTo(table)
        .append($('<td>').append($('<button>').addClass('bi-bag greenButton').on('click', _ => showAddOrderDetail(order))));
}

function showAddOrderDetail(order: OrderDto) {
    $.getJSON(`${baseUrl}Products`)
        .then((data: ProductDto[]) => {
            $('#addOrderDetail').removeAttr('hidden');
            data.forEach(x => {
                $('<option>').val(x.productId).html(x.productName).appendTo($('#addOrderDetailProduct'));
            });
            $('#addOrderDetailButton').on('click', _ => onOrderDetailAddClick(order))
        });
}

function deleteOrderDetail(orderDetailDto: OrderDetailDto, orderDto: OrderDto) {
    $.ajax({
        method: 'DELETE',
        url: `${baseUrl}OrderDetails?productId=${orderDetailDto.productId}&orderId=${orderDetailDto.orderId}`,
    }).then(_ => loadOrderDetailsOfOrder(orderDto))
        .fail(e => alert(`Failed. ${JSON.stringify(e)}`));
}

function onOrderDetailAddClick(order: OrderDto) {
    $('#addOrderDetail').attr('hidden', 'true');
    $('#addOrderDetailButton').off('click');
    const productId =  +($('#addOrderDetailProduct :selected').val()?.toString() ?? '-1');
    const quantity = +($('#addOrderDetailAmount').val()?.toString() ?? '-1');

    if(productId === -1 || quantity === -1)
        return;

    const data = {
        orderId: order.orderId,
        quantity: quantity,
        productId: productId,
    };

    $.ajax({
        method: 'POST',
        url: `${baseUrl}OrderDetails`,
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).then(_ => loadOrderDetailsOfOrder(order))
        .fail(e => alert(`Failed. ${JSON.stringify(e)}`));
}