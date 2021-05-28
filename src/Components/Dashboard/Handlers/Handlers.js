import { fabric } from "fabric";
import "fabric-history";
//var FontFaceObserver = require("fontfaceobserver");
const size = JSON.parse(sessionStorage.getItem("size"));

var filters = [
  new fabric.Image.filters.Grayscale(), // grayscale    0
  new fabric.Image.filters.Sepia(), // sepia        1
  new fabric.Image.filters.Invert(), // invert       2
  new fabric.Image.filters.Vintage(), //3
  new fabric.Image.filters.Technicolor(), //4
  new fabric.Image.filters.Brownie(), //5
  new fabric.Image.filters.Kodachrome(), //6
  new fabric.Image.filters.BlackWhite(), // 7
  new fabric.Image.filters.Blur(), // 8
  new fabric.Image.filters.Resize(), //9

  new fabric.Image.filters.Convolute({
    matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
  }), // 10

  new fabric.Image.filters.Convolute({
    // 11
    matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  }),
  new fabric.Image.filters.Gamma({
    brightness: 200,
  }), //12
];

var isRedoing = false;
var h = [];

export function deleteObjects(canvas) {
  var activeObject = canvas.getActiveObject();

  if (activeObject && activeObject.video_src) {
    let videoId = activeObject.videoId;
    var vid = document.getElementById(videoId);
    if (vid) {
      canvas.remove(activeObject);
      vid.muted = "muted";
      vid.pause();
      vid.src = "";
      vid.removeAttribute("src");
      vid.parentNode.removeChild(vid);
      //vid.hide();
      //vid.empty()
      canvas.renderAll();
      console.log(canvas.getObjects());
    }
  }
  if (activeObject) {
    if (activeObject && activeObject.clipPath) {
      let allObject = canvas.getObjects();
      if (allObject && allObject.length) {
        allObject.map((obj, id) => {
          if (obj.type !== "image" && obj.maskname == activeObject.maskname) {
            canvas.remove(obj);
            canvas.remove(activeObject);
          }
        });
      }
    } else {
      return canvas.remove(activeObject);
    }
  }
}

export function deleteVideo(canvas, obj) {
  if (obj) {
  }
}

export function addImage(canvas, url, category) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  if (fabric.isWebglSupported()) {
    fabric.textureSize = 4096;
  }
  if (category == "pos") {
    let pugImg = new Image();
    pugImg.crossOrigin = "anonymous";
    pugImg.src = url;

    //console.log(size.zoom);
    pugImg.onload = function (img) {
      let pug = new fabric.Image(pugImg, {
        // left: canvas.getHeight() - 100,
        //top: size.height / 3 + 10,
        scaleX: 1,
        scaleY: 1,
        lockScalingFlip: true,
        lockUniScaling: true,
        angle: 0,
      });
      pug.scaleToWidth(canvas.getWidth());
      pug.scaleToHeight(canvas.getHeight());
      pug.crossOrigin = "anonymous";
      pug.backgroundVpt = false;
      pug.myType = "image";
      pug.setControlsVisibility({
        mt: false,
        mb: false,
      });

      canvas.setActiveObject(pug);

      canvas.add(pug);
      pug.viewportCenter();
      canvas.counter++;
      canvas.renderAll();
    };
  } else {
    let pugImg = new Image();
    pugImg.crossOrigin = "anonymous";
    pugImg.src = url;

    //console.log(size.zoom);
    pugImg.onload = function (img) {
      let pug = new fabric.Image(pugImg, {
        //left: (canvas.width * size.zoomValue) / 2,
        //top: canvas.height * size.zoomValue + 80,
        scaleX: size.width < 500 ? 0.0005 : 0,
        scaleY: size.height < 500 ? 0.0005 : 0,
        lockScalingFlip: true,
        lockUniScaling: true,
        angle: 0,
      });
      if (size && size.width < 500) {
        //console.log(size);
        pug.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
        pug.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
        pug.myType = "image";
      } else {
        pug.scaleToWidth(size ? size.width - 250 : canvas.getWidth() - 250);
        pug.scaleToHeight(size ? size.height - 350 : canvas.getHeight() - 350);
      }
      pug.crossOrigin = "anonymous";
      pug.backgroundVpt = false;
      pug.myType = "image";
      pug.setControlsVisibility({
        mt: false,
        mb: false,
      });

      canvas.setActiveObject(pug);
      pug.center();
      canvas.add(pug);
      pug.viewportCenter();
      canvas.counter++;
      canvas.renderAll();
    };
  }
}

