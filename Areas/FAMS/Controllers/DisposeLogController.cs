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
    public class DisposeLogController : Controller
    {
        private readonly DisposalFacade _dispose = new DisposalFacade();
        // GET: FAMS/DisposeLog
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetDisposeLogs(CategoryLevel? level,  long? catid, string from, string end)
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
            List<DisposeLogDto> logs = _dispose.getDisposeLogs(level,catid, convertedfrom, convertedend);
            return Json(logs, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getAssetDisposalReport(CategoryLevel? level, string reportTypeId, long? catid, string from, string to)
        {
            List<DisposeLogDto> logs = new List<DisposeLogDto>();
            DateTime fromdate = DateTime.Now.Date;
            DateTime enddate = DateTime.Now.Date;
            DateTime convertedfrom = DateTime.Now.Date;
            DateTime convertedend = DateTime.Now.Date;
            var requiredDateConverted = DateTime.TryParseExact(from, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out fromdate);
            var requiredEndDateConverted = DateTime.TryParseExact(to, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out enddate);
            if (requiredDateConverted)
                convertedfrom = fromdate;
            if (requiredEndDateConverted)
                convertedend = enddate;
            var rptAssetDisposalReport = _dispose.getDisposeLogs(level,catid, convertedfrom, convertedend);


            LocalReport lr = new LocalReport();
            string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptAssetDisposalReport.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                return View("AssetDisposal");
            }

            ReportDataSource rd = new ReportDataSource("AssetDisposal", rptAssetDisposalReport);
            lr.DataSources.Add(rd);

            ReportParameter rp3 = new ReportParameter("FromDate", convertedfrom.ToString());
            ReportParameter rp4 = new ReportParameter("ToDate", convertedend.ToString());

            lr.SetParameters(new ReportParameter[] { rp3, rp4 });


            string reportType = reportTypeId;
            string mimeType;
            string encoding;
            string fileNameExtension;



            string deviceInfo =

                  "<DeviceInfo>" +
                "  <OutputFormat>EMF</OutputFormat>" +
                "  <PageWidth>11in</PageWidth>" +
                "  <PageHeight>10in</PageHeight>" +
                "  <MarginTop>0.25in</MarginTop>" +
                "  <MarginLeft>0.25in</MarginLeft>" +
                "  <MarginRight>0.25in</MarginRight>" +
                "  <MarginBottom>0.25in</MarginBottom>" +
                "</DeviceInfo>";
            Warning[] warnings;
            string[] streams;

            var renderedBytes = lr.Render(
                reportType,
                deviceInfo,
                out mimeType,
                out encoding,
                out fileNameExtension,
                out streams,
                out warnings
                );


            return File(renderedBytes, mimeType);
        }
    }
}