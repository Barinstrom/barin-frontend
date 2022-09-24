import React, { useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const stagingUrl = "https://barin-backend-staging.herokuapp.com/";
                   
async function get_review(token, schoolID) {
  const apiUrl = stagingUrl + schoolID + "/get-review";
  try {
    const result = await axios({
      method: "get",
      params: { page: 1, clubID: "631c6c83206c37ff705b2931" },
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function add_review(data, token, schoolID) {
  const apiUrl = stagingUrl + String(schoolID) + "/add-review";
  console.log(apiUrl,data)
  
  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data:JSON.stringify(data),
      timeout: 10000,
    });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export default function Testadd() {
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const schoolID = "teststamp";
    const data = {
        clubID : "632eb2a821f7cf592a445752",
        studentID : "63281792b310a1ed05655d86",
        textReview : "วิชานี้ดี very good "
    }
    add_review(data, token, schoolID)
    .then(res => {
      console.log(res)
    });
  }, []);

  return (
    <>
      {/* {console.log(get_review(token, schoolID))} */}
      {/* {console.log("first")} */}
    </>
  );
}
