namespace NorthwndBackend.Controllers;

[Route("[controller]")]
[ApiController]
public class ProductsController
{
    private readonly NORTHWNDContext _db;
    
    public ProductsController(NORTHWNDContext db) => _db = db;

    [HttpGet]
    public IEnumerable<ProductDto> Products()
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy HH:mm:ss} GetProducts");
        return _db.Products
            .Select(x => new ProductDto().CopyPropertiesFrom(x));
    }
}