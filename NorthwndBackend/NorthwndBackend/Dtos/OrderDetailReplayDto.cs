namespace NorthwndBackend.Dtos;

public class OrderDetailReplayDto
{
    public int OrderId { get; set; }
    public short Quantity { get; set; }
    public int ProductId { get; set; }
}