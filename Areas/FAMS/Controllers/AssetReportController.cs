using Finix.Auth.Service;
using Finix.FAMS.Dto;
using Finix.FAMS.DTO;
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
    public class AssetReportController : Controller
    {
        private readonly GenService _service = new GenService();
        private readonly AssetReportFacade _assetsreports = new AssetReportFacade();
        private readonly EnumFacade _enams = new EnumFacade();
        private readonly AssetFacade _assets = new AssetFacade();
        // private readonly ReportAccountFacade _reportAccountFacade;
        // GET: FAMS/AssetReport
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAssetsByCategory(CategoryLevel? level, long? catid, string fromDate, string toDate)
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
            var data = _assetsreports.GetFilturedAssets(level,catid, fromdate, enddate);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getReport(CategoryLevel? level, string reportTypeId, long ?catid, string groupby, string fromDate, string toDate)
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
            var  rptAssetList = _assetsreports.GetFilturedAssets(level,catid, fromdate, enddate);
            

            LocalReport lr = new LocalReport();
            //string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptAssetList.rdlc");
            string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptAssetbyCategory.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                //ViewBag.CompanyId = SessionHelper.UserProfile.SelectedCompanyId;
                return View("AssetsReport");
            }

            //ReportDataSource rd = new ReportDataSource("Assets", rptAssetList);
            ReportDataSource rd = new ReportDataSource("AssetsGroupBy", rptAssetList);
            ReportParameter rp3;
            //lr.DataSources.Add(rd);
            if (groupby != "")
                rp3 = new ReportParameter("Groupby", groupby);
            else
                rp3 = new ReportParameter("Groupby", "CategoryName");
            
            lr.DataSources.Add(rd);

            ReportParameter rp1 = new ReportParameter("FromDate", fromdate.ToString());
            ReportParameter rp2 = new ReportParameter("ToDate", enddate.ToString());

            lr.SetParameters(new ReportParameter[] { rp1, rp2,rp3 });
            //lr.SetParameters(new ReportParameter[] { rp1 });


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

        public JsonResult getReportGroupby()
        {
            List<EnumDto> list = _enams.GetReportGroupby();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}