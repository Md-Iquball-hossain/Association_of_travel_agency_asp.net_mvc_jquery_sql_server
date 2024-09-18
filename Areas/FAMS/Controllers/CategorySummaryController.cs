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
    public class CategorySummaryController : Controller
    {
        // GET: FAMS/CategorySummary
        private readonly DepreciationFacade _depreciation = new DepreciationFacade();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult getGroupSummary(CategoryLevel? level, long? catid, string from, string to)
        {
            List<CategorySummaryDto> logs = new List<CategorySummaryDto>();
            DateTime fromdate = DateTime.Now.Date;
            DateTime enddate = DateTime.Now.Date;
            DateTime convertedfrom = DateTime.Now.Date;
            DateTime convertedend = DateTime.Now.Date;
            var requiredDateConverted = DateTime.TryParseExact(from, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out fromdate);
            var requiredEndDateConverted = DateTime.TryParseExact(to, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out enddate);
            if (requiredDateConverted)
                convertedfrom  = fromdate;
            if (requiredEndDateConverted)
                convertedend = enddate;
            
            if(level==CategoryLevel.Primary)
                logs = _depreciation.CalculatePrimaryCategrorySummary(catid, convertedfrom, convertedend);
            else
                logs = _depreciation.CalculateCategrorySummaryNew(catid, convertedfrom, convertedend);
            return Json(logs, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getDetailsGroupSummary(long? catid, string from, string to)
        {
            List<Asset_DepreciationLogDto> logs = new List<Asset_DepreciationLogDto>(); //Asset & Logs Combined Dto
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
            
            logs = _depreciation.DetailsGroupSummary(catid, convertedfrom, convertedend);
            return Json(logs, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllCategories()
        {
            var categoories = _depreciation.GetCategoryList();
            return Json(categoories, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getGroupStock(CategoryLevel? level, long? catid, string from, string to)
        {
            List<AssetStockDto> logs = new List<AssetStockDto>();
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
            
            logs = _depreciation.CalculateCategroryStock(level, catid, convertedfrom, convertedend);
            return Json(logs, JsonRequestBehavior.AllowGet);
        }


        public ActionResult getReport(string reportTypeId, CategoryLevel? level , long? catid, string from, string to)
        {
            List<CategorySummaryDto> logs = new List<CategorySummaryDto>();
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
            if (level == CategoryLevel.Primary)
                logs = _depreciation.CalculatePrimaryCategrorySummary(catid, convertedfrom, convertedend);
            else
                logs = _depreciation.CalculateCategrorySummaryNew(catid, convertedfrom, convertedend);
           // var rptCategorySummary = _depreciation.CalculateCategrorySummaryNew(level,catid, convertedfrom, convertedend);


            LocalReport lr = new LocalReport();
            //string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptAssetList.rdlc");
            string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptCategorySummary.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                //ViewBag.CompanyId = SessionHelper.UserProfile.SelectedCompanyId;
                return View("CategorySummary");
            }

            //ReportDataSource rd = new ReportDataSource("Assets", rptAssetList);
            ReportDataSource rd = new ReportDataSource("CategorySummary", logs);
            
            lr.DataSources.Add(rd);
            //lr.SetParameters(new ReportParameter[] { rp1 });

            ReportParameter rp1 = new ReportParameter("FromDate",convertedfrom.ToString());
            ReportParameter rp2 = new ReportParameter("ToDate", convertedend.ToString());

            lr.SetParameters(new ReportParameter[] { rp1, rp2 });


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
        public ActionResult getDetailedReport(string reportTypeId, long? catid, string from, string to)
        {
            List<Asset_DepreciationLogDto> logs = new List<Asset_DepreciationLogDto>();
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
            var rptCategoryDetailesSummary = _depreciation.DetailsGroupSummary(catid, convertedfrom, convertedend);


            LocalReport lr = new LocalReport();
            string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptCategoryDetailedSummary.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                return View("CategorySummary");
            }
            
            ReportDataSource rd = new ReportDataSource("CategoryDetailedSummary", rptCategoryDetailesSummary);
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


        public ActionResult getAssetStockReport(CategoryLevel? level, string reportTypeId, long? catid, string from, string to)
        {
            List<AssetStockDto> logs = new List<AssetStockDto>();
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
            var rptAssetStock = _depreciation.CalculateCategroryStock(level, catid, convertedfrom, convertedend);


            LocalReport lr = new LocalReport();
           
            string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptAssetStock.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                return View("AssetStock");
            }

            ReportDataSource rd = new ReportDataSource("AssetStock", rptAssetStock);
            
            lr.DataSources.Add(rd);
            
            ReportParameter rp5 = new ReportParameter("FromDate", convertedfrom.ToString());
            ReportParameter rp6 = new ReportParameter("ToDate", convertedend.ToString());

            lr.SetParameters(new ReportParameter[] { rp5, rp6 });


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