namespace NorthwndBackend.Controllers;

[Route("[controller]")]
[ApiController]
public class CustomersController
{
    private readonly NORTHWNDContext _db;
    public CustomersController(NORTHWNDContext db) => _db = db;

    [HttpGet]
    public List<CustomerDto> Customers(string initial)
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy hh:mm:ss} GetCustomers startingWith {initial}");
        return _db.Customers
            .Where(x => x.CompanyName.StartsWith(initial))
            .Select(x => new CustomerDto().CopyPropertiesFrom(x))
            .ToList();
    }
}