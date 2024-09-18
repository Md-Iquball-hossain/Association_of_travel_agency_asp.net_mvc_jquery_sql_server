using Finix.FAMS.Dto;
using Finix.FAMS.DTO;
using Finix.FAMS.Facade;
using Finix.FAMS.Infrastructure;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class AccountsController : Controller
    {
        public readonly FAMSAccountsFacade _famsAccounts = new FAMSAccountsFacade();
        //public readonly BasicDataFacade _basicData = new BasicDataFacade();
        // GET: Southern/Accounts
        public ActionResult AccountHeadMapping(string searchString, int pageSize = 20, int pageCount = 1)
        {
            ViewBag.CurrentSort = searchString;
            var data = _famsAccounts.GetAccHeadMappingList(pageSize, pageCount, searchString);
            return View(data);
        }
        public JsonResult GetRefOptions(AccountHeadRefType refType)
        {
            List<CategoryDto> cats = new List<CategoryDto>();
            var data = _famsAccounts.GetMainCategory();
            //if (refType == AccountHeadRefType.AssetPurchase)
            //{
            //    cats = _famsAccounts.GetMainCategory();
            //}
            //if (refType == AccountHeadRefType.PurchaseProductWise || refType == AccountHeadRefType.SalesProductWise)
            //{
            //    var data = new ProductFacade().GetProductCategories();
            //    if (data != null)
            //        return Json(data.Select(d => new { Id = d.Id, Name = d.Name }), JsonRequestBehavior.AllowGet);
            //}
            //if (refType == AccountHeadRefType.SupplierPayable)
            //{
            //    var data = _basicData.GetSuppliers();
            //    if (data != null)
            //        return Json(data.Select(d => new { Id = d.Id, Name = d.Name }), JsonRequestBehavior.AllowGet);
            //}
            //if (refType == AccountHeadRefType.SupplierPayable)
            //{
            //    var data = _basicData.GetBanks();
            //    if (data != null)
            //        return Json(data.Select(d => new { Id = d.Id, Name = d.Name }), JsonRequestBehavior.AllowGet);
            //}
            return Json(data, JsonRequestBehavior.AllowGet);
           // return cats; 
        }
        public JsonResult GetAccHeads(AccountHeadRefType refType)
        {
            var data = _famsAccounts.GetAccHeads(refType, (long)SessionHelper.UserProfile.SelectedCompanyId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public JsonResult SaveAccHeadMapping(AccHeadMappingDto dto)
        {
            var result = _famsAccounts.SaveAccHeadMapping(dto, SessionHelper.UserProfile.UserId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}