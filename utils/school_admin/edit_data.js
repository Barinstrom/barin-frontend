import Cookies from "universal-cookie";
import axios from "axios";

/* url ของจริง */
//https://barinapi.tawanchai.com
/* url เทส */
//https://barin-backend-staging.herokuapp.com
/* url domain หลักของ backend เก็บใส่ตัวแปรเอาไว้แล้วนำไปใช้ต่อ */
const Url = "https://barinapi.tawanchai.com";
const stagingUrl = "https://barin-backend-staging.herokuapp.com/"

// ตั้งเวลาลงทะเบียน role addmin_school
export async function set_schedule(data, token, schoolID) {
  const apiUrl = stagingUrl + String(schoolID) + "/set-schedule";
  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err)
    return false
  }
}

// แก้ไขข้อมูล club
export async function update_club(data, token, schoolID) {
  const apiUrl = stagingUrl + String(schoolID) + "/update-club";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err.message)
    return false
  }
};

// แก้ไขข้อมูลนักเรียน
export async function update_student(data, token, schoolID) {
  const apiUrl = stagingUrl + String(schoolID) + "/update-student";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err.message)
    return false
  }
};

// แก้ไขข้อมูลครู
export async function update_teacher(data, token, schoolID) {
  const apiUrl = stagingUrl + String(schoolID) + "/update-teacher";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err)
    return false
  }
}


// แก้ไข school_data
export async function edit_school_data(data, token, schoolID) {
  const apiUrl = stagingUrl + String(schoolID) + "/edit";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err)
    return false
  }
};
