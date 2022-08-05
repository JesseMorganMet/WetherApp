$(document).ready(function(){
	$('button').click(function(){
		let locationIdData;
		let getRequest;
		let input = tags.value;
		start.innerHTML="";
		bigData.innerHTML="";
		dataTable.innerHTML="";
		$.get("http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?res=3hourly&key=3e83b492-f4e4-44fe-b216-21874e51aee4", function(data, status) {
			console.log(status);
			// console.log(data);
			// console.log(tags.value)
			// console.log(String(input));
			let dataId;
			//let input = "Exeter"; //User input
			// let localArr = [];
			for(let i=0;i<data.Locations.Location.length;i++){
				const local = data.Locations.Location[i].name;
				// console.log(local);
				// localArr.push('"' + local + '"');
				if(local.toLowerCase().trim() === input.toLowerCase().trim()){
					dataId = i;
				}
			}
			// console.log("  " + localArr + "  ");
			// console.log(dataId);
			let dataLocalId = data.Locations.Location[dataId].id;
			// console.log(dataLocalId);
			locationIdData = String(dataLocalId);
			getRequest = `http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/${tags}?res=3hourly&key=3e83b492-f4e4-44fe-b216-21874e51aee4`;
			// console.log(getRequest);
			// console.log(locationIdData)


		//     http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/310069?res=3hourly&key=3e83b492-f4e4-44fe-b216-21874e51aee4
		$.get(`http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/${locationIdData}?res=3hourly&key=3e83b492-f4e4-44fe-b216-21874e51aee4`, function(data, status){
			console.log(status);
			// console.log(data);
			const days = data.SiteRep.DV.Location.Period;
			let elements = $("<table>");
			let dayElements = $("<tr>");
			let tempElements = $("<tr>");
			let PpElements = $("<tr>");
			let wtElements = $("<tr>");

			//Data
			for(let i =0;i<days.length;i++){
				let tempAvg = 0;
				let PpAvg = 0;

				//Days
				elements.append(dayElements);
				let day1 = days[i].value;
				day1 = day1.substring(0, day1.length - 1);
				//console.log(day1);

				//converting data into a named day
				let monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				let dayD = day1.substr(8);
				let month = day1.substr(5,6);
				month = month.substring(0, month.length - 3);
				let year = day1.substr(0,4);
				month = monthArr[(parseInt(month)-1)]
				const dateStr = (month + " " + dayD + ", " + year);
				const d = new Date(dateStr);
				const weekday = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
				const weekdayOut = weekday[d.getDay()];
				//converting data into a named day

				const day = $("<th>").html(weekdayOut);
				dayElements.append(day); // Adding individual days
				const dayData = days[i].Rep;
				//console.log(dayData);
				//Days

				//Temperature Average
				elements.append(tempElements);
				for(let j =0;j<dayData.length; j++){
					let tempIndv;
					parseInt(tempIndv = dayData[j].T);
					tempAvg = parseInt(tempAvg) + parseInt(tempIndv);
				}
				const temp = $("<th>").html((tempAvg/dayData.length).toFixed(0) + "C");
				tempElements.append(temp); // Adding Average Temps
				//Temperature Average

				//Precipitation Average
				elements.append(PpElements);
				for(let j =0;j<dayData.length; j++){
					let PpIndv;
					parseInt(PpIndv = dayData[j].Pp);
					PpAvg = parseInt(PpAvg) + parseInt(PpIndv);
				}
				let ppRound = Math.round((PpAvg/dayData.length)/5)*5;
				if(ppRound >= 10){
					ppRound = Math.round(ppRound/10)*10;
				}
				const Percip = $("<th>").html( ppRound + "%");
				PpElements.append(Percip);
				//Precipitation Average

				//Weather Type p/day
				elements.append(wtElements);
				let weatherDaily = dayData[0].W;
				let wD = weatherImg(weatherDaily); //output
				wtElements.append(wD);
				//Weather Type p/day
			}

			//Data
			//TodayData
			//console.log(data.SiteRep.DV.Location.Period[0].Rep);
			let today = data.SiteRep.DV.Location.Period[0].Rep;
			const tempArr = [];
			for(let j =0;j<today.length; j++) {
				tempArr.push(today[j].T);
			}
			let titles = $("<tr>");
			let values = $("<tr>");
			titles.append($("<th>").html("Highest Temp"));
			titles.append($("<th>").html("Lowest Temp"));
			titles.append($("<th>").html("UV"));

			const place = data.SiteRep.DV.Location.name;

			//Weather type
			let weather = today[0].W;
			const weatherType = ["Clear night","Sunny day","Partly cloudy (night)","Partly cloudy (day)","Not used","Mist","Fog","Cloudy","Overcast",
				"Light rain shower (night)","Light rain shower (day)","Drizzle","Light rain","Heavy rain shower (night)","Heavy rain shower (day)",
				"Heavy rain","Sleet shower (night)","Sleet shower (day)","Sleet","Hail shower (night)","Hail shower (day)","Hail","Light snow shower (night)",
				"Light snow shower (day)","Light snow","Heavy snow shower (night)","Heavy snow shower (day)","Heavy snow","Thunder shower (night)","Thunder shower (day)","Thunder"
			];
			//Weather type

			//Weather images
			let wImg = weatherImg(weather);
			//Weather images

			//Temperatures
			const maxTemp = Math.max(...tempArr);
			values.append($("<th>").html(maxTemp + "C"));
			const minTemp = Math.min(...tempArr);
			values.append($("<th>").html(minTemp + "C"));
			//Temperatures

			//UV data
			const uv = today[0].U;
			if (uv<=2) {
				values.append($("<th>").html("L"));
			} else if(uv<=5){
				values.append($("<th>").html("M"));
			} else if(uv<=7){
				values.append($("<th>").html("H"));
			} else if(uv<=10){
				values.append($("<th>").html("VH"));
			} else if(uv>=11){
				values.append($("<th>").html("E"));
			} else{
				console.log("Something went wrong");
			}
			//UV data
			//TodayData

			//weatherimages function
			function weatherImg(input){
				input = parseInt(input);
				//Could be a separate function since used multiple times
				if (input===1|| input===0) {
					output = $("<th>").prepend("<img src='./icons/Sun.png' alt='Sunny Icon'/>");
				} else if(input===2||input===3||input===7||input===8){
					output = $("<th>").prepend("<img src='./icons/Cloud.png' alt='Cloudy Icon'/>");
				} else if(input>4&&input<6){
					output = $("<th>").prepend("<img src='./icons/Fog.png' alt='Foggy Icon'/>");
				} else if(input>9&&input<15){
					output = $("<th>").prepend("<img src='./icons/Rain.png' alt='Raining Icon'/>");
				} else if(input>16&&input<27){
					output = $("<th>").prepend("<img src='./icons/Snow.png' alt='Snowing Icon'/>");
				} else if(input>28&&input<30){
					output = $("<th>").prepend("<img src='./icons/Thunder.png' alt='Thunder Icon'/>");
				} else{
					console.log("Something went wrong");
					console.log(input);
				}
				return output;
			}
			//weatherimages function

			//Adding Data To HTML
			$("#bigData").append($("<h2>").html(place)).append($("<div id='bigImg'>").prepend(wImg)).append($("<h2>").html(weatherType[weather])).append(titles).append(values);
			$("#dataTable").append(wtElements).append(PpElements).append(tempElements).append(dayElements);
			//Adding Data To HTML

		})
			.fail(function() {
				console.error("An error occurred while retrieving the data");
			})
			.always(function() {
				console.info("Webpage has finished loading")
			});
		});
	});
});
