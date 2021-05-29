function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data)
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// DELIVERABLE 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var newOtuIds = otu_ids.slice(0,10).reverse().map(String);
    var yticks = []
    for (let id of newOtuIds) {
      value = `OTU ${id}`
      yticks.push(value)
    }

    var newSample_values = sample_values.slice(0,10).reverse()
    var newOtu_labels = otu_labels.slice(0,10).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: newSample_values,
      y: yticks,
      text: newOtu_labels,
      type: "bar",
      marker: {
        color:"orange"
      },      
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      barmode: "group",
      font: {
        family:"Bai Jamjuree",
        color: "white"
      },
      plot_bgcolor: 'rgb(40, 160, 114)',
      paper_bgcolor: 'rgb(40, 160, 114)'
    };

    var configBar = {responsive: true}
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, configBar);
    // DELIVERABLE 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids.reverse(),
      y: sample_values.reverse(),
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values.reverse(),
        color: otu_ids.reverse(),
        colorscale: "Earth"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "OTU ID"},
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 50
      },
      hovermode: "closest",
      font: {
        family:"Bai Jamjuree",
        color: "white"
      },
      plot_bgcolor: 'rgb(40, 160, 114)',
      paper_bgcolor: 'rgb(40, 160, 114)'
    };
    var configBubble = {responsive: true}

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, configBubble);  
    // DELIVERABLE 3
    var metadata = data.metadata;
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArrayMeta = metadata.filter(sampleObj => sampleObj.id == sample);    
    // 2. Create a variable that holds the first sample in the metadata array.
    var resultMeta = resultArrayMeta[0];
    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(resultMeta.wfreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      gauge: {
        axis: {range: [0, 10]},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange"},
          { range: [4, 6], color: "yellow"},
          { range: [6, 8], color: "lightgreen"},
          { range: [8, 10], color: "green"},
        ]}
    }];
    
    // 5. Create the layout for the gauge chart.
    // Set width to fit inside "gauge" div
    var gaugeLayout = {
      margin: { t: 0, b: 0 },
      font: {
        family:"Bai Jamjuree",
        color: "white"
      },
      plot_bgcolor: 'rgb(40, 160, 114)',
      paper_bgcolor: 'rgb(40, 160, 114)'     
    };

    var configGauge = {responsive: true}

    // (function() {
    //   var d3 = Plotly.d3;
      
    //   var WIDTH_IN_PERCENT_OF_PARENT = 60,
    //       HEIGHT_IN_PERCENT_OF_PARENT = 80;
      
    //   var gd3 = d3.select("gauge")
    //       .append('div')
    //       .style({
    //           width: WIDTH_IN_PERCENT_OF_PARENT + '%',
    //           'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
      
    //           height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
    //           'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
    //       });
    //   var gd = gd3.node();

    // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, configGauge);
  });
    // window.onresize = function() {
    //   Plotly.newPlot.resize(gd);
    // };

}
