using System.ComponentModel.DataAnnotations;

namespace Coffee.Models
{
    public class ShiftAssignment
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public int ShiftId { get; set; }
        public Shift? Shift { get; set; }

        public DateTime WorkDate { get; set; }
    }
}
