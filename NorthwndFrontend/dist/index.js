"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseUrl = 'https://localhost:5001/';
$(function (_) {
    fillInitials();
});
function fillInitials() {
    $.getJSON("".concat(baseUrl, "Customers/initials"))
        .then(function (data) {
        data.forEach(function (x) {
            $('<p>').html(x).attr('id', x).on('click', function (_) { return loadCustomersStartingWith(x); }).appendTo('#customerInitials');
        });
    });
}
function loadCustomersStartingWith(initial) {
    $.getJSON("".concat(baseUrl, "Customers?initial=").concat(initial))
        .then(function (data) {
        $('#customerInitials')
            .children()
            .children()
            .empty();
        var customerList = $('<ul>').appendTo($("#".concat(initial)));
        data.forEach(function (x) {
            var customerElement = $('<li>')
                .html(x.companyName)
                .attr('data-id', x.customerId)
                .on('click', function (_) { return loadOrdersOfCustomer(x.companyName, x.customerId); })
                .appendTo(customerList);
            customerElement
                .on('mouseenter', function (_) { return customerElement.addClass('hovering'); })
                .on('mouseleave', function (_) { return customerElement.removeClass('hovering'); });
        });
    });
}
function loadOrdersOfCustomer(customerName, customerId) {
    $('#columnCustomerOrderHeader').html("Orders of ".concat(customerId));
    $.getJSON("".concat(baseUrl, "Orders?customerId=").concat(customerId))
        .then(function (data) {
        var table = $('#ordersTable');
        table.children().empty();
        createTableHeader(data[0], table);
        data.forEach(function (x) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var tableRow = $('<tr>')
                .append($('<td>').html((_b = (_a = x.orderDate) === null || _a === void 0 ? void 0 : _a.toString().split('T')[0]) !== null && _b !== void 0 ? _b : 'No order Date set'))
                .append($('<td>').html((_d = (_c = x.employee) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : 'No employee set'))
                .append($('<td>').html((_f = (_e = x.shippedDate) === null || _e === void 0 ? void 0 : _e.toString().split('T')[0]) !== null && _f !== void 0 ? _f : 'Not shipped yet'))
                .append($('<td>').html((_h = (_g = x.freight) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : 'No freight set'))
                .append($('<td>').html((_k = (_j = x.shipName) === null || _j === void 0 ? void 0 : _j.toString()) !== null && _k !== void 0 ? _k : 'No ship name set'));
            tableRow
                .on('click', function (_) { return loadOrderDetailsOfOrder(x); })
                .on('mouseenter', function (_) { return tableRow.addClass('hovering'); })
                .on('mouseleave', function (_) { return tableRow.removeClass('hovering'); })
                .appendTo(table);
        });
    });
}
function loadOrderDetailsOfOrder(order) {
    $('#columnOrderDetailsHeadline').val(order.orderId).html("Order Nr. ".concat(order.orderId));
    $.getJSON("".concat(baseUrl, "OrderDetails?orderId=").concat(order.orderId))
        .then(function (data) {
        var table = $('#orderDetailsTable');
        table.children().empty();
        if (data.length !== 0) {
            createTableHeader(data[0], table, true);
            data.forEach(function (x) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                $('<tr>')
                    .append($('<td>').html((_b = (_a = x.quantity) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'No quantity set'))
                    .append($('<td>').html((_d = (_c = x.product) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : 'No product set'))
                    .append($('<td>').html((_f = (_e = x.category) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : 'No category set'))
                    .append($('<td>').html((_h = (_g = x.unitPrice) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : 'No unitprice set'))
                    .append($('<td>').append($('<button>')
                    .addClass('bi-trash redButton')
                    .on('click', function (_) { return deleteOrderDetail(x, order); }))).appendTo(table);
            });
        }
        createTableFooter(data, table, order);
    });
}
function createTableHeader(ofElement, table, appendEmptyCell) {
    if (appendEmptyCell === void 0) { appendEmptyCell = false; }
    var headerRow = $('<tr>');
    var properties = Object.getOwnPropertyNames(ofElement)
        .map(function (x) { return "".concat(x.charAt(0).toUpperCase()).concat(x.slice(1)); });
    if (appendEmptyCell)
        properties.push(' ');
    properties.forEach(function (x) {
        if (x.indexOf('Id') === -1)
            $('<th>').html(x).appendTo(headerRow);
    });
    headerRow.appendTo(table);
}
function createTableFooter(data, table, order) {
    var sum = data.map(function (x) { return x.quantity * x.unitPrice; }).reduce(function (a, b) { return a + b; }, 0);
    $('<tr>')
        .append($('<td>').html('Total: ').attr('colspan', '3').addClass('total'))
        .append($('<td>').html(sum.toFixed(2))).appendTo(table)
        .append($('<td>').append($('<button>').addClass('bi-bag greenButton').on('click', function (_) { return showAddOrderDetail(order); })));
}
function showAddOrderDetail(order) {
    $.getJSON("".concat(baseUrl, "Products"))
        .then(function (data) {
        $('#addOrderDetail').removeAttr('hidden');
        data.forEach(function (x) {
            $('<option>').val(x.productId).html(x.productName).appendTo($('#addOrderDetailProduct'));
        });
        $('#addOrderDetailButton').on('click', function (_) { return onOrderDetailAddClick(order); });
    });
}
function deleteOrderDetail(orderDetailDto, orderDto) {
    $.ajax({
        method: 'DELETE',
        url: "".concat(baseUrl, "OrderDetails?productId=").concat(orderDetailDto.productId, "&orderId=").concat(orderDetailDto.orderId),
    }).then(function (_) { return loadOrderDetailsOfOrder(orderDto); })
        .fail(function (e) { return alert("Failed. ".concat(JSON.stringify(e))); });
}
function onOrderDetailAddClick(order) {
    var _a, _b, _c, _d;
    $('#addOrderDetail').attr('hidden', 'true');
    $('#addOrderDetailButton').off('click');
    var productId = +((_b = (_a = $('#addOrderDetailProduct :selected').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '-1');
    var quantity = +((_d = (_c = $('#addOrderDetailAmount').val()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '-1');
    if (productId === -1 || quantity === -1)
        return;
    var data = {
        orderId: order.orderId,
        quantity: quantity,
        productId: productId,
    };
    $.ajax({
        method: 'POST',
        url: "".concat(baseUrl, "OrderDetails"),
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).then(function (_) { return loadOrderDetailsOfOrder(order); })
        .fail(function (e) { return alert("Failed. ".concat(JSON.stringify(e))); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sT0FBTyxHQUFXLHlCQUF5QixDQUFDO0FBRWxELENBQUMsQ0FBQyxVQUFBLENBQUM7SUFDQyxZQUFZLEVBQUUsQ0FBQztBQUNuQixDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsWUFBWTtJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUcsT0FBTyx1QkFBb0IsQ0FBQztTQUNwQyxJQUFJLENBQUMsVUFBQyxJQUFjO1FBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQ1YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hILENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQsU0FBUyx5QkFBeUIsQ0FBQyxPQUFlO0lBQzlDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBRyxPQUFPLCtCQUFxQixPQUFPLENBQUUsQ0FBQztTQUM5QyxJQUFJLENBQUMsVUFBQyxJQUFtQjtRQUN0QixDQUFDLENBQUMsbUJBQW1CLENBQUM7YUFDakIsUUFBUSxFQUFFO2FBQ1YsUUFBUSxFQUFFO2FBQ1YsS0FBSyxFQUFFLENBQUM7UUFFYixJQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFJLE9BQU8sQ0FBRSxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBYztZ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