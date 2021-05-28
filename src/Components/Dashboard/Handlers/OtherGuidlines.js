// ==========================================
// SETUP
// ==========================================

const canvas = new fabric.Canvas("myCanvas");

var lastClientX = 0;
var lastClientY = 0;
var state = "default";
const outer = null;
const box1 = null;
const box2 = null;
this.centerLine_horizontal = "";
this.centerLine_vertical = "";
this.alignmentLines_horizontal = "";
this.alignmentLines_vertical = "";

function newControls(control, ctx, methodName, left, top) {
  console.log("control is: " + control);
  if (!this.isControlVisible(control)) {
    return;
  }
  var size = this.cornerSize;
  this.transparentCorners || ctx.clearRect(left, top, size, size);
  ctx.beginPath();
  ctx.arc(left + size / 2, top + size / 2, size / 2, 0, 2 * Math.PI, false);
  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 4;
  ctx.stroke();
}

// ------------------------------------

// ==========================================
// MOUSE INTERACTIONS
// ==========================================

// MOUSEWHEEL ZOOM
canvas.on("mouse:wheel", (opt) => {
  let delta = 0;

  // -------------------------------
  // WHEEL RESOLUTION
  let wheelDelta = opt.e.wheelDelta;
  let deltaY = opt.e.deltaY;

  // CHROME WIN/MAC | SAFARI 7 MAC | OPERA WIN/MAC | EDGE
  if (wheelDelta) {
    delta = -wheelDelta / 120;
  }
  // FIREFOX WIN / MAC | IE
  if (deltaY) {
    deltaY > 0 ? (delta = 1) : (delta = -1);
  }
  // -------------------------------

  let pointer = canvas.getPointer(opt.e);
  let zoom = canvas.getZoom();
  zoom = zoom - delta / 10;

  // limit zoom in
  if (zoom > 4) zoom = 4;

  // limit zoom out
  if (zoom < 0.2) {
    zoom = 0.2;
  }

  //canvas.zoomToPoint({
  //  x: opt.e.offsetX,
  //  y: opt.e.offsetY
  //}, zoom)

  canvas.zoomToPoint(
    new fabric.Point(canvas.width / 2, canvas.height / 2),
    zoom
  );

  opt.e.preventDefault();
  opt.e.stopPropagation();

  canvas.renderAll();
  canvas.calcOffset();
});

initCenteringGuidelines(canvas);
initAligningGuidelines(canvas);

// ==========================================
// CANVAS CENTER SNAPPING & ALIGNMENT GUIDELINES
// ==========================================

// ORIGINAL:
// https://github.com/fabricjs/fabric.js/blob/master/lib/centering_guidelines.js

/**
 * Augments canvas by assigning to `onObjectMove` and `onAfterRender`.
 * This kind of sucks because other code using those methods will stop functioning.
 * Need to fix it by replacing callbacks with pub/sub kind of subscription model.
 * (or maybe use existing fabric.util.fire/observe (if it won't be too slow))
 */
