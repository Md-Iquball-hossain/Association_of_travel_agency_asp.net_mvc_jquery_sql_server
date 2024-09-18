using Finix.FAMS.Dto;
using Finix.FAMS.DTO;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class LocationController : Controller
    {
        private readonly LocationFacade _locations = new LocationFacade();
        private readonly EnumFacade _enams = new EnumFacade();
        // GET: FAMS/Location
        public ActionResult Location()
        {
            return View();
        }

        public JsonResult getLocations()
        {
            var result = _locations.GetLocations();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getParents(LocationTier? level)
        {
            var result = _locations.GetParentsByLevel(level);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult SaveLocation(LocationDto dto)
        {
            try
            {
                var result = _locations.SaveLocation(dto, SessionHelper.UserProfile.UserId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult getLocationLevels()
        {
            List<EnumDto> list = _enams.GetLocationLevels();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}