import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API

// แสดง ownclub
export async function get_teacher_ownclubs(token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/teacher/ownclubs";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "get",
      timeout: 15000
    })
    return result
  } catch (err) {
    // console.log(err)
    return false
  }
};

// ดูรายชื่อนร.ทั้งหมด
export async function get_all_stdlist(data,token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/club/students/name";

  const params = new URLSearchParams()

  params.append("clubID", data.clubID)

  const params_success = apiUrl + `?${params}`
  //console.log(params_success)
  try {
    const result = await axios({
      method: "get",
      url: params_success,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })
    //console.log(result)
    return [true,result]
  }
  catch (err) {
    // console.log(err)
    return [false,err]
  }
};