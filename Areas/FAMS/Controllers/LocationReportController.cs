using Finix.FAMS.Dto;
using Finix.FAMS.DTO;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class LocationReportController : Controller
    {
        private readonly LocationFacade _report = new LocationFacade();
        private readonly EnumFacade _enams = new EnumFacade();
        // GET: FAMS/LocationReport
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getLocationsByLevel(LocationTier? level, long parent)
        {
            var result = _report.GetLocationsByLevel(level,parent);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LocationDetailsReport(LocationTier? level, long? locid)
        {
            List<LocationReportDto> results = new List<LocationReportDto>();
            results = _report.GetLocationsReportDetails(level, locid);
            return Json(results, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LocationSummaryReport(LocationTier? level, long? locid)
        {
            List<LocationSummaryDto> results = new List<LocationSummaryDto>();
            results = _report.GetLocationsSummaryReport(level, locid);
            return Json(results, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getLocationLevels()
        {
            List<EnumDto> list = _enams.GetLocationLevels().Where(x=> x.Id>1 && x.Id<6).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetReportLocationDetails(string reportTypeId, LocationTier? level, long? locid, long? office, long? building, long? floor, long? room)
        {
            List<LocationReportDto> logs = new List<LocationReportDto>();
            
                logs = _report.GetLocationsReportDetails(level, locid);
            


            LocalReport lr = new LocalReport();
            
            string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptLocation.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                //ViewBag.CompanyId = SessionHelper.UserProfile.SelectedCompanyId;
                return View("LocationReport");
            }

            //ReportDataSource rd = new ReportDataSource("Assets", rptAssetList);
            ReportDataSource rd = new ReportDataSource("Location", logs);

            lr.DataSources.Add(rd);
            //lr.SetParameters(new ReportParameter[] { rp1 });

            ReportParameter rp1 = new ReportParameter("Office",   (office!=null? _report.GetLocationbyID(office).LocationTitle:""));
            ReportParameter rp2 = new ReportParameter("Building", (building != null ? _report.GetLocationbyID(building).LocationTitle:""));
            ReportParameter rp3 = new ReportParameter("Floor",    (floor != null ? _report.GetLocationbyID(floor).LocationTitle:""));
            ReportParameter rp4 = new ReportParameter("Room",     (room != null ? _report.GetLocationbyID(room).LocationTitle:""));

            lr.SetParameters(new ReportParameter[] { rp1, rp2, rp3 , rp4 });


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

        public ActionResult GetReportLocationSummary(string reportTypeId, LocationTier? level, long? locid, long? office, long? building, long? floor, long? room)
        {
            List<LocationSummaryDto> logs = new List<LocationSummaryDto>();

            //if (level == LocationTier.Company)
            logs = _report.GetLocationsSummaryReport(level, locid);
           

            LocalReport lr = new LocalReport();
            //string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptAssetList.rdlc");
            string path = Path.Combine(Server.MapPath("~/Areas/FAMS/Reports"), "rptLocationSummary.rdlc");
            if (System.IO.File.Exists(path))
            {
                lr.ReportPath = path;
            }
            else
            {
                //ViewBag.CompanyId = SessionHelper.UserProfile.SelectedCompanyId;
                return View("LocationReport");
            }

            //ReportDataSource rd = new ReportDataSource("Assets", rptAssetList);
            ReportDataSource rd = new ReportDataSource("LocationSummary", logs);

            lr.DataSources.Add(rd);
            ReportParameter rp1 = new ReportParameter("Office", (office != null ? _report.GetLocationbyID(office).LocationTitle : ""));
            ReportParameter rp2 = new ReportParameter("Building", (building != null ? _report.GetLocationbyID(building).LocationTitle : ""));
            ReportParameter rp3 = new ReportParameter("Floor", (floor != null ? _report.GetLocationbyID(floor).LocationTitle : ""));
            ReportParameter rp4 = new ReportParameter("Room", (room != null ? _report.GetLocationbyID(room).LocationTitle : ""));
            lr.SetParameters(new ReportParameter[] { rp1, rp2, rp3, rp4 });

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