function graph10(){


	//sizing
	let margin = {top:20, right:0, bottom:40, left: 40};

	let width = 600;
	let height = 400;


	//initiate svg
	let svg = d3.select("#c-svg-10")
		.append("svg")
		.attr("height", height)
		.attr("width", "100%");

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
		d3.csv("data/data-10.csv")
	]).then(function(data){



		const featureCollection = topojson.feature(data[0], data[0].objects.epci_gen); //geojson
		const featureCollectionReg = topojson.feature(data[1], data[1].objects.epci_reg_gen); //geojson

		//join map and data
		for (let i=0; i< data[2].length;i++){
			const csvId = data[2][i].codepci;
			for (var j=0; j<featureCollection.features.length;j++){
				var jsonId = featureCollection.features[j].properties.codepci;
				if (csvId === jsonId) {
					featureCollection.features[j].properties.clust = data[2][i].clust;
					featureCollection.features[j].properties.cat = data[2][i].cat;
					break;
				}
			}
		}


		//set colors by region
		let colors = d3.scaleOrdinal()
			.domain(["1","2","3","4","5","6"])
			.range(["#53995c","#7cc18b","#e8e774","#eec05d","#c4431d","#e08343"]);

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
			.enter()
			.append("path")
			.attr("d", path)
			.attr("class", "epci")
			.attr("stroke","white")
			.attr("stroke-width",.1)
			.attr("fill", ((d)=>{ return colors(d.properties.clust); }));

		//generate reg
		let region = g.append("g")
			.attr("class","c-reg")
			.selectAll(".region")	
			.data(featureCollectionReg.features)
			.enter()
			.append("path")
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


}); //read csv





	


} //fonction graph10


graph10();




