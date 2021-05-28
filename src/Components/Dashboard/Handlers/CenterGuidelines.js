import { fabric } from "fabric";
import "fabric-history";
const size = JSON.parse(sessionStorage.getItem("size"));

export function initCenteringGuidelines(canvas) {
  let canvasWidth = canvas.getWidth(),
    canvasHeight = canvas.getHeight(),
    canvasWidthCenter = canvasWidth / 2,
    canvasHeightCenter = canvasHeight / 2,
    canvasWidthCenterMap = {},
    canvasHeightCenterMap = {},
    centerLineMargin = 4,
    centerLineColor = "#2f2f2f",
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
    canvas.centerLine_horizontal = "";
    canvas.centerLine_vertical = "";

    viewportTransform = canvas.viewportTransform;
  });

  canvas.on("object:moving", function (e) {
    let object = e.target,
      objectCenter = object.getCenterPoint(),
      transform = canvas._currentTransform;

    if (!transform) return;

    isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap;
    isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap;

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
    if (canvas !== null && canvas.getActiveObject()) {
      canvas.clearContext(canvas.contextTop);
    }
  });

  canvas.on("after:render", () => {
    if (isInVerticalCenter) {
      showVerticalCenterLine();
      canvas.centerLine_horizontal = "";
      canvas.centerLine_vertical =
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
      canvas.centerLine_horizontal =
        canvasWidthCenter +
        0.5 +
        ", " +
        0 +
        ", " +
        (canvasWidthCenter + 0.5) +
        ", " +
        canvasHeight;
      canvas.centerLine_vertical = "";
    }
  });

  canvas.on("mouse:up", function () {
    // clear these values, to stop drawing guidelines once mouse is up

    isInVerticalCenter = isInHorizontalCenter = null;
    canvas.renderAll();
  });
}
