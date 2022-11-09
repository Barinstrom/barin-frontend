import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API

// data school
export async function get_school_data(schoolID,token) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/data";
	try {
		
		const result = await axios({
			url:apiUrl,
			method:"get",
			headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
			timeout:10000
		})
		//console.log(response)
		return [result,true]
	}
	catch(err){
		console.log(err)
		return [err,false]
	}
};

// pending school
export async function get_pending(data,token) {
	const apiUrl = stagingUrl + "/schools/pending";
	try {
		const params = new URLSearchParams()
		
		if (data.page){
			params.append("page",data.page)
		}
		
		if (data.query){
			params.append("query",data.query)
		}
		
		const paramsSuccess = apiUrl+`?${params}`
		
		
		const result = await axios({
			method:"get",
			url:paramsSuccess,
			headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`},
			timeout:10000
		})
		return result
	} catch(err) {
		console.log(err);
		return false;
	}
};

// approved school
export async function get_approved(data,token) {
	const apiUrl = stagingUrl + "/schools/approved";
	try {
		const params = new URLSearchParams()
		
		if (data.page){
			params.append("page",data.page)
		}
		
		if (data.query){
			params.append("query",data.query)
		}
		
		const paramsSuccess = apiUrl+`?${params}`
		// console.log(paramsSuccess)
		
		const response = await axios({
			method:"get",
			url:paramsSuccess,
			headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`},
			timeout:10000
		})
		return response
	} catch(err) {
		console.log(err.message);
		return false;
	}
};

// not approved school
export async function get_not_approved(data,token) {
	const apiUrl = stagingUrl + "/schools/not-approved";
	try {
		const params = new URLSearchParams()
		
		if (data.page){
			params.append("page",data.page)
		}
		
		if (data.query){
			params.append("query",data.query)
		}
		
		const paramsSuccess = apiUrl+`?${params}`
		//console.log(paramsSuccess)
		
		const response = await axios({
			method:"get",
			url:paramsSuccess,
			headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`},
			timeout:10000
		})
		//console.log(response)
		return response.data
		
	} catch(err) {
		console.log(err.message);
		return false;
	}
};


// edit info school
export async function sys_edit_school(token,data) {
	const apiUrl = stagingUrl + "/update-school";
	console.log(data)
	try {
		const response = await axios({
			method:"patch",
			url:apiUrl,
			headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`},
			timeout:10000,
			data:JSON.stringify(data)
		})
		console.log(response)
		return 'true'
	} catch(err) {
		console.log(err);
		return 'false';
	}
};



