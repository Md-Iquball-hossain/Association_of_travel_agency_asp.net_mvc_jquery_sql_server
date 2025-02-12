﻿using Finix.FAMS.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Finix.Auth.Facade;
using Finix.Auth.Infrastructure;
using Finix.FAMS.Facade;
using Finix.FAMS.DTO;
using Finix.FAMS.Infrastructure;
using Finix.FAMS.Infrastructure.Models;
using BloodGroup = Finix.FAMS.Infrastructure.BloodGroup;
using EmployeeType = Finix.FAMS.Infrastructure.EmployeeType;
using Gender = Finix.FAMS.Infrastructure.Gender;
using MaritalStatus = Finix.FAMS.Infrastructure.MaritalStatus;
using Religion = Finix.FAMS.Infrastructure.Religion;
using System.Globalization;
using Finix.FAMS.Dto;

namespace Finix.UI.Areas.FAMS.Controllers
{
    public class EmployeeController : BaseController
    {
        private readonly EmployeeFacade _employee = new EmployeeFacade();
        private readonly UserFacade _user = new UserFacade();
        private readonly OfficeFacade _office = new OfficeFacade();
        private readonly OfficeDesignationSettingFacade _officeDesignationSetting = new OfficeDesignationSettingFacade();
        // GET: IPDC/Employee
        public ActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public JsonResult GetEmployeeList()
        {
            return Json(_employee.GetEmployeeList(""), JsonRequestBehavior.AllowGet);
        }
        #region auto-complete

