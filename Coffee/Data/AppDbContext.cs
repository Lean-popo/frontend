using Coffee.Models;
using Microsoft.EntityFrameworkCore;

namespace Coffee.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<ShiftAssignment> ShiftAssignments { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Payroll> Payrolls { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Config> Configs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure UserRole composite key
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            // Configure Username unique constraint
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Configure relationship between UserRole and Role/User
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, RoleName = "Admin", Description = "Full system access" },
                new Role { Id = 2, RoleName = "Manager", Description = "Manage shifts and employees" },
                new Role { Id = 3, RoleName = "Staff", Description = "Daily operations and attendance" }
            );

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", PasswordHash = "hashed_pw_admin", FullName = "System Admin", Phone = "0123456789", Status = UserStatus.Active, CreatedAt = new DateTime(2024, 1, 1) },
                new User { Id = 2, Username = "manager1", PasswordHash = "hashed_pw_manager", FullName = "Nguyen Van A", Phone = "0987654321", Status = UserStatus.Active, CreatedAt = new DateTime(2024, 1, 1) },
                new User { Id = 3, Username = "staff1", PasswordHash = "hashed_pw_staff", FullName = "Tran Thi B", Phone = "0111222333", Status = UserStatus.Active, CreatedAt = new DateTime(2024, 1, 1) }
            );

            // Seed UserRoles
            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { UserId = 1, RoleId = 1 },
                new UserRole { UserId = 2, RoleId = 2 },
                new UserRole { UserId = 3, RoleId = 3 }
            );

            // Seed Shifts
            modelBuilder.Entity<Shift>().HasData(
                new Shift { Id = 1, ShiftName = "Ca Sáng", StartTime = new TimeSpan(7, 0, 0), EndTime = new TimeSpan(12, 0, 0) },
                new Shift { Id = 2, ShiftName = "Ca Chiều", StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(17, 0, 0) },
                new Shift { Id = 3, ShiftName = "Ca Tối", StartTime = new TimeSpan(17, 0, 0), EndTime = new TimeSpan(22, 0, 0) }
            );

            // Seed ShiftAssignments
            modelBuilder.Entity<ShiftAssignment>().HasData(
                new ShiftAssignment { Id = 1, UserId = 3, ShiftId = 1, WorkDate = new DateTime(2024, 4, 17) },
                new ShiftAssignment { Id = 2, UserId = 2, ShiftId = 2, WorkDate = new DateTime(2024, 4, 17) }
            );

            // Seed Attendances
            modelBuilder.Entity<Attendance>().HasData(
                new Attendance { Id = 1, UserId = 3, ShiftId = 1, CheckIn = new DateTime(2024, 4, 17, 7, 5, 0), CheckOut = new DateTime(2024, 4, 17, 12, 0, 0), Status = AttendanceStatus.OnTime },
                new Attendance { Id = 2, UserId = 2, ShiftId = 2, CheckIn = new DateTime(2024, 4, 17, 12, 10, 0), Status = AttendanceStatus.Late }
            );

            // Seed Payrolls
            modelBuilder.Entity<Payroll>().HasData(
                new Payroll { Id = 1, UserId = 3, TotalHours = 160.5, SalaryAmount = 8000000m, Month = 3, Year = 2024 },
                new Payroll { Id = 2, UserId = 2, TotalHours = 170.0, SalaryAmount = 15000000m, Month = 3, Year = 2024 }
            );

            // Seed LeaveRequests
            modelBuilder.Entity<LeaveRequest>().HasData(
                new LeaveRequest { Id = 1, UserId = 3, LeaveDate = new DateTime(2024, 4, 20), Reason = "Family business", Status = LeaveRequestStatus.Pending },
                new LeaveRequest { Id = 2, UserId = 2, LeaveDate = new DateTime(2024, 4, 15), Reason = "Sick leave", Status = LeaveRequestStatus.Approved }
            );

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Coffee", Description = "Premium roasted beans" },
                new Category { Id = 2, Name = "Tea", Description = "Organic herbal teas" },
                new Category { Id = 3, Name = "Pastry", Description = "Freshly baked daily" }
            );

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Espresso", Description = "Strong and bold single shot", Price = 35000m, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=500&auto=format&fit=crop" },
                new Product { Id = 2, Name = "Cappuccino", Description = "Espresso with steamed milk foam", Price = 45000m, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=500&auto=format&fit=crop" },
                new Product { Id = 3, Name = "Matcha Latte", Description = "Premium Japanese green tea", Price = 55000m, CategoryId = 2, ImageUrl = "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=500&auto=format&fit=crop" },
                new Product { Id = 4, Name = "Butter Croissant", Description = "Flaky and buttery French pastry", Price = 30000m, CategoryId = 3, ImageUrl = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=500&auto=format&fit=crop" },
                new Product { Id = 5, Name = "Cold Brew", Description = "12-hour steeped signature coffee", Price = 50000m, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500&auto=format&fit=crop" }
            );

            // Seed Configs
            modelBuilder.Entity<Config>().HasData(
                new Config { Key = "ShopName", Value = "Antigravity Coffee", Description = "Tên quán cà phê hiển thị trên toàn hệ thống" }
            );
        }
    }
}
