using Finix.FAMS.Dto;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class AssetDisposeController : Controller
    {
        private readonly DisposalFacade _dispose = new DisposalFacade();
        private readonly DepreciationFacade _depreciation = new DepreciationFacade();
        // GET: FAMS/AssetDispose
        public ActionResult AssetDisposal()
        {
            return View();
        }
        //long assetid, double? resale, string buyer
        public JsonResult SaveDispose(DisposeLogDto dto)
        {
            var result = _dispose.SaveDisposeLog(dto.AssetID, SessionHelper.UserProfile.UserId, PointOfDepreciation.Dispose, dto.ResaleValue, dto.ResaleTo);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult GetDepreciationLogs(long? catid)
        //{
        //    List<Asset_DepreciationLogDto> logs = _dispose.AssetDepreciationLog(catid,DateTime.Today.AddDays(-60),DateTime.Today);
        //    return Json(logs, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult getFilturedAssets(CategoryLevel? level,long? catid, double? resval, string from, string end, string code)
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
            List<Asset_DepreciationLogDto> assets = _depreciation.GetFilturedAssets(level, catid, resval, convertedfrom, convertedend, code);
            return Json(assets, JsonRequestBehavior.AllowGet);
        }

       
        public JsonResult DisposeSelectedAssets(List<long> SelectedAssets)
        {
            var result = _dispose.SaveSelectedDispose(SelectedAssets, SessionHelper.UserProfile.UserId, PointOfDepreciation.Dispose);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        

    }
}