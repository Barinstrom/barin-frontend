import Cookies from "universal-cookie";
import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API

// ดึงชื่อ clubs ทั้งหมด
export async function get_name_clubs(token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/clubs-name";
  
    try {
      const result = await axios({
        url: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        timeout: 10000
      })
      return result
    } catch (err) {
      console.log(err.message)
      return false
    }
  };