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

namespace Coffee.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Manager")]
    [Tags("Quản lý lương")]
    public class PayrollsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PayrollsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Payrolls
        [HttpGet]
        [EndpointSummary("Lấy danh sách bảng lương")]
        public async Task<ActionResult<IEnumerable<Payroll>>> GetPayrolls()
        {
            return await _context.Payrolls.Include(p => p.User).ToListAsync();
        }

        // GET: api/Payrolls/5
        [HttpGet("{id}")]
        [EndpointSummary("Lấy chi tiết lương theo ID")]
        public async Task<ActionResult<Payroll>> GetPayroll(int id)
        {
            var payroll = await _context.Payrolls.Include(p => p.User).FirstOrDefaultAsync(m => m.Id == id);

            if (payroll == null)
            {
                return NotFound();
            }

            return payroll;
        }

        // PUT: api/Payrolls/5
        [HttpPut("{id}")]
        [EndpointSummary("Cập nhật thông tin lương")]
        public async Task<IActionResult> PutPayroll(int id, Payroll payroll)
        {
            if (id != payroll.Id)
            {
                return BadRequest();
            }

            _context.Entry(payroll).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayrollExists(id))
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

        // POST: api/Payrolls
        [HttpPost]
        [EndpointSummary("Tính lương mới cho nhân viên")]
        public async Task<ActionResult<Payroll>> PostPayroll(Payroll payroll)
        {
            _context.Payrolls.Add(payroll);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayroll", new { id = payroll.Id }, payroll);
        }

        // DELETE: api/Payrolls/5
        [HttpDelete("{id}")]
        [EndpointSummary("Xóa bảng lương")]
        public async Task<IActionResult> DeletePayroll(int id)
        {
            var payroll = await _context.Payrolls.FindAsync(id);
            if (payroll == null)
            {
                return NotFound();
            }

            _context.Payrolls.Remove(payroll);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayrollExists(int id)
        {
            return _context.Payrolls.Any(e => e.Id == id);
        }
    }
}
