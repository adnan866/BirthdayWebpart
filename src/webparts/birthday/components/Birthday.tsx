import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
// import { Autoplay } from 'swiper/modules';
import "./style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IBirthdayProps } from "./IBirthdayProps";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

// const Birthday: React.FC<IBirthdayProps> = ({ listName, siteURL }) => {

const Birthday = ({ siteURL, listName, context }: IBirthdayProps) => {
	const [birthdayData, setbirthdayData] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	const topLeftImage = require("../assets/topLeft.png");
	const topRightImage = require("../assets/topRight.png");
	const bottomRightImage = require("../assets/bottomRight.png");
	const profileBorderImage = require("../assets/profileBorder.png");
	const avatar = require("../assets/avatar.png");


	const fetchProfilePhoto = async (userEmail: string): Promise<string | null> => {
		try {
			const graphClient = await context.msGraphClientFactory.getClient();
			const response = await graphClient
				.api(`/_layouts/15/userphoto.aspx?size=L&username=${userEmail}`)
				.responseType("blob")
				.get();
			return URL.createObjectURL(response); // Convert blob to an image URL
		} catch (error) {
			console.error("Error fetching profile photo for user:", userEmail, error);
			return null; // Return null if the image is not found
		}
	};

	const fetchbirthdayData = async () => {
		try {
			let url: string = `${siteURL}/_api/web/lists/getbytitle('${listName}')/items?$select=*,BirthdayUser/Title,BirthdayUser/EMail,BirthdayUser/Id,AttachmentFiles&$expand=BirthdayUser,AttachmentFiles`;

			return context.spHttpClient
				.get(url, SPHttpClient.configurations.v1)
				.then((response: SPHttpClientResponse) => {
					return response.json();
				});
		} catch (error) {
			setError("Error fetching Birthday data");
		}
	};

	useEffect(() => {
		if (listName && siteURL) {
			fetchbirthdayData().then(async (response) => {
				console.log("this is my arry of birthday", response.value);
				console.log("API Response:", response);

				let dataArray = [];
				for (var item of response.value) { 
					
							// const imageUrl =
							// 	item.AttachmentFiles && item.AttachmentFiles.length > 0
							// 		? `${item.AttachmentFiles[0].ServerRelativeUrl}`
							// 		: null;

					const cmonth = new Date().toISOString().split("-")[1];
					const bmonth = item.Birthday.split("-")[1];
					const birthday = item.Birthday ? new Date(item.Birthday) : null;
					//  console.log('new Date()', new Date().toISOString().split('-')[1])
					if (cmonth == bmonth) {
						const profilePhotoUrl = await fetchProfilePhoto(item.BirthdayUser.EMail);
						dataArray.push({
							formattedBirthday: birthday
								? birthday.toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
								  })
								: "Unknown Birthday",

							// imageUrl: imageUrl,
							profilePhotoUrl: profilePhotoUrl || avatar,
							Name:item.BirthdayUser!=null? item.BirthdayUser.Title:"",
							Designation: item.JobTitle,
							// Birthday: item.Birthday.split("T"),
							// ID: item.ID,
						});
					}
				}
				setbirthdayData(dataArray);
			});
			
		}
	}, [listName, siteURL]);

	return (
		<div className="sliderContainer">
			{error && <div className="error">{error}</div>}
			{birthdayData.length === 0 && <div>No birthday data available</div>}

			<Swiper
				slidesPerView={1}
				loop={true}
				mousewheel={true}
				autoplay={{ delay: 7000, disableOnInteraction: false }}
				speed={1500} 
				// modules={[]}
				breakpoints={{
					640: {
						slidesPerView: 1,
						spaceBetween: 12,
					},
					992: {
						slidesPerView: 2,
						spaceBetween: 15,
					},
				}}
			>
				{birthdayData.map((item, index) => (
					<SwiperSlide key={index}>
						<div className="birthdayEmp">
							<img src={topLeftImage} className="topLeft" alt="img" />
							<img src={topRightImage} className="topRight" alt="img" />
							<div className="slidCont">
								<h5>Happy Birthday</h5>
								<div className="imgDiv">
									{item.imageUrl ? (
										<img
											src={item.profilePhotoUrl}
											className="profileImg"
											alt="profile"
										/>
									) : (
										<img src={avatar} className="profileImg"	alt="icon"/>
									)}
									<img
										src={profileBorderImage}
										className="profileSideImg"
										alt="img"
									/>
								</div>
								<div className="slidConDiv">
									<h5>{item.Name || "Unknown"}</h5>
									<p>{item.Designation || "No Designation"}</p>
									<p>{item.formattedBirthday || "Nill"}</p>
								</div>
							</div>
							<img src={bottomRightImage} className="bottomRight" alt="img" />
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default Birthday;