export function addUploadImage(canvas, url, category) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  if (category == "pos") {
    var imgObj = new Image();
    imgObj.crossOrigin = "anonymous";
    imgObj.src = url;

    imgObj.onload = function () {
      var image = new fabric.Image(imgObj);
      image.set({
        //left: canvas.getHeight() - 100,
        //top: canvas.getHeight() + canvas.getWidth() - 80,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        lockScalingFlip: true,
        lockUniScaling: true,
        crossOrigin: "anonymous",
        //cornerPadding: 0,
        minScaleLimit: 0.2,
      });

      image.crossOrigin = "anonymous";
      image.myType = "image";
      image.scaleToWidth(canvas.getWidth());
      image.scaleToHeight(canvas.getHeight());
      //image.set("cornerPadding", 8);
      image.set("minScaleLimit", 0.2);
      canvas.setActiveObject(image);
      canvas.add(image);
      image.viewportCenter();
      canvas.renderAll();
    };
  } else {
    var imgObj = new Image();
    imgObj.crossOrigin = "anonymous";
    imgObj.src = url;

    imgObj.onload = function () {
      var image = new fabric.Image(imgObj);
      image.set({
        //left: (canvas.width * size.zoomValue) / 2,
        // top: canvas.height * size.zoomValue + 80,
        scaleX: 0,
        scaleY: 0,
        angle: 0,
        lockScalingFlip: true,
        lockUniScaling: true,
        crossOrigin: "anonymous",
        //cornerPadding: 8,
        minScaleLimit: 0.2,
      });

      image.crossOrigin = "anonymous";
      if (size && size.width < 500) {
        // console.log(size);
        image.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
        image.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
        image.set("scaleX", 0.0005);
        image.set("scaleY", 0.0005);
        image.set("minScaleLimit", 0.0005);
      }
      image.scaleToWidth(size ? size.width / 3 : canvas.getWidth() - 250);
      image.scaleToHeight(size ? size.height / 3 : canvas.getHeight() - 350);
      //image.set("cornerPadding", 8);
      image.myType = "image";
      image.set("minScaleLimit", 0.2);
      canvas.setActiveObject(image);
      canvas.add(image);
      image.viewportCenter();
      canvas.renderAll();
    };
  }
  //canvas.add(image);
  //canvas.counter++;
  //canvas.renderAll();
}

/* var img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  var fabricImg = new fabric.Image(img);

  canvas.add(fabricImg, canvas.renderAll.bind(canvas));

  /*fabric.Image.fromURL(
    url,
    function (myImg) {
      myImg.crossOrigin = "Anonymous";

      //i create an extra var for to change some image properties
      let imageTextureSize =
        myImg.width > myImg.height ? myImg.width : myImg.height;

      if (imageTextureSize > fabric.textureSize) {
        fabric.textureSize = imageTextureSize;
      }
      var img1 = myImg.set({ left: 20, top: 65 });
      img1.crossOrigin = "anonymous";
      img1.textureSize = 2000;
      img1.scaleToWidth(canvas.getWidth() - 100);
      img1.scaleToHeight(canvas.getHeight() - 200);
      canvas.add(img1);
    },
    null,
    "Anonymous"
  );*/

export function opacity(canvas, value) {
  var activeObject = canvas.getActiveObject();

  if (activeObject) {
    var opacity = value / 100;
    canvas.getActiveObject().set("opacity", opacity);
    canvas.counter++;
    canvas.renderAll();
  }
}

export function setItalic(canvas, value) {
  var activeObject = canvas.getActiveObject();

  if (activeObject) {
    canvas.getActiveObject().set("fontStyle", value ? "" : "italic");
    canvas.counter++;
    canvas.renderAll();
  }
}

export function setBold(canvas, value) {
  var activeObject = canvas.getActiveObject();

  if (activeObject) {
    canvas.getActiveObject().set("fontWeight", value ? "" : "bold");
    canvas.counter++;
    canvas.renderAll();
  }
}

export function setTextColor(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.getActiveObject().set("fill", value);
    canvas.counter++;
    canvas.renderAll();
  }
}

export function setTextCase(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set("fontCase", value);
    var text = activeObject.text;
    activeObject.text = value ? text.toLowerCase() : text.toUpperCase();

    canvas.counter++;
    canvas.renderAll();
  }
}
export function setTextAlignment(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.getActiveObject().set("textAlign", value);
    canvas.renderAll();
  }
}

export function underlineText(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.getActiveObject().set("underline", value);
    canvas.counter++;
    canvas.renderAll();
  }
}

