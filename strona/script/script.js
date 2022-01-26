require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/FeatureLayer',
    'esri/Graphic',
    'esri/layers/GraphicsLayer',
    'esri/renderers/SimpleRenderer',
    'esri/renderers/visualVariables/VisualVariable',
    'esri/renderers/visualVariables/SizeVariable',
    'esri/widgets/Legend',
    "esri/widgets/LayerList",

  ], (Map, SceneView,FeatureLayer,Graphic, GraphicsLayer, SimpleRenderer, VisualVariable, SizeVariable, Legend, LayerList)=>{

  const fl = new FeatureLayer({
      url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
  });
  const fl2 = new FeatureLayer({
      url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    
  });

  let gl = new GraphicsLayer();

  const map1 = new Map({
    basemap: "topo-vector",
    layers: [fl2, gl]
  });

  const view = new SceneView({
    map: map1,
    container: "mapDiv",
    zoom: 5,
    center:[-101.331313, 39.172149]
  });  

  const legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: fl2
      }
    ]
    
  });

  view.ui.add(legend, {position: "bottom-right"});

 let query = fl.createQuery();
  query.where = "MAGNITUDE > 4";
  query.outFields =  ["*"];
  query.returnGeometry = true;

  fl.queryFeatures(query)
    .then(response => {
        console.log(response);
        getResults(response.features);
    })
    .catch(err => {
        console.log(err);
    })

  const getResults = (features) => {
    let symbol = {
      type: 'simple-marker',
      size: 15,
      color: "green",
      style: "circle"
    };
    
    features.map(elem => {
      elem.symbol = symbol;
    });

    gl.addMany(features);

    const simpleRenderer ={
      type: 'simple',
      symbol: {
          type: 'point-3d',
          symbolLayers:[
            {
              type:'object',
              resource:{
                primitive: 'cylinder'
              },
              width: 25000
            }
          ]
          
      },
      visualVariables: [
        {
          type:"color",
          field:"MAGNITUDE",
          stops:[
            {
              value: 0.5 ,
              color:"green",
            },
            {
              value: 1.12998071359691,
              color:"yellow",
            },
            {
              value: 4.48,
              color:"red",
            }
          ]
        },
        {
          type: 'size',
          field: 'DEPTH',
          stops:[
            {
              value: -3.39,
              size: 20000
            },
            {
              value: 30.97,
              size: 120000
            }
          ]
        }
      ]

  }

  fl2.renderer = simpleRenderer;

}

const layerlist = new LayerList({
  view: view,
}); 
  
view.ui.add(layerlist, "bottom-left")

});