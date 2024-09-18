
using Finix.FAMS.Dto;
using Finix.FAMS.DTO;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using Finix.FAMS.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class AssetsController : Controller
    {
        private readonly AssetFacade _assets = new AssetFacade();
        private readonly EnumFacade _enams = new EnumFacade();
        private readonly SupplierFacade _suppliers = new SupplierFacade();
        private readonly EmployeeFacade _employee = new EmployeeFacade();
        // GET: FAMS/Assets
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AssetList(string sortOrder, string currentFilter, string searchString, string fromDate, string toDate, long? category, int page = 1, int pageSize = 20)
        {
            DateTime FromDate = DateTime.MinValue;
            DateTime ToDate = DateTime.MaxValue;
            DateTime.TryParseExact(fromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out FromDate);
            var toDateConverted = DateTime.TryParseExact(toDate, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out ToDate);
            if (!toDateConverted)
                ToDate = DateTime.MaxValue;

            ViewBag.SearchString = searchString;
            ViewBag.CurrentSort = sortOrder;
            if (category != null)
                ViewBag.Category = (long)category;
            ViewBag.Categories = _assets.getSecondaryCategory();
            ViewBag.FromDateText = fromDate;
            ViewBag.ToDateText = toDate;
            var assets = _assets.AssetList(FromDate, ToDate, pageSize, page, searchString, category);
            return View(assets);
        }

        public JsonResult SaveAsset(AssetDto dto)
        {

            try
            {
                    dto.AssetCode = _assets.GetLatestCode(dto);
                    var result = _assets.SaveAsset(dto, SessionHelper.UserProfile.UserId, (long)SessionHelper.UserProfile.SelectedCompanyId);
                    return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult GetAssetInformation(long id)
        {
            var result = _assets.GetAssetInformation(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSupplierList()
        {
           // List<EnumDto> list = _enams.GetSuppliers();
            List<SupplierDto> suppliers = _suppliers.GetSupplierList();
            return Json(suppliers, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEmployeeList()
        {
           // List<EnumDto> list = _enams.GetEmployees();
            List<EmpBasicInfoDto> Employees = _employee.GetEmployeeList("");
            return Json(Employees, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDepreciationModels()
        {
            List<EnumDto> list = _enams.GetDepreciationModel();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetServiceTypes()
        {
            List<EnumDto> list = _enams.GetServiceType();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAssets()
        {
            var data = _assets.GetAssetsByCategory(CategoryLevel.Secondary,null);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult GetAllCategories()
        {
            var data = _assets.getSecondaryCategory();
            return Json(data, JsonRequestBehavior.AllowGet);
        }

    }
}