export function setFontSize(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.getActiveObject().set("fontSize", value);
    canvas.counter++;
    canvas.renderAll();
  }
}

export function setFontFamily(canvas, value) {
  var activeObject = canvas.getActiveObject();

  /*var myfont = new FontFaceObserver(value);
  myfont
    .load()
    .then(function () {
      // when font is loaded, use it.
      if (activeObject) {
        canvas.getActiveObject().set("fontFamily", value);
        canvas.requestRenderAll();
        // canvas.renderAll();
      }
    })
    .catch(function (e) {
      console.log(e);
    });*/
  if (activeObject) {
    canvas.getActiveObject().set("fontFamily", value);
    canvas.counter++;
    // canvas.renderAll();
  }
  canvas.requestRenderAll();
}

export function setCanvasBackground(canvas, value) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  canvas.backgroundImage = 0;
  canvas.counter++;
  canvas.setBackgroundColor(value, canvas.renderAll.bind(canvas));
}

export function setCanvasBackgroundImg(canvas, value) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  canvas.backgroundColor = 0;
  canvas.setBackgroundImage(
    value,
    function () {
      let img = canvas.backgroundImage;
      img.backgroundVpt = false;
      img.crossOrigin = "anonymous";
      img.crossOrigin = "Anonymous";
      img.originX = "left";
      img.originY = "top";
      img.scaleX = size
        ? size.width / img.width
        : canvas.getWidth() / img.height;
      img.scaleY = size
        ? size.height / img.height
        : canvas.getHeight() / img.height;
      //img.meetOrSlice = "slice";
      //canvas.counter++;

      canvas.renderAll();
    },
    { crossOrigin: "anonymous" }
  );
  /*canvas.setBackgroundImage(
    value,
    canvas.renderAll.bind(canvas),
    { width: canvas.getWidth(), height: canvas.getHeight() },
    { crossOrigin: "anonymous" }
  );*/
}

export const handleTextBoxPosition = (canvas) => {
  let texts = canvas ? canvas.getObjects("textbox") : {};
  let activeObject = canvas ? canvas.getActiveObject() : {};
  const size = JSON.parse(sessionStorage.getItem("size"));
  //console.log("text", texts);
  let position = null;
  if (texts.length) {
    let last =
      texts[texts.length - 1] !== activeObject && activeObject !== null
        ? activeObject
        : texts[texts.length - 1];
    let first = texts[0];
    if (Math.round(last.height) + Math.round(last.top) > size.height - 60) {
      //console.log("if");
      position = {
        top: Math.round(first.top),
        left: first.left,
      };
    } else {
      //console.log("else");
      position = {
        top: Math.round(last.top) + Math.round(last.height),
        left: last.left,
      };
    }
  } else {
    position = null;
  }
  return position;
};

export function addBigHeading(canvas, value, id, fontsize) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  let scale = 1;
  if (size.width < 500) {
    scale = 0.3;
  }
  var textData = new fabric.Textbox(value, {
    scaleX: scale,
    scaleY: scale,
    fontFamily:
      fontsize == 55
        ? "arial black"
        : fontsize == 40
        ? "arial"
        : fontsize == 30
        ? "Bookman"
        : "arial",
    width: 550,
    textAlign: "center",
    fontSize: fontsize ? fontsize : 35,
    splitByGrapheme: true,
    // lockUniScaling: true,
    //centeredScaling: true,
    lockScalingFlip: true,
    // MIN_TEXT_WIDTH: 5,
    offsetX: "2px 2px 10px rgba(0,0,0,0.2)",
    editingBorderColor: "#c00c41",
  });

  textData.setControlsVisibility({
    mt: false,
    mb: false,
    ml: true,
    mr: true,
  });
  let position = handleTextBoxPosition(canvas);
  console.log("position", position);

  if (position !== null) {
    console.log("not null");
    textData.set({ top: position.top + 10, left: position.left });
  }

  //handleTextBoxPosition(canvas);
  canvas.add(textData);
  canvas.setActiveObject(textData);
  //textData.viewportCenter();
  if (position == null || position == "null") {
    //textData.left = size.width / 4 - 80;
    // textData.top = size.height / 3 + 80;
    //console.log("inside null");
    textData.viewportCenter();
  }
  //  canvas.counter++;
  canvas.renderAll();
}

export function objectType(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    var objType = canvas.getActiveObject() ? canvas.getActiveObject().type : "";
    return objType;
  }
}

export function deselectAll(canvas) {
  canvas.discardActiveObject().renderAll();
}

