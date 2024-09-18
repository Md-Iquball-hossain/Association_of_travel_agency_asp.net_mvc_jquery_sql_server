using Finix.FAMS.Dto;
using Finix.FAMS.Facade;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class SupplierController : BaseController
    {
        // GET: FAMS/Supplier
        private readonly SupplierFacade _Supplier = new SupplierFacade();
        private readonly EnumFacade _enum = new EnumFacade();
        // GET: Supplier
        public ActionResult Index()

        {
            var listSupplier = _Supplier.GetSupplierList();

            return View(listSupplier);
        }

        public ActionResult SupplierList(string sortOrder, string currentFilter, string searchString, string fromDate, string toDate, int page = 1, int pageSize = 20)
        {
            DateTime FromDate = DateTime.MinValue;
            DateTime ToDate = DateTime.MaxValue;
            DateTime.TryParseExact(fromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out FromDate);
            var toDateConverted = DateTime.TryParseExact(toDate, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out ToDate);
            if (!toDateConverted)
                ToDate = DateTime.MaxValue;

            ViewBag.SearchString = searchString;
            ViewBag.CurrentSort = sortOrder;
            ViewBag.FromDateText = fromDate;
            ViewBag.ToDateText = toDate;
            var assets = _Supplier.SupplierList(FromDate, ToDate, pageSize, page, searchString);
            return View(assets);
        }
        //
        // GET: /Supplier/Create
        public ActionResult Create()
        {
            var Supplier = new SupplierDto();
            return View(Supplier);
        }

        public JsonResult SaveSupplier(SupplierDto dto)
        {
            try
            {
                var result = _Supplier.SaveSupplier(dto, SessionHelper.UserProfile.UserId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }

        }

        //GET: /Supplier/Edit/5
        public ActionResult Edit(long id)
        {
            var Supplier = _Supplier.GetSupplierById(id);
            return View(Supplier);
        }

        public JsonResult GetSupplierById(long id)
        {
            var Supplier = _Supplier.GetSupplierById(id);
            return Json(Supplier, JsonRequestBehavior.AllowGet);
        }

        // POST: /Supplier/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        
        [AcceptVerbs(HttpVerbs.Get)]
        public JsonResult SuppliersList()
        {
            var Suppliers = _Supplier.GetSupplierList();
            return Json(Suppliers, JsonRequestBehavior.AllowGet);
        }
    }
}