using NuGet.Protocol;

namespace NorthwndBackend.Controllers;

[Route("[controller]")]
[ApiController]
public class OrderDetailsController
{
    private readonly NORTHWNDContext _db;
    public OrderDetailsController(NORTHWNDContext db) => _db = db;

    [HttpGet]
    public IEnumerable<OrderDetailDto> GetOrderDetails(int orderId)
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy HH:mm:ss} GetOrderDtails {orderId}");
        return _db.OrderDetails
            .Where(x => x.OrderId == orderId)
            .Select(x => new 
                {
                    x.OrderId,
                    x.Quantity,
                    x.ProductId,
                    Product = x.Product.ProductName,
                    Category = x.Product.Category!.CategoryName,
                    x.UnitPrice
                }
            ).Select(x => new OrderDetailDto().CopyPropertiesFrom(x));
    }

    [HttpDelete]
    public string DeleteOrderDetail(int productId, int orderId)
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy HH:mm:ss} Delete OrderDetail with ProductId {productId} and OrderId {orderId}");
        var asOrderDetail = _db.OrderDetails
            .FirstOrDefault(x => x.OrderId == orderId && x.ProductId == productId);
        if (asOrderDetail == null)
            throw new Exception("No suitable OrderDetail-Object found.");
        _db.OrderDetails.Remove(asOrderDetail);
        _db.SaveChanges();
        return "Success".ToJson();
    }
    
    [HttpPost]
    public string AddOrderDetail([FromBody] OrderDetailReplayDto toCreate)
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy HH:mm:ss} Create OrderDetail {toCreate.ToJson()}");
        
        var temp = _db.OrderDetails.SingleOrDefault(x => toCreate.OrderId == x.OrderId && toCreate.ProductId == x.ProductId);
        if(temp != null) {
            temp.Quantity += toCreate.Quantity;
            _db.SaveChanges();
            return "Success".ToJson();
        }

        var unitPrice = _db.Products.First(x => x.ProductId == toCreate.ProductId).UnitPrice ?? 0;
        var asDatabaseObject = new OrderDetail
        {
            Discount = 0,
            OrderId = toCreate.OrderId,
            ProductId = toCreate.ProductId,
            Quantity = toCreate.Quantity,
            UnitPrice = unitPrice,
        };
        
        _db.OrderDetails.Add(asDatabaseObject);
        _db.SaveChanges();
        
        return "Success".ToJson();
    }
}