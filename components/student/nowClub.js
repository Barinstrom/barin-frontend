import React from "react";
import { useEffect,useState } from "react";
import { get_student_ownclub } from "../../utils/auth";
import Cookies from "universal-cookie";

export default function Nowclub({schoolID}) {
	const [ ownclub, setOwnclub ] = useState(null)
	
	useEffect(() => {
		const  cookie = new Cookies()
		const token = cookie.get("token")
		
		get_student_ownclub(token,schoolID).then(result => {
			let clubs
			console.log(result)
			if (!result){
				clubs = (
					<div  className="alert alert-info mt-2">
						<p className="alert-heading fs-3">ERRORRRRRRR</p>
					</div>
				)
			}
			else if (result.data.clubs.length === 0){
				clubs = (
					<div  className="alert alert-info mt-2">
						<p className="alert-heading fs-3">No club</p>
						<p>temp</p>
						<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rem magnam id aperiam eaque adipisci error. Temporibus perspiciatis explicabo totam quidem, provident, voluptatibus magnam error nulla laudantium inventore odio non?</p>
					</div>
				)
			}
			else {
				clubs = result.data.clubs.map((e,i) => {
					<div key={i} className="alert alert-info mt-2">
						<p className="alert-heading fs-3">temp</p>
						<p>temp</p>
						<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rem magnam id aperiam eaque adipisci error. Temporibus perspiciatis explicabo totam quidem, provident, voluptatibus magnam error nulla laudantium inventore odio non?</p>
					</div>
				})
			}
			setOwnclub(clubs)
		})
	}, [])

	return (
		<div>
			<div className="text-center fs-1">Now Club</div>
			<div>
				{ownclub}
			</div>
		</div>
	)
}
