namespace NorthwndBackend.Controllers;

[Route("[controller]")]
[ApiController]
public class CustomersController
{
    private readonly NORTHWNDContext _db;
    public CustomersController(NORTHWNDContext db) => _db = db;

    [HttpGet]
    public IEnumerable<CustomerDto> Customers(string initial)
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy HH:mm:ss} GetCustomers startingWith {initial}");
        return _db.Customers
            .Where(x => x.CompanyName.StartsWith(initial))
            .Select(x => new CustomerDto().CopyPropertiesFrom(x));
    }
    
    [HttpGet("initials")]
    public IEnumerable<string> GetCustomerInitials()
    {
        Console.WriteLine($"{DateTime.Now:dd.MM.yyyy hh:mm:ss} GetCustomerInitials");
        return _db.Customers
            .Select(x => x.CompanyName[0].ToString())
            .ToHashSet()
            .OrderBy(x => x);
    }
}