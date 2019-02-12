function graph11(){


	//sizing
	let margin = {top:20, right:0, bottom:40, left: 40};

	let width = document.querySelector("#c-svg-11").clientWidth;
	let height = 400;


	//initiate svg
	let svg = d3.select("#c-svg-11")
		.append("svg")
		.attr("height", height)
		.attr("width", width);

	//initiate format number
	/*Initiate format number*/
	d3.formatDefaultLocale({
		"decimal": ",",
		"thousands": "\u2009",
		"grouping": [3]
	});



	//Initiate data
	Promise.all([
		d3.json("data/map/epci.json"),
		d3.json("data/map/epci_reg.json"),
		d3.csv("data/data-11.csv")
	]).then(function(data){

		console.log(data);

		//set colors
		let colors = d3.scaleOrdinal()
			.domain(["0_0","0_1","1_0","1_1",""])
			.range(["#ddb544", "#d077a8","#e5484e","#7d84c0","#646464"]);



		

		const featureCollection = topojson.feature(data[0], data[0].objects.epci_gen); //geojson
		const featureCollectionReg = topojson.feature(data[1], data[1].objects.epci_reg_gen); //geojson
		
		
		//join map and data
		for (let i=0; i< data[2].length;i++){
			const csvId = data[2][i].codepci;
			for (var j=0; j<featureCollection.features.length;j++){
				var jsonId = featureCollection.features[j].properties.codepci;
				if (csvId === jsonId) {
					featureCollection.features[j].properties.cat_cs3 = data[2][i].cat_cs3;
					featureCollection.features[j].properties.cat_cs6 = data[2][i].cat_cs6;
					featureCollection.features[j].properties.cat_cs7 = data[2][i].cat_cs7;
					featureCollection.features[j].properties.cat_cs8 = data[2][i].cat_cs8;
					break;
				}
			}
		}
		
		
		
		
		//projection
		const projection = d3.geoConicConformal() //france projection
			.fitSize([width,height],featureCollection);

		const path = d3.geoPath() //generate path
			.projection(projection); //add projection to path

		let g = svg.append("g"); //conteneur pour le zoom

		//generate epci
		let epci = g.append("g")
			.attr("class","c-epci")
			.selectAll(".epci")
			.data(featureCollection.features)
			.join("path")
			.attr("d", path)
			.attr("class", "epci")
			.attr("fill", "#646464");

		//.attr("fill", ((d)=>{ return colors(d.properties.cat_cs3); }));

		//generate reg
		let region = g.append("g")
			.attr("class","c-reg")
			.append("path")
			.datum(featureCollectionReg)
			.attr("d", path)
			.attr("class", "region");

		//zoom
		svg
			.call(d3.zoom()
				.on("zoom", function(){
					g.attr("transform", d3.event.transform);
				})
				.scaleExtent([1,6]) //deep zoom
				.translateExtent([[0,0],[width, height]])
			);



		//initialize the scrollama
		//Parallax
		const scroller = scrollama();

		function handleStepEnter(response) {

			switch(response.index){
			case 0:
				epci
					.attr("fill", ((d)=>{ return colors(d.properties.cat_cs3); }));
				break;
			case 1:
				epci
					.attr("fill", ((d)=>{ return colors(d.properties.cat_cs6); }));
				break;
			case 2:
				epci
					.attr("fill", ((d)=>{ return colors(d.properties.cat_cs7); }));
				break;
			case 3:
				epci
					.attr("fill", ((d)=>{ return colors(d.properties.cat_cs8); }));
				break;

			}
		}

		function handleStepExit(response){
			switch(response.index){
			case 0:
				epci
					.attr("fill", "#646464");
				break;
			}
		}


		scroller
			.setup({
				container: ".scroll",
				graphic: ".scroll-graphic",
				text: ".scroll-text",
				step: ".break-11",
				debug: false,
				offset: 0.6
			})
			.onStepEnter(handleStepEnter)
			.onStepExit(handleStepExit);




}); //read csv





	


} //fonction graph11


graph11();




