using Finix.FAMS.Dto;
using Finix.FAMS.DTO;
using Finix.FAMS.Facade;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Finix.FAMS.Infrastructure;
using System.Web.Mvc;
using Finix.FAMS.Service;
using Microsoft.Reporting.WebForms;
using System.IO;
using Finix.UI.Areas.FAMS.ReportDataSets;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class AssetTransferController : Controller
    {
        private readonly AssetFacade _assets = new AssetFacade();
        private readonly EnumFacade _enams = new EnumFacade();
        private readonly AssetTransferFacade _transfers = new AssetTransferFacade();
        private readonly EmployeeFacade _employee = new EmployeeFacade();
        private readonly GenService _service = new GenService();
        private readonly AssetReportFacade _assetsreports = new AssetReportFacade();
        
        // GET: FAMS/AssetTransfer
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult AssetTransferLeft(string sortOrder, string currentFilter, string searchString, long? sourceid, int page = 1 )
        {
            ViewBag.CurrentSort = sortOrder;
            if (sourceid == null)
                sourceid = 3;
            ViewBag.ParentId = sourceid;
            if (!string.IsNullOrEmpty(searchString))
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewBag.CurrentFilter = searchString;
            var temp = _transfers.TransferlogSourcePagedList(5, page, searchString, sourceid);
            return PartialView(temp);
        }

        public ActionResult AssetTransferRight(string sortOrder, string currentFilter, string searchString, long destid, int rpage = 1)
        {
            ViewBag.CurrentSort = sortOrder;
            ViewBag.DestId = destid;
            if (!string.IsNullOrEmpty(searchString))
            {
                rpage = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewBag.CurrentFilter = searchString;
            var temp = _transfers.TransferlogDestinationPagedList(5, rpage, searchString, destid);
            return PartialView(temp);
        }
        [HttpPost]
        public JsonResult SaveTransfer(TransferLogDto dto, long assetid)
        {
            
            var result = _transfers.SaveTransferLog(dto, SessionHelper.UserProfile.UserId, assetid);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TransferSelected(TransferType type, long source, long dest,List<long> SelectedAssets)
        {
            var trdto = new TransferLogDto();
            trdto.TransferType = type;
            if (type == TransferType.Employee)
            {
                trdto.SourceEmployeeID = source;
                trdto.DestinationEmployeeID = dest;
            }
            else
            {
                trdto.SourceID = source;
                trdto.DestinationID = dest;
            }

            var result = _transfers.TransferSelected(trdto, SelectedAssets, SessionHelper.UserProfile.UserId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransferLevel()
        {
            List<EnumDto> types = _enams.GetLocationLevels().Where(x=>x.Id!=1).ToList();
            return Json(types, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSourceEmployees()
        {
            List<EmployeeDto> employees = _transfers.getSourceEmployee();
            return Json(employees, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSources(LocationTier level,long? parent)
        {
            List<LocationDto> locations = _transfers.getSources(level, parent);
            return Json(locations, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDestinatons(LocationTier level, long? parent, long? exceptid)
        {
            List<LocationDto> locations = _transfers.getDetinations(level,parent,exceptid);
            return Json(locations, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDestinatonEmployees(long exceptid)
        {
            List<EmployeeDto> employees = _transfers.getDestinatioEmployee(exceptid);
            return Json(employees, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSourceAssets(TransferType trantype, long? eid, long? sourceid)
        {
            List<AssetAcquisitionDto> assets = _transfers.getAssetsByID(trantype, (trantype==TransferType.Employee?eid:sourceid));
            return Json(assets, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDestinationAssets(TransferType trantype, long?eid, long? destid)
        {
            List<AssetAcquisitionDto> assets = _transfers.getAssetsByID(trantype, (trantype == TransferType.Employee ? eid : destid));
            return Json(assets, JsonRequestBehavior.AllowGet);
        }
        public ActionResult TramsferlogSourceList(string sortOrder, string currentFilter, string searchString, int page = 1)
        {
            
            ViewBag.CurrentSort = sortOrder;
            //ViewBag.ParentId = byid;
            if (!string.IsNullOrEmpty(searchString))
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewBag.CurrentFilter = searchString;
            var temp = _transfers.TransferlogSourcePagedList(20, page, searchString, 3);
            return View(temp);
            
        }

    }
}