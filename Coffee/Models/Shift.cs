using System.ComponentModel.DataAnnotations;

namespace Coffee.Models
{
    public class Shift
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ShiftName { get; set; } = string.Empty;

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public ICollection<ShiftAssignment> ShiftAssignments { get; set; } = new List<ShiftAssignment>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}
