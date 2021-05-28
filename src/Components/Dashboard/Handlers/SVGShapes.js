import { fabric } from "fabric";
import "fabric-history";
const canvasId = localStorage.getItem("canvasId");
const size = JSON.parse(sessionStorage.getItem("size"));

export function addRectangle(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var rect = new fabric.Rect({
    left: 200,
    top: 200,
    fill: "#dedede",
    width: 300,
    height: 200,
    objectCaching: false,
    stroke: "lightgreen",
    strokeWidth: 4,
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    rect.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    rect.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(rect);
  canvas.setActiveObject(rect);
  rect.viewportCenter();
}

export function addCircle(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var circle = new fabric.Circle({
    radius: 70,
    fill: "#dedede",
    top: 200,
    left: 200,
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    circle.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    circle.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(circle);
  canvas.setActiveObject(circle);
  circle.viewportCenter();
}

export function addSquare(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var square = new fabric.Rect({
    left: 200,
    top: 200,
    fill: "#dedede",
    width: 250,
    height: 250,
    objectCaching: false,
    //stroke: "lightgreen",
    //strokeWidth: 4,
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    square.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    square.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(square);
  canvas.setActiveObject(square);
  square.viewportCenter();
}

export function addTriangle(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var triangle = new fabric.Triangle({
    left: 200,
    top: 200,
    width: 200,
    height: 200,
    fill: "#dedede",
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    triangle.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    triangle.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  triangle.viewportCenter();
}

export function addLine(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var line = new fabric.Line([10, 10, 100, 100], {
    fill: "#696969",
    stroke: "#696969",
    left: 200,
    top: 200,
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    line.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    line.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(line);
  canvas.setActiveObject(line);
  line.viewportCenter();
}
export function addEllipse(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var eli = new fabric.Ellipse({
    top: 200,
    left: 200,
    /* Try same values rx, ry => circle */
    rx: 75,
    ry: 50,
    lockScalingFlip: true,
    lockUniScaling: true,
    fill: "#dedede",
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    eli.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    eli.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(eli);
  canvas.setActiveObject(eli);
  eli.viewportCenter();
}

var trapezoid = [
  { x: -100, y: -50 },
  { x: 100, y: -50 },
  { x: 150, y: 50 },
  { x: -150, y: 50 },
];
var emerald = [
  { x: 850, y: 75 },
  { x: 958, y: 137.5 },
  { x: 958, y: 262.5 },
  { x: 850, y: 325 },
  { x: 742, y: 262.5 },
  { x: 742, y: 137.5 },
];
var star4 = [
  { x: 0, y: 0 },
  { x: 100, y: 50 },
  { x: 200, y: 0 },
  { x: 150, y: 100 },
  { x: 200, y: 200 },
  { x: 100, y: 150 },
  { x: 0, y: 200 },
  { x: 50, y: 100 },
  { x: 0, y: 0 },
];
var star5 = [
  { x: 350, y: 75 },
  { x: 380, y: 160 },
  { x: 470, y: 160 },
  { x: 400, y: 215 },
  { x: 423, y: 301 },
  { x: 350, y: 250 },
  { x: 277, y: 301 },
  { x: 303, y: 215 },
  { x: 231, y: 161 },
  { x: 321, y: 161 },
];
var shape = new Array(trapezoid, emerald, star4, star5);

export function addPoly(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var polyg = new fabric.Polygon(shape[1], {
    top: 180,
    left: 200,
    fill: "#dedede",
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    polyg.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    polyg.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(polyg);
  canvas.setActiveObject(polyg);
  polyg.viewportCenter();
}

export function addStar1(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var star1 = new fabric.Polygon(shape[2], {
    top: 200,
    left: 200,
    fill: "#dedede",
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    const size = JSON.parse(sessionStorage.getItem("size"));
    star1.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    star1.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(star1);
  canvas.setActiveObject(star1);
  star1.viewportCenter();
}

export function addStar2(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var star2 = new fabric.Polygon(shape[3], {
    top: 200,
    left: 200,
    fill: "#dedede",
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    star2.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    star2.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(star2);
  canvas.setActiveObject(star2);
  star2.viewportCenter();
}

export function addStar3(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var star3 = new fabric.Polygon(shape[0], {
    top: 200,
    left: 200,
    fill: "#dedede",
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });

  if (size && size.width < 500) {
    star3.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    star3.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(star3);
  canvas.setActiveObject(star3);
  star3.viewportCenter();
}

export function addFrame(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var sframe = new fabric.Rect({
    left: 200,
    top: 200,
    width: 300,
    height: 300,
    objectCaching: false,
    stroke: "#dedede",
    strokeWidth: 8,
    fill: "",
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });

  if (size && size.width < 500) {
    sframe.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    sframe.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(sframe);
  canvas.setActiveObject(sframe);
  sframe.viewportCenter();
}

export function addPolyFrame(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var polyFrame = new fabric.Polygon(shape[1], {
    top: 180,
    left: 200,
    fill: "",
    stroke: "#dedede",
    strokeWidth: 8,
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    polyFrame.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    polyFrame.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(polyFrame);
  canvas.setActiveObject(polyFrame);
  polyFrame.viewportCenter();
}

export function addCircleFrame(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var circleFrame = new fabric.Circle({
    radius: 70,
    fill: "",
    top: 200,
    left: 200,
    stroke: "#dedede",
    strokeWidth: 4,
    lockScalingFlip: true,
    lockUniScaling: true,
    minScaleLimit: 0.1,
  });
  if (size && size.width < 500) {
    circleFrame.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
    circleFrame.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
  }
  canvas.add(circleFrame);
  canvas.setActiveObject(circleFrame);
  circleFrame.viewportCenter();
}

export function addSVG(canvas, url) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  fabric.loadSVGFromURL(url, function (objects, options) {
    var loadedObjects = fabric.util.groupSVGElements(objects, options);

    loadedObjects.set({
      width: 200,
      height: 200,
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });

    canvas.add(loadedObjects);

    canvas.renderAll();
  });
}

export function addSVG2(canvas, url) {
  const size = JSON.parse(sessionStorage.getItem("size"));

  var group = [];
  fabric.loadSVGFromURL(
    url,
    function (objects, options) {
      var loadedObjects = new fabric.Group(group);
      loadedObjects.set({
        left: canvas.getHeight() - 400,
        top: size.height / 3 + 10,
        width: 500,
        height: 500,
        scaleX: 0.2,
        scaleY: 0.2,
        crossOrigin: "anonymous",
        lockScalingFlip: true,
        lockUniScaling: true,
        minScaleLimit: 0.1,
      });

      options.crossOrigin = "anonymous";
      if (size && size.width < 500) {
        loadedObjects.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
        loadedObjects.scaleToHeight(
          size ? size.height : canvas.getHeight() - 350
        );
        loadedObjects.set("scaleX", 0.1);
        loadedObjects.set("scaleY", 0.1);
      } else {
        loadedObjects.scaleToWidth(canvas.getWidth());
        loadedObjects.scaleToHeight(canvas.getHeight());
      }
      canvas.add(loadedObjects);
      canvas.setActiveObject(loadedObjects);
      loadedObjects.viewportCenter();
      canvas.renderAll();
    },
    function (item, object) {
      object.set("id", item.getAttribute("id"));
      group.push(object);
    }
  );
}

export function addGif(canvas, url, width, height) {
  console.log(width, "++", height);
  const id = "gif" + Math.random();
  var video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.setAttribute("crossorigin", "anonymous");
  video.src = url;

  video.autoplay = true;
  video.width = width;
  video.height = height;
  video.controls = true;
  video.loop = true;
  video.setAttribute("id", id);
  document.getElementById("body").appendChild(video).style.display = "none";
  var imgElement = document.getElementById(id);
  imgElement.loop = true;
  if (imgElement) {
    var imgInstance = new fabric.Image(imgElement, {
      left: 200,
      top: 300,
      originX: "center",
      originY: "center",
      objectCaching: false,
      width: 300,
      height: 300,
      lockScalingFlip: true,
      backgroundColor: 0,
      backgroundImage: 0,
      minScaleLimit: 0.1,
    });
    imgInstance.crossOrigin = "anonymous";
    canvas.add(imgInstance);
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
    imgInstance.getElement().play();
    setTimeout(function () {
      canvas.requestRenderAll();
    }, 10);
    console.log(canvas.getObjects());
  }
}

export function addGiphy(canvas, url, width, height) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  //console.log(width, "++", height);
  if (url) {
    const id = "gif" + Math.random();
    var img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;

    //img.autoplay = true;
    img.width = width;
    img.height = height;
    //img.controls = true;
    //img.loop = true;
    img.setAttribute("id", id);
    document.getElementById("body").appendChild(img).style.display = "none";

    var imgElement = document.getElementById(id);
    imgElement.loop = true;
    if (imgElement) {
      var imgInstance = new fabric.Image(imgElement, {
        left: 200,
        top: 220,
        //originX: "center",
        //originY: "center",
        objectCaching: false,
        crossOrigin: "anonymous",
        width: 520,
        height: 520,
        //myType: "image",
        lockScalingFlip: true,
        backgroundColor: 0,
        backgroundImage: 0,
        imageType: "giphy",
        lockUniScaling: true,
        minScaleLimit: 0.1,
      });

      fabric.Object.prototype.toObject = (function (toObject) {
        return function (properties) {
          return fabric.util.object.extend(toObject.call(this, properties), {
            imageType: "giphy",
          });
        };
      })(fabric.Object.prototype.toObject);

      if (size && size.width < 500) {
        imgInstance.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
        imgInstance.scaleToHeight(
          size ? size.height : canvas.getHeight() - 350
        );
        imgInstance.set("scaleX", 0.1);
        imgInstance.set("scaleY", 0.1);
      }
      imgInstance.crossOrigin = "anonymous";
      imgInstance.imageType = "giphy";
      //imgInstance.myType = "image";
      imgInstance.setControlsVisibility({
        mt: false,
        mb: false,
      });
      //imgInstance.setCoords();
      canvas.setActiveObject(imgInstance);
      canvas.add(imgInstance);

      fabric.util.requestAnimFrame(function render() {
        fabric.util.requestAnimFrame(render);
        canvas.renderAll();
      });

      //imgInstance.getElement().play();
      imgInstance.viewportCenter();
      setTimeout(function () {
        canvas.requestRenderAll();
      }, 0);
    }
  }
}
