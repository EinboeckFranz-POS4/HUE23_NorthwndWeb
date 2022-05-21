namespace NorthwndBackend.Controllers;

[Route("[controller]")]
[ApiController]
public class OrdersController
{
    private readonly NORTHWNDContext _db;
    public OrdersController(NORTHWNDContext db) => _db = db;

    [HttpGet]
    public List<OrderDto> GetOrdersOfCustomer(string customerId)
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy hh:mm:ss} GetOrdersOfCustomer {customerId}");
        return _db.Orders.Where(x => x.CustomerId == customerId)
            .Select(x => new 
                {
                    x.OrderId,
                    x.OrderDate,
                    Employee = $"{x.Employee!.LastName} {x.Employee!.FirstName}",
                    x.ShippedDate,
                    x.Freight,
                    x.ShipName
                }
            ).Select(x => new OrderDto().CopyPropertiesFrom(x))
            .ToList();
    }
}