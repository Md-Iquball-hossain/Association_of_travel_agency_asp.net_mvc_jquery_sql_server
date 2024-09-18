using Finix.FAMS.Dto;
using Finix.FAMS.Facade;
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
    public class TransferReportSummaryController : Controller
    {
        private readonly TransferReportFacade _tranreports = new TransferReportFacade();
        // GET: FAMS/TransferReportSummary
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult TransferSummary(string from, string end, long? srcid, long? destid)
        {
            List<TransferSummaryDto> results = new List<TransferSummaryDto>();
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
            results = _tranreports.GetTransferSummary(fromdate, enddate, srcid, destid);
            return Json(results, JsonRequestBehavior.AllowGet);
        }

        public ActionResult TransferSummaryReport(string reportTypeId, string groupby, string fromDate, string toDate, long? srcid, long? destid)
        {
            DateTime fromdate = DateTime.Now.Date;
            DateTime enddate = DateTime.Now.Date;
            DateTime convertedfrom = DateTime.Now.Date;
            DateTime convertedend = DateTime.Now.Date;
            var requiredDateConverted = DateTime.TryParseExact(fromDate, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out fromdate);
            var requiredEndDateConverted = DateTime.TryParseExact(toDate, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out enddate);
            if (requiredDateConverted)
                convertedfrom = fromdate;
            if (requiredEndDateConverted)
                convertedend = enddate;
            var rptTransferLog = _tranreports.GetTransferSummary(fromdate, enddate, srcid, destid);


            LocalReport lr = new LocalReport();
            //string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptAssetList.rdlc");
            string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptTransferLogSummary.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                return View("TransferReport");
            }


            ReportDataSource rd = new ReportDataSource("TransferSummary", rptTransferLog);
            lr.DataSources.Add(rd);

            ReportParameter rp1 = new ReportParameter("FromDate", fromdate.ToString());
            ReportParameter rp2 = new ReportParameter("ToDate", enddate.ToString());

            lr.SetParameters(new ReportParameter[] { rp1, rp2 });


            string reportType = reportTypeId;
            string mimeType;
            string encoding;
            string fileNameExtension;



            string deviceInfo =

                  "<DeviceInfo>" +
                "  <OutputFormat>EMF</OutputFormat>" +
                "  <PageWidth>8.2in</PageWidth>" +
                "  <PageHeight>11.6in</PageHeight>" +
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