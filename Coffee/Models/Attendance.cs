using System.ComponentModel.DataAnnotations;

namespace Coffee.Models
{
    public class Attendance
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public int ShiftId { get; set; }
        public Shift? Shift { get; set; }

        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }

        public AttendanceStatus Status { get; set; }
    }
}
