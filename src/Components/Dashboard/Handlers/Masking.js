import { fabric } from "fabric";
import "fabric-history";

//import { Polygon } from "fabric/fabric-impl";
//var FontFaceObserver = require("fontfaceobserver");
const size = JSON.parse(sessionStorage.getItem("size"));
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

export function maskImage(canvas, url, type) {
  // Note the use of the `originX` and `originY` properties, which we set
  // to 'left' and 'top', respectively. This makes the math in the `clipTo`
  // functions a little bit more straight-forward.
  if (type == "rect") {
    var clipRect1 = new fabric.Rect({
      left: 280,
      top: 100,
      width: 400,
      height: 400,
      fill: "#DDD" /* use transparent for no fill */,
      strokeWidth: 0,
      selectable: false,
    });
    // We give these `Rect` objects a name property so the `clipTo` functions can
    // find the one by which they want to be clipped.

    canvas.add(clipRect1);

    // Since the `angle` property of the Image object is stored
    // in degrees, we'll use this to convert it to radians.
    function degToRad(degrees) {
      return degrees * (Math.PI / 180);
    }

    var pugImg = new Image();
    pugImg.src = url;
    pugImg.onload = function (img) {
      var pug = new fabric.Image(pugImg, {
        angle: 0,
        width: pugImg.width,
        height: pugImg.height,
        scaleX: 0.55,
        scaleY: 0.55,
        left: 160,
        top: 100,
        clipName: "pug",
        clipTo: function (ctx) {
          pug.setCoords();

          var clipRect = clipRect1;

          var scaleXTo1 = 1 / pug.scaleX;
          var scaleYTo1 = 1 / pug.scaleY;
          ctx.save();

          var ctxLeft = -(pug.width / 2) + clipRect.strokeWidth - 8;
          var ctxTop = -(pug.height / 2) + clipRect.strokeWidth - 8;
          var ctxWidth = clipRect.width - clipRect.strokeWidth + 1;
          var ctxHeight = clipRect.height - clipRect.strokeWidth + 1;

          ctx.translate(ctxLeft, ctxTop);
          ctx.rotate(degToRad(pug.angle * -1));
          ctx.scale(scaleXTo1, scaleYTo1);
          ctx.beginPath();
          ctx.rect(
            clipRect.left - pug.oCoords.tl.x,
            clipRect.top - pug.oCoords.tl.y,
            ctxWidth,
            ctxHeight
          );

          ctx.closePath();
          ctx.restore();
        },
      });

      canvas.add(pug);
    };
  }
  if (type == "circle") {
    var circle = new fabric.Circle({
      radius: 200,
      top: 200,
      left: 200,
      minScaleLimit: 0.1,
      fill: "#DDD" /* use transparent for no fill */,
      strokeWidth: 1,
      selectable: false,
    });

    canvas.add(circle);

    function degToRad(degrees) {
      return degrees * (Math.PI / 180);
    }

    var pugImg = new Image();
    pugImg.src = url;
    pugImg.onload = function (img) {
      var pug = new fabric.Image(pugImg, {
        angle: 0,
        scaleX: 0.5,
        scaleY: 0.5,
        left: 200,
        top: 200,
        clipName: "pug",

        clipTo: function (ctx) {
          pug.setCoords();
          var clipRect = circle;
          var scaleXTo1 = 1 / pug.scaleX;
          var scaleYTo1 = 1 / pug.scaleY;

          ctx.save();

          var ctxLeft = -clipRect.left + 50;
          var ctxTop = -clipRect.top + 50;

          ctx.translate(ctxLeft, ctxTop);
          ctx.rotate(degToRad(pug.angle * -1));
          ctx.scale(scaleXTo1, scaleYTo1);

          ctx.beginPath();
          ctx.arc(
            clipRect.left - pug.oCoords.tl.x,
            clipRect.top - pug.oCoords.tl.y,
            clipRect.radius,
            0,
            2 * Math.PI,
            false
          );
          ctx.fill();
          ctx.closePath();
          ctx.restore();
        },
      });

      canvas.add(pug);
      //console.log(canvas.getObjects());
    };
  }
  if (type == "poly") {
    var polyg = new fabric.Polygon(shape[0], {
      top: 180,
      left: 200,
      fill: "#DDD",
      width: 400,
      height: 400,
      selectable: false,
    });

    canvas.add(polyg);

    function degToRad(degrees) {
      return degrees * (Math.PI / 180);
    }

    var pugImg = new Image();
    pugImg.src = url;
    pugImg.onload = function (img) {
      var pug = new fabric.Image(pugImg, {
        angle: 0,
        scaleX: 0.5,
        scaleY: 0.5,
        left: 200,
        top: 180,
        width: pugImg.width,
        height: pugImg.height,
        clipName: "pug",

        clipTo: function (ctx) {
          pug.setCoords();
          var clipRect = polyg;
          var scaleXTo1 = 1 / pug.scaleX;
          var scaleYTo1 = 1 / pug.scaleY;

          ctx.save();

          var ctxLeft = -clipRect.left + 50;
          var ctxTop = -clipRect.top + 50;
          var ctxWidth = clipRect.width - clipRect.strokeWidth + 1;
          var ctxHeight = clipRect.height - clipRect.strokeWidth + 1;
          ctx.translate(ctxLeft, ctxTop);
          ctx.rotate(degToRad(pug.angle * -1));
          ctx.scale(scaleXTo1, scaleYTo1);

          ctx.beginPath();
          var isPolygon = clipRect instanceof fabric.Polygon;
          // polygon cliping area

          if (!isPolygon) {
            // prepare points of polygon
            var points = [];
            for (let i in shape[1])
              points.push({
                x:
                  clipRect.left +
                  ctxWidth / 2 +
                  trapezoid[i].x -
                  pug.oCoords.tl.x,
                y:
                  clipRect.top +
                  ctxHeight / 2 +
                  trapezoid[i].y -
                  pug.oCoords.tl.y,
              });

            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; ++i) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.lineTo(points[0].x, points[0].y);
          }
          // rectangle cliping area
          else {
            ctx.rect(
              clipRect.left - pug.oCoords.tl.x,
              clipRect.top - pug.oCoords.tl.y,
              clipRect.width,
              clipRect.height
            );
          }
          ctx.fill();
          ctx.closePath();
          ctx.restore();
        },
      });

      canvas.add(pug);
      //  console.log(canvas.getObjects());
    };
  }
}

