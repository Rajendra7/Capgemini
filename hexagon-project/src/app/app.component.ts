import { Component, OnInit } from '@angular/core';
import { HexogoanService } from './services/hexgoan-service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
declare let d3plus: any;
declare let d3: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Drop Down Start


  sectorDisable: any;
  functionDisable: any;
  catagoryDisable: any;

  title: String = 'DCP Blueprint Explorer';
  svg: any;
  sectorsList: any = [];
  functionsList: any = [];
  categoriesList: any = [];

  data: any;
  tip: any;
  vis: any;

  CIRCUM_CIRCLE_OF_HEXAGON = 50;
  GAP_BETWEEN_CELLS = 10;
  MAX_CELLS_ON_LINE = 8;
  COLOR_SCHEME = {
    "InDevelopment": {
      // "background": "#4fc3f7",
      "background": "rgb(51,204,51)",
     
      "text": "#fafafa",
      "highlight":   "#616161"
      //"highlight": "#303f9f"
    },
    "Released": {
      "background": " rgb(68,114,196)",
      // "background": "#cddc39",
       "text": "#fafafa",
      // "text": "#616161",
     // "highlight": "#2e7d32"
     "highlight":   "#616161"
    }
  }
 
  constructor(private hexogoanService: HexogoanService) { }

  ngOnInit() {
    this.getSectors();
    this.getFunctions();
    this.getCategories();
    this.getD3();
  };

  dropdownReset(){
   this.ngOnInit();
   d3.select("svg").selectAll("*").remove();
   this.sectorDisable = '';
   this.functionDisable = '';
    this.catagoryDisable = ''; 
   

  }
  getD3() {
    this.svg = d3.select('svg');
    this.tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0]);
    this.svg.call(this.tip);
  }

  clearD3() {
    this.svg = '';
    this.vis = '';
    this.tip = '';
  }

  selectSector(event: any) {
    d3.select("svg").selectAll("*").remove();
    this.functionDisable = 'disabled';
    this.catagoryDisable = 'disabled';
    this.getD3();
    // let jsonFile = "./assets/mock-json/" + event.target.value + ".json";
    let jsonFile = "./assets/mock-json/microservice.json";
    this.hexogoanService.getHex(jsonFile).subscribe(result => {
      //console.log(result);
      this.data = result;
      if (this.data != null) {
        this.drawHexagonWithFunctionFilter(this.data, 
            d3.select("#sector").node().value, null, null);
      }
    });

   
  }

  getSectors() {
    this.sectorsList = [
      { id: 1, name: 'microservice' }
    ];
  }

  

  selectFunction(event: any) {
    d3.select("svg").selectAll("*").remove();
    this.sectorDisable = 'disabled';
    this.catagoryDisable = 'disabled';
    this.getD3();
    // let jsonFile = "./assets/mock-json/" + event.target.value + ".json";
    let jsonFile = "./assets/mock-json/microservice.json";
   
    this.hexogoanService.getHex(jsonFile).subscribe(result => {
     // console.log(result);
     
      this.data = result;
      if (this.data != null) {
        this.drawHexagonWithFunctionFilter(this.data, 
          null, d3.select("#function").node().value, null);
      }
    });
    
  }

  getFunctions() {
    this.functionsList = [
      { id: 2, name: 'Customer data management' },
      { id: 3, name: 'Loyalty' },
      { id: 4, name: 'Order management' },
      { id: 5, name: 'Customer Engagement/Comms Channels' },
      { id: 6, name: 'Checkout' },
      { id: 7, name: 'Payments' },
      { id: 8, name: 'Tax' },
      { id: 9, name: 'Fulfilment' },

    ]
  }

  
  selectCategory(event: any) {
    d3.select("svg").selectAll("*").remove();
    this.sectorDisable = 'disabled';
    this.functionDisable = 'disabled';
    this.getD3();
    let jsonFile = "./assets/mock-json/microservice.json";
    this.hexogoanService.getHex(jsonFile).subscribe(result => {
   //   console.log(result);
      this.data = result;
      if (this.data != null) {
        this.drawHexagonWithFunctionFilter(this.data, null, null,
          d3.select("#category").node().value
        );
      }
    });
   
  }
  getCategories() {
    this.categoriesList = [
     
      { id: 10, name: 'Consumer Hub'},
      { id: 11, name: 'Order Hub' },
      { id: 12, name: 'Delivery Dispatch & Routing' },
      { id: 13, name: 'POS' },
      { id: 14, name: 'eCommerce' },

    ]
  }

  drawHexagonWithFunctionFilter(data, _sector, _function, _category) {
    var filteredData = [];
    for (var i = 0; i < data.length; i++) {
      var addRecord = true;
      if ((_sector != null) && (data[i]["Blueprint"] != _sector)) {
        addRecord = false;
      }
      if ((_function != null) && (data[i]["Function"] != _function)) {
        addRecord = false;
      }
      if ((_category != null) && (data[i]["Category"] != _category)) {
        addRecord = false;
      }
      if (addRecord) {
        filteredData.push(data[i]);
      }
    }
    this.drawHoneycomb(this.svg, filteredData, this.CIRCUM_CIRCLE_OF_HEXAGON, this.GAP_BETWEEN_CELLS, this.MAX_CELLS_ON_LINE)
  }

  
  // Drop Down End

  drawHoneycomb(svg, allData, circumCircle, cellGap, maxCellsOnLine) {
    var shortDiagonal = circumCircle * Math.sqrt(3); // short diagonal (d2) = square root of 3 * circum circle (circum circle = edge)
    var isOddRow = true;
    var xPos = 0;
    var yPos = 0;
    for (var cellIndex = 0; cellIndex < allData.length; cellIndex++) {
      // Calculate the exact x and y coordinates on the screen for the current cell
      var x;
      var y;
      if (isOddRow) {
        var yOddPos = Math.floor(yPos / 2); // The odd row position (among odd rows what is the position of this row)
        x = (xPos + 0.5) * shortDiagonal + (xPos + 1) * cellGap;
        y = circumCircle + yOddPos * (3 * circumCircle) + (yPos + 1) * cellGap;
      } else {
        var yEvenPos = Math.floor(yPos / 2); // The even row position (among even rows what is the position of this row)
        x = (xPos + 1) * shortDiagonal + (xPos + 1.5) * cellGap;
        y = (circumCircle * 2.5) + yEvenPos * (3 * circumCircle) + (yPos + 1) * cellGap;
      }
      this.drawHexagon(svg, x, y, circumCircle, allData[cellIndex]);

      xPos++;
      if ((isOddRow && (xPos >= maxCellsOnLine)) || (!isOddRow && (xPos >= (maxCellsOnLine - 1)))) {
        xPos = 0;
        yPos++;
        isOddRow = !isOddRow;
      }
    }
  }

  // https://rechneronline.de/pi/hexagon.php
  // https://www.redblobgames.com/grids/hexagons/

  // Parameters:
  //	 x - x co-ordinate of the hexagon's center on the screen
  //	 y - y co-ordinate of the hexagon's center on the screen
  //	cc - circum circle radius of the hexagon which is equal to the edge length
  drawHexagon(svg, x, y, cc, data) {
    var that = this;
    var polygon = svg.append("polygon");
    polygon.attr("class", "hexagon-tile");
    polygon.attr("style", "fill:" + this.COLOR_SCHEME[data.Status]["background"]);

    // Calculate the 6 vertices for the hexagon
    var numSides = 6;
    var points = "";
    for (var s = 0; s <= numSides; s++) {
      var q = Math.PI * (1 + 2 * s) / numSides;
      var vx = x + cc * Math.cos(q);
      var vy = y + cc * Math.sin(q);
      points += vx + "," + vy + " ";
    }
    polygon.attr("points", points);
    polygon.on("mouseover", function () {
      that.handlePolygonMouseOver(polygon, data);
    });
    polygon.on("mouseout", function () {
      that.handlePolygonMouseOut(polygon);
    });

    // embed the title near the current polygon
    this.drawHexagonLabel(svg, polygon, x, y, cc, data);
  }

  drawHexagonLabel(svg, polygon, x, y, cc, data) {
    var that = this;

    var ccadj = cc * Math.sqrt(3) / 2;

    var circle = svg.append("circle");
    circle.attr("cx", x);
    circle.attr("cy", y);
    circle.attr("r", ccadj);
    circle.attr("fill-opacity", 0);
    circle.attr("style", "cursor: pointer");
    circle.on("mouseover", function () {
      that.handlePolygonMouseOver(polygon, data);
    });
    circle.on("mouseout", function () {
      that.handlePolygonMouseOut(polygon);
      that.tip.hide(data);
    });
    circle.on("click", function () {
      that.handlePolygonMouseClick(that.tip, data);
    });

    var title = svg.append("text");
    title.text(data["Module"]);
    title.attr("x", x - ccadj);
    title.attr("y", y - ccadj);
    title.attr("fill", this.COLOR_SCHEME[data.Status]["text"]);
    title.attr("style", "cursor: pointer; font-size: 12px; font-family: verdana");
    title.on("mouseover", function () {
      that.handlePolygonMouseOver(polygon, data);
    });
    title.on("mouseout", function () {
      that.handlePolygonMouseOut(polygon);
    });
    title.on("click", function () {
      that.handlePolygonMouseClick(that.tip, data);
    });

    d3plus.textwrap().container(title).resize(false).valign("middle").draw();
  }

  handlePolygonMouseOver(polygon, data) {
    polygon.attr("stroke", this.COLOR_SCHEME[data.Status]["highlight"]); //"url(#gradient_" + schemeName + ")");
    polygon.attr("stroke-width", "2");
  }

  handlePolygonMouseOut(polygon) {
    polygon.attr("stroke", "");
  }

  handlePolygonMouseClick(tip, data) {
     //tip.attr( "class", "mytooltip").attr("transform", "translate(60, 100) rotate(30)").html(function (data) {
    tip.html(function (data) {
      return "<strong>Module : </strong>" + "<strong>" + data.Module + "</strong>"
        + "<br><strong>Blueprint(s) : </strong>" + "<strong>" + data.Blueprint + "</strong>"
        + "<br><strong>Category : </strong>" + "<strong>" + data.Category + "</strong>"
        + "<br><hr> "
        + "<br>Function:" + data.Function
        + "<br>Service:" + data.Service
        + "<br>Digital Transformation area:" + data.DigitalTransformationArea
        + "<br>Cloud Environments:" + data.CloudEnvironments
        + "<br>Industry:" + data.Industry
        + "<br>Type:" + data.Type
        + "<br>Language:" + data.Language
        + "<br>Status:" + data.Status
        + "<br>Version:" + data.Version
        + "<br><hr>"
        + "<br>@Documentation"
    }) .show(data);

    // .attr("transform", "translate(60, 60) rotate(30)")
   
    //  tip.on("click", function() {
    // tip.hide();
    //  })
  }

  // getjson(data) {
  //   for(var i=0; i<=data.length; i++)
  //   {
  //     if(data.toLowerCase())
  //   }

  // }



}







