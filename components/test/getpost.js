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
  console.log(JSON.stringify(data))
  
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
    console.log(err.message);
    return false;
  }
}

export default function Testget() {
  //   useEffect(() => {
  //     const page = "1";
  //     const clubID = "631c6c83206c37ff705b2931";
  //     const cookies = new Cookies();
  //     const token = cookies.get("token");
  //     const schoolID = "teststamp";
  //     get_review(token, schoolID)
  //     .then(res => console.log(res.data.docs))

  //   }, []);
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const schoolID = "teststamp";
    const data = {
        clubID : "631c6e5cb0f33e324f1b1111",
        studentID : "631ed901cbc23688f173a14f",
        textReview : "วิชานี้ดี very good "
    }
    add_review(data, token, schoolID)
    // .then(res => {
    //     console.log(res)
    // });
  }, []);

  return (
    <>
      {/* {console.log(get_review(token, schoolID))} */}
      {/* {console.log("first")} */}
    </>
  );
}
