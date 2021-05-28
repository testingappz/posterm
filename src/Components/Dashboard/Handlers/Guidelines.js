import { fabric } from "fabric";
import "fabric-history";
const size = JSON.parse(sessionStorage.getItem("size"));

export function initCenteringGuidelines(canvas) {
  const size = JSON.parse(sessionStorage.getItem("size"));
  var canvasWidth = size.width,
    canvasHeight = size.height,
    canvasWidthCenter = canvasWidth / 2,
    canvasHeightCenter = canvasHeight / 2,
    canvasWidthCenterMap = {},
    canvasHeightCenterMap = {},
    centerLineMargin = 4,
    centerLineColor = "rgba(47,47, 47,0.5)",
    centerLineWidth = 0.5,
    ctx = canvas.getSelectionContext(),
    viewportTransform;

  for (
    var i = canvasWidthCenter - centerLineMargin,
      len = canvasWidthCenter + centerLineMargin;
    i <= len;
    i++
  ) {
    canvasWidthCenterMap[Math.round(i)] = true;
  }
  for (
    var i = canvasHeightCenter - centerLineMargin,
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
    if (viewportTransform && viewportTransform.length) {
      ctx.save();
      ctx.strokeStyle = centerLineColor;
      ctx.lineWidth = centerLineWidth;
      ctx.beginPath();
      ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
      ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
      ctx.stroke();
      ctx.restore();
    }
  }

  var afterRenderActions = [],
    isInVerticalCenter,
    isInHorizontalCenter;

  canvas.on("mouse:down", function () {
    viewportTransform = canvas.viewportTransform;
  });

  canvas.on("object:moving", function (e) {
    var object = e.target,
      objectCenter = object.getCenterPoint(),
      transform = canvas._currentTransform;

    if (!transform) return;

    isInVerticalCenter = Math.round(objectCenter.x);
    isInHorizontalCenter = Math.round(objectCenter.y);

    /*if (isInHorizontalCenter || isInVerticalCenter) {
      object.setPositionByOrigin(
        new fabric.Point(
          isInVerticalCenter ? canvasWidthCenter : objectCenter.x,
          isInHorizontalCenter ? canvasHeightCenter : objectCenter.y
        ),
        "center",
        "center"
      );
    }*/
  });

  canvas.on("before:render", function () {
    canvas.clearContext(canvas.contextTop);
  });

  canvas.on("after:render", function () {
    if (isInVerticalCenter) {
      showVerticalCenterLine();
    }
    if (isInHorizontalCenter) {
      showHorizontalCenterLine();
    }
  });

  canvas.on("mouse:up", function () {
    // clear these values, to stop drawing guidelines once mouse is up
    isInVerticalCenter = isInHorizontalCenter = null;
    canvas.renderAll();
  });
}