function initCenteringGuidelines(canvas) {
  let canvasWidth = canvas.getWidth(),
    canvasHeight = canvas.getHeight(),
    canvasWidthCenter = canvasWidth / 2,
    canvasHeightCenter = canvasHeight / 2,
    canvasWidthCenterMap = {},
    canvasHeightCenterMap = {},
    centerLineMargin = 4,
    centerLineColor = "purple",
    centerLineWidth = 2,
    ctx = canvas.getSelectionContext(),
    viewportTransform;

  for (
    let i = canvasWidthCenter - centerLineMargin,
      len = canvasWidthCenter + centerLineMargin;
    i <= len;
    i++
  ) {
    canvasWidthCenterMap[Math.round(i)] = true;
  }
  for (
    let i = canvasHeightCenter - centerLineMargin,
      len = canvasHeightCenter + centerLineMargin;
    i <= len;
    i++
  ) {
    canvasHeightCenterMap[Math.round(i)] = true;
  }

  function showVerticalCenterLine() {
    showCenterLine(
      canvasWidthCenter + 0.5,
      0,
      canvasWidthCenter + 0.5,
      canvasHeight
    );
  }

  function showHorizontalCenterLine() {
    showCenterLine(
      0,
      canvasHeightCenter + 0.5,
      canvasWidth,
      canvasHeightCenter + 0.5
    );
  }

  function showCenterLine(x1, y1, x2, y2) {
    var originXY = fabric.util.transformPoint(
        new fabric.Point(x1, y1),
        canvas.viewportTransform
      ),
      dimmensions = fabric.util.transformPoint(
        new fabric.Point(x2, y2),
        canvas.viewportTransform
      );
    ctx.save();
    ctx.strokeStyle = centerLineColor;
    ctx.lineWidth = centerLineWidth;
    ctx.beginPath();

    ctx.moveTo(originXY.x, originXY.y);

    ctx.lineTo(dimmensions.x, dimmensions.y);
    ctx.stroke();
    ctx.restore();

    /*
    ctx.save()
    ctx.strokeStyle = centerLineColor
    ctx.lineWidth = centerLineWidth
    ctx.beginPath()
    ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3])
    ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3])
    ctx.stroke()
    ctx.restore() */
  }

  let afterRenderActions = [],
    isInVerticalCenter,
    isInHorizontalCenter;

  canvas.on("mouse:down", () => {
    isInVerticalCenter = isInHorizontalCenter = null;
    this.centerLine_horizontal = "";
    this.centerLine_vertical = "";
    updateInfo();
    viewportTransform = canvas.viewportTransform;
  });

  canvas.on("object:moving", function (e) {
    let object = e.target,
      objectCenter = object.getCenterPoint(),
      transform = canvas._currentTransform;

    if (!transform) return;

    (isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap),
      (isInHorizontalCenter =
        Math.round(objectCenter.y) in canvasHeightCenterMap);

    if (isInHorizontalCenter || isInVerticalCenter) {
      object.setPositionByOrigin(
        new fabric.Point(
          isInVerticalCenter ? canvasWidthCenter : objectCenter.x,
          isInHorizontalCenter ? canvasHeightCenter : objectCenter.y
        ),
        "center",
        "center"
      );
    }
  });

  canvas.on("before:render", function () {
    canvas.clearContext(canvas.contextTop);
  });

  canvas.on("after:render", () => {
    if (isInVerticalCenter) {
      showVerticalCenterLine();
      this.centerLine_horizontal = "";
      this.centerLine_vertical =
        canvasWidthCenter +
        0.5 +
        ", " +
        0 +
        ", " +
        (canvasWidthCenter + 0.5) +
        ", " +
        canvasHeight;
    }

    if (isInHorizontalCenter) {
      showHorizontalCenterLine();
      this.centerLine_horizontal =
        canvasWidthCenter +
        0.5 +
        ", " +
        0 +
        ", " +
        (canvasWidthCenter + 0.5) +
        ", " +
        canvasHeight;
      this.centerLine_vertical = "";
    }

    updateInfo();
  });

  canvas.on("mouse:up", function () {
    // clear these values, to stop drawing guidelines once mouse is up
    canvas.renderAll();
  });
}

// ===============================================
// OBJECT SNAPPING & ALIGNMENT GUIDELINES
// ===============================================

// ORIGINAL:
// https://github.com/fabricjs/fabric.js/blob/master/lib/aligning_guidelines.js

// Original author:
/**
 * Should objects be aligned by a bounding box?
 * [Bug] Scaled objects sometimes can not be aligned by edges
 *
 */
