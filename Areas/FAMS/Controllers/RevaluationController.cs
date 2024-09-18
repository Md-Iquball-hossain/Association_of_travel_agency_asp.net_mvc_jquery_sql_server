using Finix.FAMS.Dto;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class RevaluationController : Controller
    {
        private readonly DepreciationFacade _depreciation = new DepreciationFacade();
        // GET: FAMS/Revaluation
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult SaveRevaluation(long assetid, double surplus)
        {
            try
            {
                var result = _depreciation.SaveDepreciationLog(assetid, SessionHelper.UserProfile.UserId, PointOfDepreciation.Revaluation,surplus, (long)SessionHelper.UserProfile.SelectedCompanyId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult GetAssetsLogByCategory(long catid)
        {
            var data = _depreciation.GetAssetsLogByCategory(catid);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllAssetsLog()
        {
            var data = _depreciation.GetAssetsLogByCategory(0);
            return Json(data, JsonRequestBehavior.AllowGet);
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
            List<Asset_DepreciationLogDto> assets = _depreciation.GetFilturedAssets(level,catid, resval, convertedfrom, convertedend, code);
            return Json(assets, JsonRequestBehavior.AllowGet);
        }
    }
}