using Finix.FAMS.Dto;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class DepreciationController : Controller
    {
        private readonly DepreciationFacade _depreciation = new DepreciationFacade();
        // GET: FAMS/Depreciation
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult SaveDepreciation(long assetid)
        {
            try
            {
                
                var result = _depreciation.SaveDepreciationLog(assetid, SessionHelper.UserProfile.UserId, PointOfDepreciation.Manual,0, (long)SessionHelper.UserProfile.SelectedCompanyId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult SaveSelectedDepreciation(List<long> SelectedAssets)
        {
            var result = _depreciation.SaveSelectedDepreciation(SelectedAssets, SessionHelper.UserProfile.UserId, PointOfDepreciation.Manual, (long)SessionHelper.UserProfile.SelectedCompanyId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDepreciationLogs()
        {
            // List<EnumDto> list = _enams.GetSuppliers();
            List<DepreciationLogDto> logs = _depreciation.GetDepreciationLog();
            return Json(logs, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getFilturedAssets(CategoryLevel? level, long? catid, double? resval, string from, string end, string code)
        {
            DateTime fromdate = DateTime.Now.Date;
            DateTime enddate = DateTime.Now.Date;
            DateTime convertedfrom = DateTime.Now.Date;
            DateTime convertedend = DateTime.Now.Date;
            var requiredDateConverted = DateTime.TryParseExact(from, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out fromdate);
            var requiredEndDateConverted = DateTime.TryParseExact(end, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out enddate);
            if (requiredDateConverted)
                convertedfrom = fromdate;
            if (requiredEndDateConverted)
                convertedend = enddate;
            List<Asset_DepreciationLogDto> assets = _depreciation.GetFilturedAssets(level,catid,resval, convertedfrom, convertedend,code);
            return Json(assets, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllCategoriesByLevel(CategoryLevel? level)
        {
            List<CategoryDto> cats = _depreciation.GetCategoriesByLevel(level);
            return Json(cats, JsonRequestBehavior.AllowGet);
        }
    }
}