        public JsonResult GetEmployeeNumberList(string prefix)
        {
            if(!string.IsNullOrEmpty(prefix))
                prefix = prefix.ToLower();
            var employees = _employee.GetEmployeeList(prefix);

            var data = employees.Select(x => new { Id = x.Id, Name = x.FirstName + " " + x.LastName }).ToList();
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        #endregion

        [HttpGet]
        public JsonResult GetGender()
        {
            List<KeyValuePair<int, string>> genderlist = UiUtil.EnumToKeyVal<Gender>();
            return Json(genderlist, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public string GetEmployeeType()
        {
            //List<KeyValuePair<int, string>> emptypelist = UiUtil.EnumToKeyVal<EmployeeType>();
            //return Json(emptypelist, JsonRequestBehavior.AllowGet);
            List<KeyValuePair<int, string>> empTypelist = UiUtil.EnumToKeyVal<EmployeeType>();
            string strret = "<select><option></option>";
            foreach (var item in empTypelist)
            {
                strret += "<option value='" + item.Key + "'>" + item.Value + "</option>";
            }
            strret += "</select>";
            return strret;
        }

        public string GetCountryList()
        {
            //List<KeyValuePair<int, string>> emptypelist = UiUtil.EnumToKeyVal<EmployeeType>();
            //return Json(emptypelist, JsonRequestBehavior.AllowGet);
            List<KeyValuePair<int, string>> countrylist = UiUtil.EnumToKeyVal<Country>();
            string strret = "<select><option></option>";
            foreach (var item in countrylist)
            {
                strret += "<option value='" + item.Key + "'>" + item.Value + "</option>";
            }
            strret += "</select>";
            return strret;
        }

        [HttpGet]
        public JsonResult GetGenderList()
        {
            List<KeyValuePair<int, string>> genderlist = UiUtil.EnumToKeyVal<Gender>();
            return Json(genderlist, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public string GetGenders()
        {
            List<KeyValuePair<int, string>> genderlist = UiUtil.EnumToKeyVal<Gender>();
            string strret = "<select><option></option>";
            foreach (var item in genderlist)
            {
                strret += "<option value='" + item.Key + "'>" + item.Value + "</option>";
            }
            strret += "</select>";
            return strret;
        }
        [HttpGet]
        public JsonResult GetMaritalStatus()
        {
            List<KeyValuePair<int, string>> maritalstatuslist = UiUtil.EnumToKeyVal<MaritalStatus>();
            return Json(maritalstatuslist, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public string GetMaritalStatuses()
        {
            List<KeyValuePair<int, string>> maritalstatuslist = UiUtil.EnumToKeyVal<MaritalStatus>();
            string strret = "<select><option></option>";
            foreach (var item in maritalstatuslist)
            {
                strret += "<option value='" + item.Key + "'>" + item.Value + "</option>";
            }
            strret += "</select>";
            return strret;
        }

        [HttpGet]
        public JsonResult GetBloodGroup()
        {
            List<KeyValuePair<int, string>> bloodgrouplist = UiUtil.EnumToKeyVal<BloodGroup>();
            return Json(bloodgrouplist, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public string GetBloodGroups()
        {
            List<KeyValuePair<int, string>> bloodgrouplist = UiUtil.EnumToKeyVal<BloodGroup>();
            string strret = "<select><option></option>";
            foreach (var item in bloodgrouplist)
            {
                strret += "<option value='" + item.Key + "'>" + item.Value + "</option>";
            }
            strret += "</select>";
            return strret;
        }

        [HttpGet]
        public JsonResult GetReligionList()
        {
            List<KeyValuePair<int, string>> religionlist = UiUtil.EnumToKeyVal<Religion>();
            return Json(religionlist, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public string GetReligions()
        {
            List<KeyValuePair<int, string>> religionlist = UiUtil.EnumToKeyVal<Religion>();
            string strret = "<select><option></option>";
            foreach (var item in religionlist)
            {
                strret += "<option value='" + item.Key + "'>" + item.Value + "</option>";
            }
            strret += "</select>";
            return strret;
        }
        //[HttpGet]
        //public string GetNationalityList()
        //{
        //    List<KeyValuePair<int, string>> nationality = UiUtil.EnumToKeyVal<Nationality>();
        //    string strret = "<select><option></option>";
        //    foreach (var item in nationality)
        //    {
        //        strret += "<option value='" + item.Key + "'>" + item.Value + "</option>";
        //    }
        //    strret += "</select>";
        //    return strret;
        //}
        [HttpGet]
        public string GetEmployeeTypes()
        {
            List<KeyValuePair<int, string>> emptypes = UiUtil.EnumToKeyVal<EmployeeType>();
            string strret = "<select><option></option>";
            foreach (var item in emptypes)
            {
                strret += "<option value='" + item.Key + "'>" + item.Value + "</option>";
            }
            strret += "</select>";
            return strret;
        }

        [HttpPost]
        public JsonResult SaveEmployee(EmpBasicInfoDto basicinfodto, int? id = null)
        {
            string Message = "";
            try
            {
                if (!string.IsNullOrEmpty(basicinfodto.DateOfBirthTxt))
                {
                    DateTime birthDay;
                    var converted = DateTime.TryParseExact(basicinfodto.DateOfBirthTxt, "dd/MM/yyyy",
                        CultureInfo.InvariantCulture, DateTimeStyles.None, out birthDay);
                    if (converted)
                        basicinfodto.DateOfBirth = birthDay;
                }
                
                _employee.SaveEmployee(basicinfodto, id);
                Message = "Basic info saved successfully";
            }
            catch (Exception ex)
            {
                Message = ex.Message;
            }
            return Json(Message);
        }

        [HttpGet]
        public JsonResult GetBasicInfoById(int id)
        {
            return Json(_employee.GetBasicInfoById(id), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetUserInfoByEmpId(int empId)
        {
            var _user = new Finix.Auth.Facade.UserFacade();
            var users = _user.GetUserByEmployeeId(empId);
            //var data =  users.s//users.Select(u => new { Id = u.Id, Name = u.UserName });
            if (users == null)
                return Json("", JsonRequestBehavior.AllowGet);
            return Json(new {Id=users.Id, Username = users.UserName }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetContactInfoByEmpId(int empId)
        {
            //return null;
            return Json(_employee.GetContactInfoById(empId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetEmployeeWithDesignation()
        {
            var designations = _officeDesignationSetting.GetEmployeeWithDesignation();
            return Json(designations, JsonRequestBehavior.AllowGet);
            //return Json(_employee.GetBasicInfoById(id), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetEmployeeWithDesignationOfffice()
        {
            var userId = SessionHelper.UserProfile.UserId;
            var designations = _officeDesignationSetting.GetEmployeeWithDesignationOfffice(userId);
            return Json(designations, JsonRequestBehavior.AllowGet);
            //return Json(_employee.GetBasicInfoById(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEnumEmployeementStatus()
        {
            var typeList = Enum.GetValues(typeof(EmploymentStatus))
               .Cast<EmploymentStatus>()
               .Select(t => new EnumDto
               {
                   Id = ((int)t),
                   Name = UiUtil.GetDisplayName(t)
               });
            return Json(typeList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveContactInfo(ContactInformationDto contactinfo, int empid)
        {
            string Message = "";
            try
            {
                _employee.SaveContactInfo(contactinfo, empid);
                Message = "Contact info saved successfully";

            }
            catch (Exception ex)
            {
                Message = ex.Message;

            }
            return Json(Message);
        }

        /* Added By Mayedul Islam*/

        public JsonResult CountryList()
        {
            var divisions = _office.GetCountryList();
            return Json(divisions, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDivisionList()
        {
            var divisions = _office.GetDivisionList();
            return Json(divisions, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDistrictByDivisionId(long divid)
        {
            var districts = _office.GetDistrictList(divid);
            return Json(districts, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetThanaByDistrictId(long distid)
        {
            var thanas = _office.GetThanaList(distid);
            return Json(thanas, JsonRequestBehavior.AllowGet);
        }
        /* End */
    }
}