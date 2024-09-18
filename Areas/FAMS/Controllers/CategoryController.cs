using Finix.FAMS.Dto;
using Finix.FAMS.DTO;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using Finix.FAMS.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class CategoryController : BaseController
    {
        private readonly CategoryFacade _categories = new CategoryFacade();
        private readonly EnumFacade _enams = new EnumFacade();
        //private readonly EnumFacade _enum = new EnumFacade();
        // GET: FAMS/Categroy
        public ActionResult Category()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        public JsonResult SaveCategory(CategoryDto dto)
        {
            try
            {
                var result = _categories.SaveCategories(dto, SessionHelper.UserProfile.UserId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }

        }

        
        public JsonResult GetCategories()
        {
            var data = _categories.GetCategoryListForSelect();
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetAllCategories()
        {
            var studentList = _categories.GetCategoryList();
            return Json(studentList, JsonRequestBehavior.AllowGet);
        }
       
        public JsonResult GetCategoriesByParentID(long parent)
        {
            var data = _categories.GetCategoryListbyParent(parent);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getParent(long id)
        {
            var data = _categories.GetCategorybyID(id);
            return Json(data,JsonRequestBehavior.AllowGet);
        }

        public JsonResult getParents(CategoryLevel level)
        {
            var data = _categories.GetParentsByLevel(level);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getCategoryLevels()
        {
            List<EnumDto> list = _enams.GetCategoryLevels();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}