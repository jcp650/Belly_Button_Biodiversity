function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    var metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = sampleArray.filter(sampleObj => sampleObj.id === sample);
    // D3-1. Create a variable that filters the metadata array for the object with the desired sample number.
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleNumber[0];
    // D3-2. Create a variable that holds the first sample in the metadata array.
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    // D3-3. Create a variable that holds the washing frequency.
    // D3-1. Create a variable that filters the metadata array for the object with the desired sample number.
    var wfreq = d3.json("samples.json").then(function(data){
          wfreq = data.metadata.map(person => person.id);
          console.log(wfreq);
    });
    // D3-2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = metadata[0];
      console.log(firstMeta);

    // D3-3. Create a variable that holds the washing frequency.
    var wfreqFloat = firstMeta.wfreq;
    console.log(wfreqFloat);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDs.slice(0,10).map(otu_IDs => `OTU ${otu_IDs}`).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     margin: {
       l: 150,
       t: 30,
     }
    
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
    {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      type: 'scatter',
      mode: 'markers',
      marker: { 
        size: sampleValues,
        sizemode: 'area',
        showscale: true,
        color: otuIDs,
        colorscale: 'Viridis'
      }
    }
    ];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
       title: "Bacteria Cultures Per Sample",
       xaxis: {title: "OTUIDS"},
       hovermode: "closest",
       margin: {
         t: 30
       }
          
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [ 
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreqFloat,
        title: {text: "Belly Button Washing Frequency"},
        gauge: {
          axis: {range: [null, 10]},
          bar: {color: "black"},
          steps: [
            {range: [0, 2], color: "green"},
            {range: [2, 4], color: "yellow"},
            {range: [4, 6], color: "blue"},
            {range: [6, 8], color: "orange"},
            {range: [8, 10], color: "red"}
          ]
        }
      }

    ];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 300,
      margin: {
        r: 10,
        
      }
         
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}