export function copyObject(canvas, value) {
  var object = canvas.getActiveObject();
  var activeObject = canvas.getActiveObject();
  let selectedObject = objectType(canvas);
  if (canvas.getActiveObject()) {
    if (object && selectedObject == "textbox") {
      object = object.clone(function (cloned) {
        // cloned.set("top", activeObject.top + 15);
        // cloned.set("left", activeObject.left + 15);
        let position = handleTextBoxPosition(canvas);
        //console.log("position", position);

        if (position !== null) {
          //console.log("not null");
          cloned.set({ top: position.top - 50, left: position.left + 10 });
        }

        canvas.add(cloned);
        //cloned.viewportCenter();
        canvas.discardActiveObject();
        canvas.setActiveObject(cloned);
      });
      canvas.counter++;
      canvas.renderAll();
      canvas.trigger("object:statechange");
      return;
    }
    if (object && selectedObject == "image") {
      object = object.clone(function (cloned) {
        cloned.set("top", activeObject.top + 15);
        cloned.set("left", activeObject.left + 15);
        canvas.add(cloned);
        //cloned.viewportCenter();
        canvas.discardActiveObject();
        canvas.setActiveObject(cloned);
      });
      canvas.renderAll();
      canvas.counter++;
      canvas.trigger("object:statechange");
      return;
    } else {
      object = object.clone(function (cloned) {
        cloned.set("top", activeObject.top + 15);
        cloned.set("left", activeObject.left + 15);
        canvas.add(cloned);
        //cloned.viewportCenter();
        canvas.discardActiveObject();
        canvas.setActiveObject(cloned);
      });
      canvas.renderAll();
      canvas.counter++;
      canvas.trigger("object:statechange");
    }
  }
}

export function applyFiltersOnImage(canvas, value) {
  if (fabric.isWebglSupported()) {
    fabric.textureSize = 4096;
  }
  var activeObject = canvas.getActiveObject();

  if (activeObject && activeObject.filters.length > 0) {
    activeObject.filters = [];
  }
  if (value == 8) {
    setBlur(canvas, 0.3);
    return;
  }
  if (activeObject) {
    activeObject.filters[value] = filters[value];
    activeObject.applyFilters();
    // canvas.setActiveObject(activeObject);
    canvas.counter++;
    canvas.renderAll();
  }
}

export function setLetterSpacing(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.getActiveObject().set("charSpacing", value);
    canvas.counter++;
    canvas.renderAll();
  }
}

export function setLetterHeight(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    if (value == "" || value == undefined || value == null) {
      return canvas.getActiveObject().set("lineHeight", 0.5);
    } else {
      canvas.getActiveObject().set("lineHeight", value ? value : 0.5);
      canvas.counter++;
      canvas.renderAll();
    }
  }
}

export function undo(canvas, value) {
  if (canvas._objects.length > 0) {
    h.push(canvas._objects.pop());
    canvas.renderAll();
  }
}

export function redo(canvas, value) {
  if (h.length > 0) {
    isRedoing = true;
    canvas.add(h.pop());
  }
}

export function flipX(canvas, value) {
  // console.log(canvas);
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.getActiveObject().set("flipX", value);
    canvas.counter++;
    canvas.renderAll();
  }
}

export function flipY(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.getActiveObject().set("flipY", value);
    canvas.counter++;
    canvas.renderAll();
  }
}
export function setAdjustments(canvas, index, filter) {
  var obj = canvas.getActiveObject();
  if (obj) {
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.counter++;
    canvas.renderAll();
  }
  //console.log(obj);
}

export function setBrightness(canvas, value) {
  var f = fabric.Image.filters;

  setAdjustments(
    canvas,
    11,
    new f.Brightness(
      {
        brightness: parseFloat(value, 10),
      },
      null,
      "anonymous"
    )
  );
  canvas.counter++;
  canvas.renderAll();
}

export function setContrast(canvas, value) {
  var f = fabric.Image.filters;
  setAdjustments(
    canvas,
    12,
    new f.Contrast(
      {
        contrast: parseFloat(value, 10),
      },
      null,
      "anonymous"
    )
  );
  canvas.counter++;
  canvas.renderAll();
}

export function setSaturation(canvas, value) {
  var f = fabric.Image.filters;
  setAdjustments(
    canvas,
    13,
    new f.Saturation({
      saturation: parseFloat(value, 10),
    })
  );
  canvas.renderAll();
}

export function setBlur(canvas, value) {
  var f = fabric.Image.filters;
  setAdjustments(
    canvas,
    14,
    new f.Blur({
      blur: parseFloat(value, 10),
    })
  );
  canvas.renderAll();
}