export function ImageFit(canvas, url) {
  var circle = new fabric.Circle({
    radius: 500,
    fill: "green",
    left: 100,
    top: 100,
  });

  canvas.add(circle);

  loadPattern(url, circle);

  function loadPattern(url, obj) {
    fabric.util.loadImage(url, function (img) {
      obj.setPatternFill({
        source: img,

        repeat: "no-repeat",
      });
      canvas.renderAll();
    });
  }
}

export function clipped(canvas, url) {
  fabric.Image.fromURL(url, function (img) {
    canvas.clear();
    img.clipPath = new fabric.Circle({
      radius: 100,
      //originX: 'center',
      //originY: 'center',
      absolutePositioned: true,
      top: 50,
      left: 100,
    });
    canvas.add(img).renderAll();
  });
}

export function circleMask(canvas, category) {
  var circle;
  if (category !== "fac" && category !== "soc") {
    circle = new fabric.Circle({
      radius: 160,
      //fixed: true,
      fill: "",
      scaleX: size ? 1 + size.zoomValue : 1,
      scaleY: size ? 1 + size.zoomValue : 1,
      originX: "center",
      originY: "center",
      maskname: "circle",
      isShape: "circle",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  } else {
    circle = new fabric.Circle({
      radius: 160,
      //fixed: true,
      fill: "",
      scaleX: 1,
      scaleY: 1,
      maskname: "circle",
      isShape: "circle",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  }

  //pug.scaleToWidth(canvas.getWidth());
  //pug.scaleToHeight(canvas.getHeight());
  canvas.add(circle);
  //canvas.sendToBack(circle);
  circle.viewportCenter();
  canvas.setActiveObject(circle);
  canvas.renderAll();

  /*let pugImg = new Image();
  pugImg.crossOrigin = "anonymous";
  pugImg.src = url;

  //console.log(size.zoom);
  /*pugImg.onload = function (img) {
    let pug = new fabric.Image(pugImg, {
      crossOrigin: "anonymous",
      scaleX: 0.25,
      scaleY: 0.25,
      top: 300,
      left: 100,
      clipPath: circle,
      clipTo: function (ctx) {
        clipMyObject(this, ctx);
      },
    });
    pug.crossOrigin = "anonymous";
    pug.backgroundVpt = false;
    pug.setControlsVisibility({
      mt: false,
      mb: false,
    });
    canvas.add(pug);
    canvas.renderAll();
  };*/
}

export function rectMask(canvas, category) {
  var Rect;
  if (category !== "fac" && category !== "soc") {
    Rect = new fabric.Rect({
      width: 400,
      height: 200,
      fixed: true,
      fill: "",
      scaleX: size ? 1 + size.zoomValue : 1,
      scaleY: size ? 1 + size.zoomValue : 1,
      maskname: "rect",
      isShape: "circle",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  } else {
    Rect = new fabric.Rect({
      width: 400,
      height: 200,
      fixed: true,
      fill: "",
      scaleX: 1,
      scaleY: 1,
      maskname: "rect",
      isShape: "circle",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  }

  canvas.add(Rect);
  Rect.viewportCenter();
  canvas.renderAll();
}

export function triangleMask(canvas, category) {
  var Triangle;
  if (category !== "fac" && category !== "soc") {
    Triangle = new fabric.Triangle({
      width: 400,
      height: 400,
      fixed: true,
      fill: "",
      scaleX: size ? 1 + size.zoomValue : 1,
      scaleY: size ? 1 + size.zoomValue : 1,
      maskname: "triangle",
      isShape: "triangle",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  } else {
    Triangle = new fabric.Triangle({
      width: 400,
      height: 400,
      fixed: true,
      fill: "",
      scaleX: 1,
      scaleY: 1,
      maskname: "triangle",
      isShape: "triangle",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  }
  canvas.add(Triangle);
  Triangle.viewportCenter();
  canvas.renderAll();
}

export function ellipseMask(canvas, category) {
  var eli;
  if (category !== "fac" && category !== "soc") {
    eli = new fabric.Ellipse({
      /* Try same values rx, ry => circle */
      rx: 175,
      ry: 100,
      width: 300,
      height: 300,
      fixed: true,
      fill: "",
      scaleX: size ? 1 + size.zoomValue : 1,
      scaleY: size ? 1 + size.zoomValue : 1,
      maskname: "ellipse",
      isShape: "ellipse",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  } else {
    eli = new fabric.Ellipse({
      /* Try same values rx, ry => circle */
      rx: 175,
      ry: 100,
      width: 300,
      height: 300,
      fixed: true,
      fill: "",
      scaleX: 1,
      scaleY: 1,
      isShape: "ellipse",
      maskname: "ellipse",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  }

  canvas.add(eli);
  eli.viewportCenter();
  canvas.renderAll();
}

export function polygonMask(canvas, category) {
  var polyg;
  if (category !== "fac" && category !== "soc") {
    polyg = new fabric.Polygon(shape[1], {
      fill: "",
      fixed: true,
      scaleX: size ? 1 + size.zoomValue : 1,
      scaleY: size ? 1 + size.zoomValue : 1,
      maskname: "polygon",
      isShape: "polygon",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  } else {
    polyg = new fabric.Polygon(shape[1], {
      fill: "",
      fixed: true,
      scaleX: 1,
      scaleY: 1,
      maskname: "polygon",
      isShape: "polygon",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  }

  canvas.add(polyg);
  polyg.viewportCenter();
  canvas.renderAll();
}

export function star1Mask(canvas, category) {
  var star1;
  if (category !== "fac" && category !== "soc") {
    star1 = new fabric.Polygon(shape[2], {
      fill: "",
      fixed: true,
      scaleX: size ? 1 + size.zoomValue : 1,
      scaleY: size ? 1 + size.zoomValue : 1,
      maskname: "star1",
      isShape: "star1",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  } else {
    star1 = new fabric.Polygon(shape[2], {
      fill: "",
      fixed: true,
      scaleX: 1,
      scaleY: 1,
      maskname: "star1",
      isShape: "star1",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  }
  canvas.add(star1);
  star1.viewportCenter();
  canvas.renderAll();
}

export function star2Mask(canvas, category) {
  var star2;
  if (category !== "fac" && category !== "soc") {
    star2 = new fabric.Polygon(shape[3], {
      fill: "",
      fixed: true,
      scaleX: size ? 1 + size.zoomValue : 1,
      scaleY: size ? 1 + size.zoomValue : 1,
      maskname: "star2",
      isShape: "star2",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  } else {
    star2 = new fabric.Polygon(shape[3], {
      fill: "",
      fixed: true,
      scaleX: 1,
      scaleY: 1,
      maskname: "star2",
      isShape: "star2",
      absolutePositioned: true,
      stroke: "1",
      lockScalingFlip: true,
      lockUniScaling: true,
      minScaleLimit: 0.1,
    });
  }
  canvas.add(star2);
  star2.viewportCenter();
  canvas.renderAll();
}

export function fillMe(canvas, url, bin, category) {
  let pugImg = new Image();
  pugImg.crossOrigin = "anonymous";
  pugImg.src = url;

  //console.log(size.zoom);
  pugImg.onload = function (img) {
    let pug = new fabric.Image(pugImg, {
      crossOrigin: "anonymous",
      top: bin.top - bin.top / 2 + 20,
      left: bin.left - bin.left / 3,
      originX: "center",
      originY: "center",
      //selectable : false
      maskname: bin.maskname ? bin.maskname : "",
      lockScalingFlip: true,
      lockUniScaling: true,
      clipTo: function (ctx) {
        ctx.beginPath();
        clipMyObject(this, ctx);
      },
    });
    pug.clipPath = bin;
    pug.crossOrigin = "anonymous";
    pug.backgroundVpt = false;
    if (category == "fac" || category == "soc") {
      let scale =
        pug.height < pug.width
          ? pug.height / pug.width
          : pug.width / pug.height - 0.35;
      pug.set("top", bin.top);
      pug.set("left", bin.left);
      pug.set("scaleY", scale < bin.scaleX ? scale : bin.scaleX / 2);
      pug.set("scaleX", scale < bin.scaleY ? scale : bin.scaleY / 2);
    } else {
      let scale =
        pug.height < pug.width
          ? pug.height / pug.width + 0.35
          : pug.width / pug.height + 0.2;
      pug.set("top", bin.top);
      pug.set("left", bin.left);
      pug.set("scaleY", scale);
      pug.set("scaleX", scale);
    }

    /* if (bin.maskname == "star2") {
      pug.set("top", bin.top);
      pug.set("scaleY", bin.scaleY / 2);
      pug.set("scaleX", bin.scaleX / 2);
    }

    if (bin.maskname == "star1") {
      pug.set("top", bin.top);
      pug.set("scaleY", bin.scaleY / 2);
      pug.set("scaleX", bin.scaleX / 2);
    }

    if (bin.maskname == "ellipse") {
      pug.set("top", bin.top);
      pug.set("scaleY", bin.scaleY / 2);
      pug.set("scaleX", bin.scaleX / 2);
    }

    if (bin.maskname == "polygon") {
      pug.set("top", bin.top);
      pug.set("scaleY", bin.scaleY / 2);
      pug.set("scaleX", bin.scaleX / 2);
    }

    if (bin.maskname == "triangle") {
      pug.set("top", bin.top);
      pug.set("scaleY", bin.scaleY / 2);
      pug.set("scaleX", bin.scaleX / 2);
    }
    if (bin.maskname == "rect") {
    }
    if (bin.maskname == "circle") {
      if (category == "fac" || category == "soc") {
        let scale =
          pug.height < pug.width
            ? pug.height / pug.width
            : pug.width / pug.height - 0.35;
        pug.set("top", bin.top);
        pug.set("left", bin.left);
        pug.set("scaleY", scale < bin.scaleX ? scale : bin.scaleX / 2);
        pug.set("scaleX", scale < bin.scaleY ? scale : bin.scaleY / 2);
      } else {
        let scale =
          pug.height < pug.width
            ? pug.height / pug.width + 0.35
            : pug.width / pug.height + 0.2;
        pug.set("top", bin.top);
        pug.set("left", bin.left);
        pug.set("scaleY", scale);
        pug.set("scaleX", scale);
      }
    }
    if (bin.maskname == "heart") {
      pug.set("top", bin.top - bin.top / 2 + 20);
      pug.set("left", bin.left - bin.left / 2);
      pug.set("scaleY", bin.scaleY - 0.2);
      pug.set("scaleX", bin.scaleX - 0.2);
    }

    if (bin.maskname == "bili") {
      pug.set("top", bin.top - bin.top / 2 + 20);
      pug.set("scaleY", bin.scaleX + 0.2);
      pug.set("scaleX", bin.scaleY + 0.2);
    }*/
    pug.setControlsVisibility({
      mt: false,
      mb: false,
    });
    canvas.add(pug);
    canvas.renderAll();
  };
}

export function biliMask(canvas, url) {
  var bili = new fabric.Path(
    "M85.6,606.2c-13.2,54.5-3.9,95.7,23.3,130.7c27.2,35-3.1,55.2-25.7,66.1C60.7,814,52.2,821,50.6,836.5c-1.6,15.6,19.5,76.3,29.6,86.4c10.1,10.1,32.7,31.9,47.5,54.5c14.8,22.6,34.2,7.8,34.2,7.8c14,10.9,28,0,28,0c24.9,11.7,39.7-4.7,39.7-4.7c12.4-14.8-14-30.3-14-30.3c-16.3-28.8-28.8-5.4-33.5-11.7s-8.6-7-33.5-35.8c-24.9-28.8,39.7-19.5,62.2-24.9c22.6-5.4,65.4-34.2,65.4-34.2c0,34.2,11.7,28.8,28.8,46.7c17.1,17.9,24.9,29.6,47.5,38.9c22.6,9.3,33.5,7.8,53.7,21c20.2,13.2,62.2,10.9,62.2,10.9c18.7,6.2,36.6,0,36.6,0c45.1,0,26.5-15.6,10.1-36.6c-16.3-21-49-3.1-63.8-13.2c-14.8-10.1-51.4-25.7-70-36.6c-18.7-10.9,0-30.3,0-48.2c0-17.9,14-31.9,14-31.9h72.4c0,0,56-3.9,70.8,26.5c14.8,30.3,37.3,36.6,38.1,52.9c0.8,16.3-13.2,17.9-13.2,17.9c-31.1-8.6-31.9,41.2-31.9,41.2c38.1,50.6,112-21,112-21c85.6-7.8,79.4-133.8,79.4-133.8c17.1-12.4,44.4-45.1,62.2-74.7c17.9-29.6,68.5-52.1,113.6-30.3c45.1,21.8,52.9-14.8,52.9-14.8c15.6,2.3,20.2-17.9,20.2-17.9c20.2-22.6-15.6-28-16.3-84c-0.8-56-47.5-66.1-45.1-82.5c2.3-16.3,49.8-68.5,38.1-63.8c-10.2,4.1-53,25.3-63.7,30.7c-0.4-1.4-1.1-3.4-2.5-6.6c-6.2-14-74.7,30.3-74.7,30.3s-108.5,64.2-129.6,68.9c-21,4.7-18.7-9.3-44.3-7c-25.7,2.3-38.5,4.7-154.1-44.4c-115.6-49-326,29.8-326,29.8s-168.1-267.9-28-383.4C265.8,13,78.4-83.3,32.9,168.8C-12.6,420.9,98.9,551.7,85.6,606.2z",
    {
      fixed: true,
      fill: "#000",
      stroke: "black",
      strokeWidth: 1,
      maskname: "bili",
      isShape: "bili",
      scaleX: 0.5,
      scaleY: 0.5,
    }
  );

  canvas.add(bili);
  bili.viewportCenter();
  canvas.renderAll();

  /*let pugImg = new Image();
  pugImg.crossOrigin = "anonymous";
  pugImg.src = url;

  //console.log(size.zoom);
  pugImg.onload = function (img) {
    let pug = new fabric.Image(pugImg, {
      crossOrigin: "anonymous",
      scaleX: 0.5,
      scaleY: 0.5,
      top: 0,
      left: 180,
      clipPath: bili,
      clipTo: function (ctx) {
        clipMyObject(this, ctx);
      },
    });
    pug.crossOrigin = "anonymous";
    pug.backgroundVpt = false;
    pug.setControlsVisibility({
      mt: false,
      mb: false,
    });
    canvas.add(pug);
    canvas.renderAll();
  };*/
}

export function heartMask(canvas, url) {
  var bili = new fabric.Path(
    "M 272.70141,238.71731 \
    C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731  \
    C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 \
    C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 \
    C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731  \
    C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 \
    C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731  \
    z ",
    {
      fixed: true,
      fill: "",
      maskname: "heart",
      stroke: "0.6",
      scaleX: 1,
      isShape: "heart",
      absolutePositioned: true,
      scaleY: 1,
    }
  );

  canvas.add(bili);
  bili.viewportCenter();
  canvas.renderAll();
}

export function clipMyObject(thisObj, ctx) {
  if (thisObj.clipPath) {
    ctx.save();
    if (thisObj.clipPath.fixed) {
      var retina = thisObj.canvas.getRetinaScaling();
      ctx.setTransform(retina, 0, 0, retina, 0, 0);
      // to handle zoom
      ctx.transform.apply(ctx, thisObj.canvas.viewportTransform);
      thisObj.clipPath.transform(ctx);
    }

    thisObj.clipPath._render(ctx);
    ctx.restore();
    ctx.clip();
    var x = -thisObj.width / 2,
      y = -thisObj.height / 2,
      elementToDraw;

    if (
      thisObj.isMoving === false &&
      thisObj.resizeFilter &&
      thisObj._needsResize()
    ) {
      thisObj._lastScaleX = thisObj.scaleX;
      thisObj._lastScaleY = thisObj.scaleY;
      thisObj.applyResizeFilters();
    }
    elementToDraw = thisObj._element;
    elementToDraw &&
      ctx.drawImage(
        elementToDraw,
        0,
        0,
        thisObj.width,
        thisObj.height,
        x,
        y,
        thisObj.width,
        thisObj.height
      );
    thisObj._stroke(ctx);
    thisObj._renderStroke(ctx);
  }
}

export function dragMe(canvas, url) {
  var clipPath1 = new fabric.Rect({
    width: 250,
    height: 250,
    top: 0,
    left: 0,
    stroke: "#000",
    strokeWidth: 1,
    absolutePositioned: true,
  });

  var clipPath2 = new fabric.Rect({
    width: 150,
    height: 150,
    top: 0,
    left: 300,
    stroke: "#000",
    strokeWidth: 1,
    absolutePositioned: true,
  });

  fabric.Image.fromURL(url, function (img) {
    img.clipPath = clipPath1;
    img.scaleToWidth(500);
    canvas.add(img);
  });

  fabric.Image.fromURL(url, function (img) {
    img.clipPath = clipPath2;
    img.scaleToWidth(500);
    canvas.add(img);
  });
}
export function pattrenMe(
  canvas,
  url,
  leftPos,
  topPos,
  anglePos,
  pattrenName,
  sX,
  sY,
  wid,
  hig,
  rad
) {
  fabric.Object.prototype.transparentCorners = false;

  var padding = 0;

  let pugImg = new Image();
  pugImg.crossOrigin = "anonymous";
  pugImg.src = url;
  pugImg.width = wid;
  //console.log(size.zoom);
  pugImg.onload = function (img) {
    let pug = new fabric.Image(pugImg, {
      //width: 500,
    });

    pug.scaleToWidth(500);
    var patternSourceCanvas = new fabric.StaticCanvas();
    patternSourceCanvas.add(pug);
    patternSourceCanvas.renderAll();
    var pattern = new fabric.Pattern({
      source: function () {
        if (pug.getScaledWidth()) {
          patternSourceCanvas.setDimensions({
            width: pug.getScaledWidth() + padding,
            height: pug.getScaledHeight() + padding,
          });
        }

        patternSourceCanvas.renderAll();
        return patternSourceCanvas.getElement();
      },
      repeat: "no-repeat",
    });

    /*if (pattrenName == "polygon") {
      canvas.add(
        new fabric.Polygon(
          [
            { x: 185, y: 0 },
            { x: 250, y: 100 },
            { x: 385, y: 170 },
            { x: 0, y: 245 },
          ],
          {
            left: leftPos ? leftPos : 100,
            top: topPos ? topPos : 200,
            angle: anglePos ? anglePos : -10,
            maskname: "polygon",
            myImage: url,
            fill: pattern,
            objectCaching: false,
          }
        )
      );
    }*/

    if (pattrenName == "bili") {
      //console.log(pattrenName);

      pug.scaleToWidth(700);
      pug.scaleToHeight(1000);
      canvas.add(
        new fabric.Path(
          "M85.6,606.2c-13.2,54.5-3.9,95.7,23.3,130.7c27.2,35-3.1,55.2-25.7,66.1C60.7,814,52.2,821,50.6,836.5c-1.6,15.6,19.5,76.3,29.6,86.4c10.1,10.1,32.7,31.9,47.5,54.5c14.8,22.6,34.2,7.8,34.2,7.8c14,10.9,28,0,28,0c24.9,11.7,39.7-4.7,39.7-4.7c12.4-14.8-14-30.3-14-30.3c-16.3-28.8-28.8-5.4-33.5-11.7s-8.6-7-33.5-35.8c-24.9-28.8,39.7-19.5,62.2-24.9c22.6-5.4,65.4-34.2,65.4-34.2c0,34.2,11.7,28.8,28.8,46.7c17.1,17.9,24.9,29.6,47.5,38.9c22.6,9.3,33.5,7.8,53.7,21c20.2,13.2,62.2,10.9,62.2,10.9c18.7,6.2,36.6,0,36.6,0c45.1,0,26.5-15.6,10.1-36.6c-16.3-21-49-3.1-63.8-13.2c-14.8-10.1-51.4-25.7-70-36.6c-18.7-10.9,0-30.3,0-48.2c0-17.9,14-31.9,14-31.9h72.4c0,0,56-3.9,70.8,26.5c14.8,30.3,37.3,36.6,38.1,52.9c0.8,16.3-13.2,17.9-13.2,17.9c-31.1-8.6-31.9,41.2-31.9,41.2c38.1,50.6,112-21,112-21c85.6-7.8,79.4-133.8,79.4-133.8c17.1-12.4,44.4-45.1,62.2-74.7c17.9-29.6,68.5-52.1,113.6-30.3c45.1,21.8,52.9-14.8,52.9-14.8c15.6,2.3,20.2-17.9,20.2-17.9c20.2-22.6-15.6-28-16.3-84c-0.8-56-47.5-66.1-45.1-82.5c2.3-16.3,49.8-68.5,38.1-63.8c-10.2,4.1-53,25.3-63.7,30.7c-0.4-1.4-1.1-3.4-2.5-6.6c-6.2-14-74.7,30.3-74.7,30.3s-108.5,64.2-129.6,68.9c-21,4.7-18.7-9.3-44.3-7c-25.7,2.3-38.5,4.7-154.1-44.4c-115.6-49-326,29.8-326,29.8s-168.1-267.9-28-383.4C265.8,13,78.4-83.3,32.9,168.8C-12.6,420.9,98.9,551.7,85.6,606.2z",
          {
            crossorigin: "anonymous",
            width: wid ? wid : 50,
            height: hig ? hig : 50,
            fill: pattern,
            left: leftPos ? leftPos : 10,
            top: topPos ? topPos : 50,
            scaleX: sX ? sX : 0.4,
            scaleY: sY ? sY : 0.4,
            lockScalingFlip: true,
            lockUniScaling: true,
            myImage: url,
            minScaleLimit: 0.1,
            objectCaching: false,
            maskname: "bili",
          }
        )
      );
    }

    if (pattrenName == "heart") {
      //console.log(pattrenName);
      pug.scaleToWidth(700);

      canvas.add(
        new fabric.Path(
          "M 272.70141,238.71731 \
          C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731  \
          C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 \
          C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 \
          C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731  \
          C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 \
          C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731  \
          z ",
          {
            crossorigin: "anonymous",
            width: wid ? wid : 400,
            height: hig ? hig : 400,
            fill: pattern,
            left: leftPos ? leftPos : 100,
            top: topPos ? topPos : 200,
            maskname: "heart",
            scaleX: sX ? sX : canvas.getZoom(),
            scaleY: sY ? sY : canvas.getZoom(),
            lockScalingFlip: true,
            lockUniScaling: true,
            myImage: url,
            minScaleLimit: 0.1,
            objectCaching: false,
          }
        )
      );
    }

    if (pattrenName == "circle") {
      //console.log(pattrenName);

      canvas.add(
        new fabric.Circle({
          crossorigin: "anonymous",
          radius: rad ? rad : 120,
          fill: pattern,
          left: leftPos ? leftPos : 100,
          top: topPos ? topPos : 200,
          maskname: "circle",

          //absolutePositioned: true,
          //stroke: "1",
          scaleX: sX ? sX : canvas.getZoom(),
          scaleY: sY ? sY : canvas.getZoom(),
          lockScalingFlip: true,
          lockUniScaling: true,
          myImage: url,
          minScaleLimit: 0.1,
          objectCaching: false,
        })
      );
    }

    if (pattrenName == "rect") {
      canvas.add(
        new fabric.Rect({
          crossorigin: "anonymous",
          width: wid ? wid : 300,
          height: hig ? hig : 300,
          left: leftPos ? leftPos : 100,
          top: topPos ? topPos : 200,
          //fixed: true,
          maskname: "rect",
          fill: pattern,
          scaleX: sX ? sX : canvas.getZoom(),
          scaleY: sY ? sY : canvas.getZoom(),
          //absolutePositioned: true,
          //stroke: "1",
          myImage: url,
          lockScalingFlip: true,
          lockUniScaling: true,
          minScaleLimit: 0.1,
        })
      );
    }

    if (pattrenName === "triangle") {
      canvas.add(
        new fabric.Triangle({
          crossorigin: "anonymous",
          width: wid ? wid : 400,
          height: hig ? hig : 400,
          left: leftPos ? leftPos : 100,
          top: topPos ? topPos : 200,
          scaleX: sX ? sX : canvas.getZoom(),
          scaleY: sY ? sY : canvas.getZoom(),
          maskname: "triangle",
          myImage: url,
          fill: pattern,
          lockScalingFlip: true,
          lockUniScaling: true,
          minScaleLimit: 0.1,
        })
      );
    }

    if (pattrenName === "ellipse") {
      canvas.add(
        new fabric.Ellipse({
          crossorigin: "anonymous",
          rx: 175,
          ry: 100,
          width: wid ? wid : 400,
          height: hig ? hig : 400,
          left: leftPos ? leftPos : 100,
          top: topPos ? topPos : 200,
          scaleX: sX ? sX : canvas.getZoom(),
          scaleY: sY ? sY : canvas.getZoom(),
          myImage: url,
          fill: pattern,
          lockScalingFlip: true,
          lockUniScaling: true,
          minScaleLimit: 0.1,
          maskname: "ellipse",
        })
      );
    }

    if (pattrenName === "polygon") {
      canvas.add(
        new fabric.Polygon(shape[1], {
          crossorigin: "anonymous",
          width: wid ? wid : 400,
          height: hig ? hig : 400,
          left: leftPos ? leftPos : 100,
          top: topPos ? topPos : 200,
          scaleX: sX ? sX : canvas.getZoom(),
          scaleY: sY ? sY : canvas.getZoom(),
          maskname: "polygon",
          myImage: url,
          fill: pattern,
          lockScalingFlip: true,
          lockUniScaling: true,
          minScaleLimit: 0.1,
        })
      );
    }

    if (pattrenName === "star1") {
      canvas.add(
        new fabric.Polygon(shape[2], {
          crossorigin: "anonymous",
          maskname: "star1",

          // absolutePositioned: true,
          myImage: url,
          fill: pattern,

          width: wid ? wid : 400,
          height: hig ? hig : 400,
          left: leftPos ? leftPos : 100,
          top: topPos ? topPos : 200,
          scaleX: sX ? sX : canvas.getZoom(),
          scaleY: sY ? sY : canvas.getZoom(),
          lockScalingFlip: true,
          lockUniScaling: true,
          minScaleLimit: 0.1,
        })
      );
    }

    if (pattrenName === "star2") {
      canvas.add(
        new fabric.Polygon(shape[3], {
          crossorigin: "anonymous",
          myImage: url,
          fill: pattern,
          maskname: "star2",
          width: wid ? wid : 400,
          height: hig ? hig : 400,
          left: leftPos ? leftPos : 100,
          top: topPos ? topPos : 200,
          scaleX: sX ? sX : canvas.getZoom(),
          scaleY: sY ? sY : canvas.getZoom(),
          lockScalingFlip: true,
          lockUniScaling: true,
          minScaleLimit: 0.1,
        })
      );
    }

    //img.scaleToWidth(canvas.getWidth() / 2);
    //img.scaleToHeight(canvas.getHeight() / 2);
    // img.scaleToWidth(parseInt(, 10));

    // img.set("angle", img.value);

    // padding = parseInt(this.value, 10);

    // pattern.offsetX = parseInt(this.value, 10);

    // pattern.offsetY = parseInt(this.value, 10);

    // pattern.repeat = this.checked ? "repeat" : "no-repeat";
    canvas.requestRenderAll();
  };

  /*fabric.Image.fromURL(url, function (img) {
    img.crossOrigin = "anonymous";
  });*/
}