function initAligningGuidelines(canvas) {
  let ctx = canvas.getSelectionContext(),
    aligningLineOffset = 5,
    aligningLineMargin = 4,
    aligningLineWidth = 2,
    aligningLineColor = "lime",
    viewportTransform,
    zoom = null,
    verticalLines = [],
    horizontalLines = [],
    canvasContainer = document.getElementById("myCanvas"),
    containerWidth = canvasContainer.offsetWidth,
    containerHeight = canvasContainer.offsetHeight;

  function drawVerticalLine(coords) {
    drawLine(
      coords.x + 0.5,
      coords.y1 > coords.y2 ? coords.y2 : coords.y1,
      coords.x + 0.5,
      coords.y2 > coords.y1 ? coords.y2 : coords.y1
    );
  }

  function drawHorizontalLine(coords) {
    drawLine(
      coords.x1 > coords.x2 ? coords.x2 : coords.x1,
      coords.y + 0.5,
      coords.x2 > coords.x1 ? coords.x2 : coords.x1,
      coords.y + 0.5
    );
  }

  function drawLine(x1, y1, x2, y2) {
    var originXY = fabric.util.transformPoint(
        new fabric.Point(x1, y1),
        canvas.viewportTransform
      ),
      dimmensions = fabric.util.transformPoint(
        new fabric.Point(x2, y2),
        canvas.viewportTransform
      );
    ctx.save();
    ctx.lineWidth = aligningLineWidth;
    ctx.strokeStyle = aligningLineColor;
    ctx.beginPath();

    ctx.moveTo(originXY.x, originXY.y);

    ctx.lineTo(dimmensions.x, dimmensions.y);
    ctx.stroke();
    ctx.restore();

    /*
    ctx.save()
    ctx.lineWidth = aligningLineWidth
    ctx.strokeStyle = aligningLineColor
    ctx.beginPath()
    //console.log("x1 :" + x1)
    //console.log("viewportTransform[4] :" + viewportTransform[4])
    //console.log("zoom :" + zoom)
    ctx.moveTo(
      ( (x1 + viewportTransform[4]) * zoom),
      ( (y1 + viewportTransform[5]) * zoom)
    )
    //console.log("-------")
    //console.log("x1 :" + x1)
    //console.log("viewportTransform[4] :" + viewportTransform[4])
    //console.log("zoom :" + zoom)
    //console.log("x :" + (x1 + canvas.viewportTransform[4]) * zoom)
    
    ctx.lineTo(
      ( (x2 + viewportTransform[4]) * zoom),
      ( (y2 + viewportTransform[5]) * zoom)
    )
    ctx.stroke()
    ctx.restore()
    */
  }

  function isInRange(value1, value2) {
    value1 = Math.round(value1);
    value2 = Math.round(value2);
    for (
      var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin;
      i <= len;
      i++
    ) {
      if (i === value2) {
        return true;
      }
    }
    return false;
  }

  canvas.on("mouse:down", function () {
    verticalLines.length = horizontalLines.length = 0;
    viewportTransform = canvas.viewportTransform;
    zoom = canvas.getZoom();
  });

  canvas.on("object:moving", (e) => {
    verticalLines.length = horizontalLines.length = 0;

    let activeObject = e.target,
      canvasObjects = canvas.getObjects().filter((obj) => obj.myType == "box"),
      activeObjectCenter = activeObject.getCenterPoint(),
      activeObjectLeft = activeObjectCenter.x,
      activeObjectTop = activeObjectCenter.y,
      activeObjectBoundingRect = activeObject.getBoundingRect(),
      activeObjectHeight =
        activeObjectBoundingRect.height / viewportTransform[3],
      activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
      horizontalInTheRange = false,
      verticalInTheRange = false,
      transform = canvas._currentTransform;

    //console.log("|||||||||")
    //console.log("active acoords is: " + JSON.stringify(activeObject.aCoords, null, 4))
    //console.log("active acoords is: " + JSON.stringify(activeObject.oCoords, null, 4))
    //console.log("active left offset is: " + JSON.stringify(activeObject.aCoords, null, 4))
    //containerWidth = canvasContainer.offsetWidth
    //containerHeight = canvasContainer.offsetHeight
    //console.log("active left from container is: " + (containerWidth - this.outer.width) / 2 + activeObject.aCoords.tl.x )

    if (!transform) return;

    // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
    // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

    for (let i = canvasObjects.length; i--; ) {
      if (canvasObjects[i] === activeObject) continue;

      let objectCenter = canvasObjects[i].getCenterPoint(),
        objectLeft = objectCenter.x,
        objectTop = objectCenter.y,
        objectBoundingRect = canvasObjects[i].getBoundingRect(),
        objectHeight = objectBoundingRect.height / viewportTransform[3],
        objectWidth = objectBoundingRect.width / viewportTransform[0];

      // snap by the horizontal center line
      if (isInRange(objectLeft, activeObjectLeft)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft,
          y1:
            objectTop < activeObjectTop
              ? objectTop - objectHeight / 2 - aligningLineOffset
              : objectTop + objectHeight / 2 + aligningLineOffset,
          y2:
            activeObjectTop > objectTop
              ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
              : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
        });
        activeObject.setPositionByOrigin(
          new fabric.Point(objectLeft, activeObjectTop),
          "center",
          "center"
        );
      }

      // snap by the left edge
      if (
        isInRange(
          objectLeft - objectWidth / 2,
          activeObjectLeft - activeObjectWidth / 2
        )
      ) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft - objectWidth / 2,
          y1:
            objectTop < activeObjectTop
              ? objectTop - objectHeight / 2 - aligningLineOffset
              : objectTop + objectHeight / 2 + aligningLineOffset,
          y2:
            activeObjectTop > objectTop
              ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
              : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
        });
        activeObject.setPositionByOrigin(
          new fabric.Point(
            objectLeft - objectWidth / 2 + activeObjectWidth / 2,
            activeObjectTop
          ),
          "center",
          "center"
        );
      }

      // snap by the right edge
      if (
        isInRange(
          objectLeft + objectWidth / 2,
          activeObjectLeft + activeObjectWidth / 2
        )
      ) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft + objectWidth / 2,
          y1:
            objectTop < activeObjectTop
              ? objectTop - objectHeight / 2 - aligningLineOffset
              : objectTop + objectHeight / 2 + aligningLineOffset,
          y2:
            activeObjectTop > objectTop
              ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
              : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
        });
        activeObject.setPositionByOrigin(
          new fabric.Point(
            objectLeft + objectWidth / 2 - activeObjectWidth / 2,
            activeObjectTop
          ),
          "center",
          "center"
        );
      }

      // snap by the vertical center line
      if (isInRange(objectTop, activeObjectTop)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop,
          x1:
            objectLeft < activeObjectLeft
              ? objectLeft - objectWidth / 2 - aligningLineOffset
              : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2:
            activeObjectLeft > objectLeft
              ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
              : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
        });
        activeObject.setPositionByOrigin(
          new fabric.Point(activeObjectLeft, objectTop),
          "center",
          "center"
        );
      }

      // snap by the top edge
      if (
        isInRange(
          objectTop - objectHeight / 2,
          activeObjectTop - activeObjectHeight / 2
        )
      ) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop - objectHeight / 2,
          x1:
            objectLeft < activeObjectLeft
              ? objectLeft - objectWidth / 2 - aligningLineOffset
              : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2:
            activeObjectLeft > objectLeft
              ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
              : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
        });
        activeObject.setPositionByOrigin(
          new fabric.Point(
            activeObjectLeft,
            objectTop - objectHeight / 2 + activeObjectHeight / 2
          ),
          "center",
          "center"
        );
      }

      // snap by the bottom edge
      if (
        isInRange(
          objectTop + objectHeight / 2,
          activeObjectTop + activeObjectHeight / 2
        )
      ) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop + objectHeight / 2,
          x1:
            objectLeft < activeObjectLeft
              ? objectLeft - objectWidth / 2 - aligningLineOffset
              : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2:
            activeObjectLeft > objectLeft
              ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
              : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
        });
        activeObject.setPositionByOrigin(
          new fabric.Point(
            activeObjectLeft,
            objectTop + objectHeight / 2 - activeObjectHeight / 2
          ),
          "center",
          "center"
        );
      }
    }

    if (!horizontalInTheRange) {
      horizontalLines.length = 0;
    }

    if (!verticalInTheRange) {
      verticalLines.length = 0;
    }
  });

  canvas.on("mouse:wheel", (opt) => {
    verticalLines.length = horizontalLines.length = 0;
  });

  canvas.on("before:render", function () {
    canvas.clearContext(canvas.contextTop);
  });

  canvas.on("after:render", () => {
    for (let i = verticalLines.length; i--; ) {
      drawVerticalLine(verticalLines[i]);
    }
    for (let i = horizontalLines.length; i--; ) {
      drawHorizontalLine(horizontalLines[i]);
    }

    this.alignmentLines_horizontal = JSON.stringify(horizontalLines, null, 4);
    this.alignmentLines_vertical = JSON.stringify(verticalLines, null, 4);
    updateInfo();

    // console.log("activeObject left edge x is: " + canvas.getActiveObject().left)

    //verticalLines.length = horizontalLines.length = 0

    canvas.calcOffset();
  });

  canvas.on("mouse:up", () => {
    //verticalLines.length = horizontalLines.length = 0
    canvas.renderAll();
    //this.alignmentLines_horizontal = horizontalLines
    //this.alignmentLines_vertical = verticalLines
    //updateInfo()
  });
}
