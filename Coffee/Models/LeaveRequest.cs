using System.ComponentModel.DataAnnotations;

namespace Coffee.Models
{
    public class LeaveRequest
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public DateTime LeaveDate { get; set; }

        public string? Reason { get; set; }

        public LeaveRequestStatus Status { get; set; }
    }
}
