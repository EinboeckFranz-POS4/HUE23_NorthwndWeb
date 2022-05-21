namespace NorthwndBackend.Dtos;

public class OrderDetailDto
{
    public int OrderId { get; set; }
    public short Quantity { get; set; }
    public string Product { get; set; }
    public string Category { get; set; }
    public decimal UnitPrice { get; set; }
}