namespace NorthwndBackend.Controllers;

[Route("[controller]")]
[ApiController]
public class OrderDetailsController
{
    private readonly NORTHWNDContext _db;
    public OrderDetailsController(NORTHWNDContext db) => _db = db;

    [HttpGet]
    public List<OrderDetailDto> GetOrderDetails(int orderId)
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy hh:mm:ss} GetOrderDtails {orderId}");
        return _db.OrderDetails.Where(x => x.OrderId == orderId)
            .Select(x => new 
                {
                    x.OrderId,
                    x.Quantity,
                    x.Product.ProductName,
                    x.Product.Category!.CategoryName,
                    x.UnitPrice
                }
            ).Select(x => new OrderDetailDto().CopyPropertiesFrom(x))
            .ToList();
    }
}