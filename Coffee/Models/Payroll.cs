using System.ComponentModel.DataAnnotations;

namespace Coffee.Models
{
    public class Payroll
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public double TotalHours { get; set; }

        public decimal SalaryAmount { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }
    }
}