export function setHueRotation(canvas, value) {
  var f = fabric.Image.filters;
  setAdjustments(
    canvas,
    15,
    new f.HueRotation({
      rotation: parseFloat(value, 10),
    })
  );
  canvas.renderAll();
}
export function resetAll(canvas) {
  var obj = canvas.getActiveObject();
  if (obj && obj.filters.length > 0) {
    obj.filters = [];
    obj.applyFilters();
    canvas.renderAll();
    //obj._objects.filters.length = 0;
  }
}

export function setObjectToFront(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.bringForward(activeObject);
    canvas.renderAll();
  }
}

export function setObjectToBack(canvas, value) {
  var activeObject = canvas.getActiveObject();

  if (activeObject) {
    canvas.sendBackwards(activeObject);
    canvas.renderAll();
  }
}

export function processAlign(val, canvas, category) {
  var activeObj = canvas.getActiveObject();
  const size = JSON.parse(sessionStorage.getItem("size"));
  if (activeObj && size) {
    switch (val) {
      case "left":
        if (activeObj.imageType) {
          activeObj.set({
            left: 30,
          });
        } else {
          activeObj.set({
            left: 45,
          });
        }
        break;
      case "right":
        if (activeObj.imageType) {
          activeObj.set({
            left: size.width - activeObj.width * activeObj.scaleX - 30,
          });
        } else {
          activeObj.set({
            left: size.width - activeObj.width * activeObj.scaleX - 45,
          });
        }
        break;
      case "top":
        if (activeObj.imageType) {
          activeObj.set({
            top: category == "pos" ? 210 : 150,
          });
        } else {
          activeObj.set({
            top: category == "pos" ? 210 : 140,
          });
        }
        break;
      case "bottom":
        if (activeObj.imageType) {
          activeObj.set({
            top: size.height - activeObj.height * activeObj.scaleY - 30,
          });
        } else {
          activeObj.set({
            top: size.height - activeObj.height * activeObj.scaleY - 45,
          });
        }

        break;
      case "middle":
        if (activeObj.imageType) {
          activeObj.viewportCenter();
          /*activeObj.set({
            left: size.width / 2 - (activeObj.width * activeObj.scaleX) / 2,
            top: size.height / 4 - 20,
          });*/
        }
        if (activeObj.type == "image") {
          //activeObj.center();
          activeObj.viewportCenter();
          /*activeObj.set({
            //left: canvas.width / 2 - (activeObj.width * activeObj.scaleX) / 2,
            //top: activeObj.height / 2,
            left: size.width / 2 - (activeObj.width * activeObj.scaleX) / 2,
            top:
              category == "pos" ? size.height / 3 + 10 : size.height / 4 - 20,
          });*/
        } else {
          activeObj.viewportCenter();
          /*activeObj.set({
            //left: canvas.width / 2 - (activeObj.width * activeObj.scaleX) / 2,
            //top: activeObj.height / 2,
            left: size.width / 2 - (activeObj.width * activeObj.scaleX) / 2,
            top: size.height / 3 + 30,
          });*/
        }

        break;
      case "center":
        if (activeObj.imageType) {
          activeObj.set({
            left:
              size.width / 2 - (activeObj.width * activeObj.scaleX) / 2 + 20,
          });
        } else {
          activeObj.set({
            left: size.width / 2 - (activeObj.width * activeObj.scaleX) / 2,
          });
        }

        break;
    }
  }
  if (activeObj) {
    activeObj.setCoords();
    canvas.setActiveObject(activeObj);
  }
  canvas.renderAll();
}

export function setTextBackground(canvas, value) {
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.isType("textbox")) {
    canvas.getActiveObject().set("backgroundColor", value);
    canvas.requestRenderAll();
    // canvas.renderAll();
  }
}

export function groupText(canvas, objects) {
  var objs = [];
  //get all the objects into an array
  if (!objects) {
    objs = canvas._objects.filter(function (obj) {
      return obj;
    });
    //console.log(objs);
    //group all the objects
    var alltogetherObj = new fabric.Group(objs, {
      //top: 280,
      //left: 280,
      originX: "center",
      originY: "center",
      subTargetCheck: true,
    });

    //clear previous objects
    canvas.getObjects().forEach(function (obj) {
      canvas.remove(obj);
    });

    canvas.add(alltogetherObj);
    canvas.setActiveObject(alltogetherObj);
    alltogetherObj.setCoords();
    canvas.renderAll();
  }

  if (objects) {
    objs = objects.filter(function (obj) {
      return obj;
    });
    //console.log(objs);
    //group all the objects
    var alltogetherObj = new fabric.Group(objs, {
      top: 280,
      left: 280,
      //originX: "center",
      //originY: "center",
    });

    //clear previous objects
    /*canvas.getObjects().forEach(function (obj) {
      canvas.remove(obj);
    });*/

    canvas.add(alltogetherObj);
    alltogetherObj.setCoords();
    canvas.renderAll();
  }
}

