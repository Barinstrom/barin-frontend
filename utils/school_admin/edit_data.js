import Cookies from "universal-cookie";
import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API

// ตั้งเวลาลงทะเบียน role addmin_school
export async function set_schedule(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/set-schedule";
  
  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 15000
    })
    return 'true'
  } catch (err) {
    // console.log(err)
    return 'false'
  }
}

// แก้ไขข้อมูล club
export async function update_club(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/update-club";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 15000
    })
    return "true"
  } catch (err) {
    // console.log(err)
    return 'false'
  }
};

// แก้ไขข้อมูลนักเรียน
export async function update_student(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/update-student";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 15000
    })
    
    return "true"
  }catch (err) {
    // console.log(err)
    return "false"
  }
};

// แก้ไขข้อมูลครู
export async function update_teacher(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/update-teacher";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 15000
    })
    // console.log(result)
    return "true"
  } catch (err) {
    // console.log(err)
    return "false"
  }
}


// edit school_data
export async function admin_edit_school(token,data){
  const apiUrl = stagingUrl + "/update-school";
  try {
    const response = await axios({
      method:"patch",
      url:apiUrl,
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      },
      timeout:10000,
      data:JSON.stringify(data)
    })
    // console.log(response)
    return 'true'
  }catch(err) {
    // console.log(err);
    return 'false';
  }
};



