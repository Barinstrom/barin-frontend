import React from "react";
import { useRef,useState,useEffect } from "react";
import ErrorPage from 'next/error'
import { set_schedule } from "../../utils/auth";
import Cookies from "universal-cookie";

export default function NotTimeConfig() {

	return (
    <div className="alert alert-danger text-center" role="alert" >
      คุณยังไม่ได้ตั้ง - ปีการศึกษาปัจจุบัน
      <br />
      กรุณาตั้งปีการศึกษา
    </div>
	)
}
