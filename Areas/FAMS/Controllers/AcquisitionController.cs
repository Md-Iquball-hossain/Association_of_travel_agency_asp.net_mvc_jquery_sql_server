using Finix.Auth.DTO;
using Finix.FAMS.Dto;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;



namespace Finix.UI.Areas.FAMS.Controllers
{
    public class AcquisitionController : Controller
    {
        private readonly AcquisitionFacade  _assigns = new AcquisitionFacade();
        private readonly EmployeeFacade _employee = new EmployeeFacade();
        // GET: FAMS/Acquisition
        public ActionResult AssetLocation()
        {
            return View();
        }

        public JsonResult GetAllCategories()
        {
            var data = _assigns.GetGroupedCategory();
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllOffices(long parentid)
        {
            var data = _assigns.getLocations(LocationTier.Office,parentid);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllBuildings(long parentid)
        {
            var data = _assigns.getLocations(LocationTier.Building, parentid);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUnAssignesAssets(long parentid, long? catid)
        {
            var data = _assigns.getAssetsByParentID(parentid, catid);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllFloors(long parentid)
        {
            var data = _assigns.getLocations(LocationTier.Floor, parentid);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEmployeeList(long? officeid)
        {
           
            List<Finix.HRM.DTO.EmployeeDto> Employees = _assigns.GetHREmployeeList((officeid!=null? (long)officeid : (long)SessionHelper.UserProfile.SelectedCompanyId));
            return Json(Employees, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAssignedAssets(long empid)
        {
            var data = _assigns.getAssetsByCustodian(empid);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        //public JsonResult GetAcquisitions()
        //{
        //    var data = _assigns.getAllAcquisition((long)SessionHelper.UserProfile.SelectedCompanyId);
        //    return Json(data, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult SaveAssetAcquisition(AssetAcquisitionDto dto, long? empid)
        {
            try
            {
                var result = _assigns.SaveAcquisition(dto.AssetID, empid, SessionHelper.UserProfile.UserId, PointOfDepreciation.Manual);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult SaveSelectedAssetAcquisition(List<long> SelectedAssets,long empid)
        {
            var result = _assigns.SaveSelected(SelectedAssets, empid, SessionHelper.UserProfile.UserId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}