import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API

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
    return 'true'
  } catch (err) {
    // console.log(err)
    return 'false'
  }
};


// ตัดเกรด
export async function update_study_status(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/update-study-status";

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
    return result
  } catch (err) {
    // console.log(err)
    return false
  }
};