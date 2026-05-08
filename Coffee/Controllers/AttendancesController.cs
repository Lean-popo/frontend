using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coffee.Data;
using Coffee.Models;
using Microsoft.AspNetCore.Authorization;

using System.Security.Claims;

namespace Coffee.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Manager,Staff")]
    [Tags("Quản lý chấm công")]
    public class AttendancesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendancesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Attendances
        [HttpGet]
        [EndpointSummary("Lấy danh sách chấm công")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendances()
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var query = _context.Attendances.Include(a => a.User).Include(a => a.Shift).AsQueryable();

            if (userRole == "Staff")
            {
                if (int.TryParse(userId, out int id))
                {
                    query = query.Where(a => a.UserId == id);
                }
            }

            return await query.ToListAsync();
        }

        // GET: api/Attendances/5
        [HttpGet("{id}")]
        [EndpointSummary("Lấy chi tiết chấm công theo ID")]
        public async Task<ActionResult<Attendance>> GetAttendance(int id)
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var attendance = await _context.Attendances
                .Include(a => a.User)
                .Include(a => a.Shift)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (attendance == null)
            {
                return NotFound();
            }

            if (userRole == "Staff")
            {
                if (int.TryParse(userId, out int uId) && attendance.UserId != uId)
                {
                    return Forbid();
                }
            }

            return attendance;
        }

        // PUT: api/Attendances/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        [EndpointSummary("Cập nhật thông tin chấm công")]
        public async Task<IActionResult> PutAttendance(int id, Attendance attendance)
        {
            if (id != attendance.Id)
            {
                return BadRequest();
            }

            _context.Entry(attendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendanceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Attendances
        [HttpPost]
        [EndpointSummary("Tạo mới lượt chấm công")]
        public async Task<ActionResult<Attendance>> PostAttendance(Attendance attendance)
        {
            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendance", new { id = attendance.Id }, attendance);
        }

        // DELETE: api/Attendances/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        [EndpointSummary("Xóa lượt chấm công")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttendanceExists(int id)
        {
            return _context.Attendances.Any(e => e.Id == id);
        }
    }
}