export function fontCombination(canvas, objects) {
  var group = objects;
  var items;
  console.log();
  group.forEach(function (obj) {
    items = obj;
  });
  console.log(items);
  let groupItems = [];
  groupItems = items.objects;
  console.log(groupItems.length);
  items._restoreObjectsState();
  canvas.remove(items);
  canvas.renderAll();
  for (var i = 0; i < groupItems.length; i++) {
    canvas.add(groupItems[i]);
  }
  const firstText = groupItems[0];

  //canvas.setActiveObject(groupItems[0]);
  //groupItems[0].enterEditing();
  //groupItems[0].selectAll();
  canvas.renderAll();
}

export function fontCombinationOne(canvas) {
  var group = canvas.getObjects();

  var items;
  group.forEach(function (obj) {
    items = obj;
  });
  let groupItems = [];
  groupItems = items._objects;

  items._restoreObjectsState();

  canvas.remove(items);
  canvas.renderAll();
  for (var i = 0; i < groupItems.length; i++) {
    canvas.add(groupItems[i]);
  }
  const firstText = groupItems[0];

  //canvas.setActiveObject(groupItems[0]);
  //groupItems[0].enterEditing();
  //groupItems[0].selectAll();

  canvas.renderAll();
}

export function setShapesColor(canvas, value, type) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    if (type === "circle" || "triangle" || "rect") {
      if (type !== "sFrame" && type !== "polyFrame" && type !== "circleFrame") {
        canvas.getActiveObject().set("fill", value);
        canvas.renderAll();
      }
    }
    if (activeObject && type == "line") {
      //  canvas.getActiveObject().set("backgroundColor", value);
      canvas.getActiveObject().set("fill", value);
      canvas.getActiveObject().set("stroke", value);
      canvas.renderAll();
    }
    if (activeObject && type === "sFrame") {
      canvas.getActiveObject().set("stroke", value);
      canvas.renderAll();
    }
    if (activeObject && type === "polyFrame") {
      canvas.getActiveObject().set("stroke", value);
      canvas.renderAll();
    }

    if (activeObject && type === "circleFrame") {
      canvas.getActiveObject().set("stroke", value);
      canvas.renderAll();
    }
  }
}

var cropObject;
var cropRect;
var cropComplete;
var objectData;

export function handleCropImage(canvas) {
  objectData = canvas.getActiveObject();
  cropObject = canvas ? canvas.getActiveObject() : "";

  if (cropObject) {
    const { left, top } = cropObject;
    cropRect = new fabric.Rect({
      width: objectData.width - 90,
      height: objectData.height - 90,
      scaleX: objectData.scaleX,
      scaleY: objectData.scaleY,
      angle: 0,
      //originX: cropObject.originX,
      //originY: cropObject.originY,
      left: objectData.left + 5,
      top: objectData.top + 5,
      //cornerSize: 18,
      borderDashArray: [5, 5],
      hasRotatingPoint: false,
      fill: "rgba(0, 0, 0, 0.3)",
      cornerPadding: 2,
    });
    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    cropObject.selectable = false;
    cropObject.evented = false;
    canvas.renderAll();
  }
}

export function cancelCrop(canvas) {
  //interactionMode = "selection";
  if (cropObject && cropRect) {
    // console.log(cropObject);

    //cropObject.selectable = true;
    cropObject.evented = true;
    cropObject.lockScalingFlip = true;
    cropObject.selectable = true;

    canvas.setActiveObject(cropObject);

    canvas.remove(cropRect);
  }

  cropRect = null;
  cropObject = null;

  //canvas.historyUndo.pop();
  //canvas.historyUndo.pop();
  canvas.renderAll();
}
export function doneCrop(canvas) {
  const { left, top, width, height, scaleX, scaleY } = cropRect;
  const croppedImg = cropObject.toDataURL({
    left: left - cropObject.left,
    top: top - cropObject.top,
    width: width * scaleX,
    height: height * scaleY,
  });

  cropObject.lockScalingFlip = true;
  cropObject.selectable = false;
  //cropObject.crossOrigin = true;

  setImage(cropObject, croppedImg, canvas);

  //canvas.historyUndo.pop();
  canvas.historyUndo.pop();
  cropComplete = true;

  cancelCrop(canvas);
}

