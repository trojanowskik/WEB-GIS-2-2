require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/FeatureLayer',
    'esri/Graphic',
    'esri/layers/GraphicsLayer',
    'esri/renderers/SimpleRenderer',
    'esri/renderers/visualVariables/VisualVariable',
    'esri/renderers/visualVariables/SizeVariable',

  ], (Map, SceneView,FeatureLayer,Graphic, GraphicsLayer, SimpleRenderer, VisualVariable, SizeVariable)=>{

  const fl = new FeatureLayer({
      url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    
  });

  let gl = new GraphicsLayer();

  const map1 = new Map({
    basemap: "topo-vector",
    layers: [fl,gl]
  });

  const view = new SceneView({
    map: map1,
    container: "mapDiv",
    zoom: 5,
    center:[-101.331313, 39.172149]
  });  

  const geom = {
    type: "point",
    longitude: 25,
    latitude: 52
  };

  const symbol = {
    type: "simple-marker",
    style: "x",
    color: "red",
    size: 14,
    outline: {
        color: "red"
    }
  };

  const attr = {
    name: "Polska",
    code: "POL"
  };

  const graph = new Graphic({
    geometry: geom,
    symbol: symbol,
    attributes: attr,
  });
/*
  gl.add(graph);
  
  let query = fl.createQuery();
  query.where = "MAGNITUDE < '4' " ;
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
    const symbol = {
        type: "simple-marker",
        color: "red",
        size: 8
    };

    features.map(elem => {
        elem.symbol = symbol
    });

    gl.addMany(features);
}
*/
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

  fl.renderer = simpleRenderer;

});