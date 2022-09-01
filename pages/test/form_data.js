import React from "react";
import { useState } from "react";
import { useRef } from "react";
import axios from 'axios'

function form_data() {

  const tagForm = useRef([]);
  
	async function submitForm(ev) {
		ev.preventDefault();
		console.log(ev.target);
		const form = new FormData(ev.target);
		try {
			const response = await fetch(
				"https://barin-backend-staging.herokuapp.com/upload",
				{
					method: "post",
					body: form,
				}
			);
			const result = await response.json();
			console.log(result);
		} catch (err) {
			console.log(err);
		}
  }



  return (
		<div>
			<form className="row g-3" onSubmit={(ev) => submitForm(ev)}>
				
        <div className="mb-3">
					<label className="form-label">
						Default file input example
					</label>
					<input type="file" className="form-control" name="file" id="file" />
				</div>
				<div className="mb-3">
					<input type="text" className="form-control" name="text" id="text" />
				</div>
				<div className="mb-3">
					<button type="submit" className="btn btn-primary mb-3">
						Confirm identity
					</button>
				</div>
			</form>
		</div>
  );
}

export default form_data;
