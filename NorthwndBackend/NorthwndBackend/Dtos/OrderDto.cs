namespace NorthwndBackend.Dtos;

public class OrderDto
{
    public int OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public string? Employee { get; set; }
    public DateTime? ShippedDate { get; set; }
    public decimal? Freight { get; set; }
    public string? ShipName { get; set; }
}