export function setImage(cropObject, source, canvas) {
  if (!source) {
    loadImage(cropObject, null, canvas);
    cropObject.set("file", null);
    cropObject.set("src", null);

    return;
  }
  if (source instanceof File) {
    const reader = new FileReader();
    reader.onload = () => {
      loadImage(cropObject, reader.result, canvas);
      cropObject.set("file", source);
      cropObject.set("src", null);
    };
    reader.readAsDataURL(source);
  } else {
    loadImage(cropObject, source, canvas);
    cropObject.set("file", null);
    cropObject.set("src", source);
  }
}

export function loadImage(cropObject, src, canvas) {
  let url = src;
  if (!url) {
    url = "./images/sample/transparentBg.png";
  }
  fabric.util.loadImage(url, (source) => {
    if (cropObject.type !== "image") {
      cropObject.setPatternFill(
        {
          source,
          repeat: "repeat",
        },
        null
      );
      cropObject.setCoords();
      canvas.renderAll();
      return;
    }
    cropObject.set("left", objectData ? objectData.left + 15 : 80);
    cropObject.set("top", objectData ? objectData.top + 15 : 80);
    cropObject.set("scaleX", 1);
    cropObject.set("scaleY", 1);
    cropObject.filters = [];
    cropObject.setElement(source);
    //cropObject.viewportCenter();
    cropObject.setCoords();
    canvas.renderAll();
  });
}

export function setShadow(canvas) {
  let activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type == "textbox") {
    activeObject.setShadow("10px 10px 5px rgba(0, 0, 0, 0.6)");
  }
  canvas.renderAll();
}

export function removeShadow(canvas) {
  let activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type == "textbox") {
    activeObject.setShadow("");
  }
  canvas.renderAll();
}

export function addVideo(canvas, url) {
  //console.log(width, "++", height);
  const id = "vid" + Math.random();
  var video = document.createElement("video");
  //video.src = url;
  video.crossOrigin = "anonymous";
  video.setAttribute("crossorigin", "anonymous");
  video.autoplay = true;
  video.width = 480;
  video.height = 470;
  video.controls = true;
  video.loop = true;
  video.muted = true;
  video.setAttribute("id", id);
  video.setAttribute("controls", "controls");
  //video.addEventListener("timeupdate", new Date(), false);
  video.addEventListener("timeupdate", (event) => {
    console.log("The currentTime attribute has been updated. Again.");
  });

  document.getElementById("body").appendChild(video).style.display = "none";
  var source = document.createElement("source");
  source.src = url;
  source.type = "video/mp4";
  video.appendChild(source);
  var imgElement = document.getElementById(id);
  imgElement.loop = true;
  if (imgElement) {
    var imgInstance = new fabric.Image(imgElement, {
      left: 200,
      top: 300,
      angle: 0,
      originX: "center",
      originY: "center",
      //lockScalingFlip: true,
      lockUniScaling: true,
      objectCaching: false,
      lockScalingFlip: true,
      backgroundColor: 0,
      backgroundImage: 0,
      minScaleLimit: 0.1,
    });
    imgInstance.crossOrigin = "anonymous";
    // imgInstance.scaleToWidth(canvas.getWidth() - 250);
    //imgInstance.scaleToHeight(canvas.getHeight() - 350);
    canvas.add(imgInstance);
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
    imgInstance.getElement().play();
    setTimeout(function () {
      canvas.requestRenderAll();
    }, 10);
  }
}

function getVideoDimensionsOf(url) {
  return new Promise(function (resolve) {
    // create the video element
    let video = document.createElement("video");

    // place a listener on it
    video.addEventListener(
      "loadedmetadata",
      function () {
        // retrieve dimensions
        let height = this.videoHeight;
        let width = this.videoWidth;
        // send back result
        resolve({
          height: height,
          width: width,
        });
      },
      false
    );

    // start download meta-datas
    video.src = url;
  });
}

