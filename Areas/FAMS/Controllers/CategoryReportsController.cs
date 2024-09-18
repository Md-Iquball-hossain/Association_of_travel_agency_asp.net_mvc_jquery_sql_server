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
    public class CategoryReportsController : Controller
    {
        private readonly CategoryFacade _categories = new CategoryFacade();
        // GET: FAMS/CategoryReports
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getFilturedCategory(CategoryLevel? level, long? catid)
        {
            var studentList = _categories.GetCategoryList();
            List<CategoryDto> categories = _categories.getFilturedCategory(level, catid);
            return Json(categories, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getReport(CategoryLevel? level, string reportTypeId, long? catid)
        {
            string path = "";
            var rptAssetList = _categories.getFilturedCategory(level, catid);
            LocalReport lr = new LocalReport();
            if (catid != null)
                path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptCategory.rdlc");
            else
                path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptCategoryGroupby.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                return View("CategoryReport");
            }

            ReportDataSource rd = new ReportDataSource("AssetCategory", rptAssetList);
            ReportDataSource rd1 = new ReportDataSource("CategoryGroupBy", rptAssetList);

            if (catid != null)
                lr.DataSources.Add(rd);
            else
                lr.DataSources.Add(rd1);

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