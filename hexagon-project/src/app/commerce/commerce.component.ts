import { Component, OnInit } from '@angular/core';
import { HexogoanService } from './services/hexgoan-service';
import { analyzeAndValidateNgModules } from '@angular/compiler';


declare let d3: any;

@Component({
  selector: 'app-commerce',
  templateUrl: './commerce.component.html',
  styleUrls: ['./commerce.component.css'],
  providers : [HexogoanService]
})
export class CommerceComponent implements OnInit {
  // d3.select("body svg").remove();

  data:any;
  tip:any; 
  vis:any;
  constructor(private hexogoanService:HexogoanService) { }


calResult(data){
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = this.data.length; _i < _len; _i++) {
      var d = this.data[_i];
      _results.push(this.newHex(d));
    }
    return _results;
}

  getHexgoan(tip,vis){  

            var hexes = {
              type: 'FeatureCollection',
              features: this.calResult(this.data)
            };
          
            /* define a color scale
            */
          var colorify = d3.scale.category10()
            .range(['rgb(51,204,51)', 'rgb(68,114,196)', 'rgb(68,114,196)', '#e78ac3', '#a6d854', '#ffd92f']);
            /* custom projection to make hexagons appear regular (y axis is also flipped)
            */
          var  radius = 32;
          var dx = radius * 3.5 * Math.sin(Math.PI / 3);
            var dy = radius * 2.3;
          var path_generator = d3.geo.path().projection(d3.geo.transform({
              point: function(x, y) {
                return this.stream.point(x * dx / 2, -(y - (2 - (y & 1)) / 3) * dy / 2);
              }
            }));
            /* draw the result
            */
          
          vis.selectAll('.hex').data(hexes.features).enter().append('path').attr('class', 'hex').style('fill', function(d) {
          
              return colorify(d.properties.type);
            }).attr('d', path_generator)
            .on('click', function(d, i) { 
              d3.selectAll(".hex").classed("country-on", false);
              d3.select("#country" + d.properties.iso_a3).classed("country-on", true);     
            }) 
          .on('mouseover', function(data) { 
            d3.select(this).attr("opacity", 1.5).attr('class', 'MouseOverhex');  
              tip.html(function() {    
                return "<strong>Module:</strong> " + "<strong>" + data.properties.data.Module +"</strong>" 
            + "<br><strong>Blueprint(s):" + "<strong>"+ data.properties.data.Blueprint +"</strong>" 
            + "<br><strong>Category</strong>:" + "<strong>" + data.properties.data.Category +"</strong>" 
            + "<br><hr> "
            + "<br>Digital Transformation area:" + data.properties.data.DigitalTransformationArea  
            + "<br>Cloud Environments:" + data.properties.data.CloudEnvironments
            + "<br>Industry:" + data.properties.data.Industry
            + "<br>Type:" + data.properties.data.Type
            + "<br>Language:" + data.properties.data.Language
            + "<br>Status:" + data.properties.data.Status
            + "<br>Version:" + data.properties.data.Version
            + "<br><hr>"
            + "<br>@Documentation:" 
              
        }).show(data);	         
        })
              .on('mouseout', function(d){
              d3.select(this).attr("opacity", 1).attr('class', 'hex');
              tip.hide(d);	
              
            })
}



  
   //let new_hex;
   newHex(d:any) {
        /* conversion from hex coordinates to rect
        */
        var x, y;
        x = 2 * (d.x + d.z / 2.0);
        y = 2 * d.z;
        return {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[x, y + 2], [x + 1, y + 1], [x + 1, y], [x, y - 1], [x - 1, y], [x - 1, y + 1], [x, y + 2]]]
          },
          properties: {
            type: d.type,
            data: d,
          }
        };
  };


    ngOnInit() {
    let width  = 1200;
    let height = 600;  
    let svg = d3.select('body').append('svg').attr('width', width).attr('height', height); 
    this.vis = svg.append('g').attr('transform', 'translate(400,300)'); 
    this.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

    // Service
    
    svg.call(this.tip);



      this.hexogoanService.getHex().subscribe(result => {
        console.log(result);
        this.data = result;  

        if(this.data !=null){
          this.getHexgoan(this.tip,this.vis);
        } 
      }); 
      
  }; // ngOnInit





 
}