export function getVideoElement(
  canvas,
  url,
  left,
  top,
  scaleX,
  scaleY,
  index,
  opacity,
  fx,
  fy,
  lock
) {
  // console.log(opacity);
  const id = "vid" + Math.random();
  let wid;
  let high;
  //console.log(scaleX, scaleY);
  //localStorage.setItem("J", JSON.stringify(canvas));
  getVideoDimensionsOf(url).then(({ width, height }) => {
    const size = JSON.parse(sessionStorage.getItem("size"));
    var videoE = document.createElement("video");
    videoE.width = width;
    videoE.height = height;
    videoE.src = url;
    videoE.setAttribute("crossOrigin", "anonymous");
    videoE.muted = true;
    videoE.crossOrigin = "anonymous";
    videoE.loop = true;
    videoE.setAttribute("id", id);
    localStorage.setItem("videoId", id);
    videoE.setAttribute("controls", "controls");
    videoE.controls = true;
    // videoE.play();
    document.getElementById("body").appendChild(videoE).style.display = "none";
    //videoE.width = width;

    var source = document.createElement("source");
    source.src = url;
    source.type = "video/mp4";

    videoE.appendChild(source);
    videoE.muted = true;
    //var canvas = new fabric.Canvas("c");
    var url_mp4 = url;
    //var videoE = getVideoElement(url_mp4);
    var fab_video = new fabric.Image(videoE, {
      left: left ? left : 40,
      top: top ? top : 210,
      scaleX: scaleX ? scaleX : 1,
      scaleY: scaleY ? scaleY : 1,
      objectCaching: false,
      opacity: opacity ? opacity : 1,
      flipX: fx ? fx : false,
      flipY: fy ? fy : false,
      locked: lock ? lock : false,
    });
    //console.log(url_mp4);
    //console.log(id);
    // localStorage.setItem("videoId", id);
    fab_video.set("video_src", url_mp4);
    fab_video.set("videoId", id);
    fab_video.set("videoVolume", false);
    fab_video.set("crossOrigin", "anonymous");
    // fab_video.set("src", url_mp4);

    if (!scaleY && !scaleX) {
      fab_video.scaleToWidth(size.width / 3);
      fab_video.scaleToHeight(size.height / 3);

      if (size && size.width < 500 && !scaleX) {
        //console.log(size);
        fab_video.scaleToWidth(size ? size.width : canvas.getWidth() - 250);
        fab_video.scaleToHeight(size ? size.height : canvas.getHeight() - 350);
        fab_video.set("scaleX", 0.05);
        fab_video.set("scaleY", 0.05);
        fab_video.set("minScaleLimit", 0.0005);
      }
    }
    fab_video.crossOrigin = "anonymous";
    canvas.add(fab_video);
    let objectLength = canvas.getObjects().length;
    //console.log(objectLength);
    if (index < objectLength) {
      for (let i = index; i < objectLength - 1; i++) {
        //  console.log(i);
        canvas.sendBackwards(fab_video);
      }
    }
    //canvas.setActiveObject(fab_video);
    //console.log(fab_video.getElement());
    //canvas.renderAll();
    //console.log(canvas.getObjects());
    fab_video.getElement().play();

    fabric.util.requestAnimFrame(function render() {
      //console.log("changes");
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
    if (!left) {
      fab_video.viewportCenter();
    }
    // localStorage.setItem("J", JSON.stringify(canvas));
  });

  //console.log(document.getElementById(id).width);
}

export function removeObject(canvas, obj) {
  return canvas.remove(obj);
  //canvas.renderAll();
  //console.log(canvas.getObjects());
}

export function ungroup(canvas) {
  var activeObject = canvas.getActiveObject();

  if (activeObject && activeObject.type == "group") {
    var items = activeObject._objects;
    // console.log(items);
    //alert(items);
    activeObject._restoreObjectsState();
    canvas.remove(activeObject);
    for (var i = 0; i < items.length; i++) {
      items[i].selectable = true;
      items[i].dirty = true; //set object dirty true
      canvas.add(items[i]);

      canvas.item(canvas.size() - 1).hasControls = true;
    }

    canvas.renderAll();
  }
}
export function lockMe(canvas) {
  var activeObject = canvas.getActiveObject();

  if (activeObject) {
    activeObject.set("hasControls", false);
    activeObject.set("lockMovementX", true);
    activeObject.set("lockMovementY", true);
    activeObject.set("lockRotation", true);
    activeObject.set("lockScalingX", true);
    activeObject.set("lockScalingY", true);

    if (activeObject && activeObject.type == "textbox") {
      activeObject.set("editable", false);
    }
    activeObject.locked = true;
    //  console.log(activeObject);
    canvas.renderAll();
  }
}
export function unlockMe(canvas) {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set("hasControls", true);
    activeObject.set("lockMovementX", false);
    activeObject.set("lockMovementY", false);
    activeObject.set("lockRotation", false);
    activeObject.set("lockScalingX", false);
    activeObject.set("lockScalingY", false);
    activeObject.locked = false;

    if (activeObject && activeObject.type == "textbox") {
      activeObject.set("editable", true);
    }
    canvas.renderAll();
  }
}
