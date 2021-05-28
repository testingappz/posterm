export const CANVAS_SIZE = "CANVAS_SIZE";
export const CATEGORY = "CATEGORY";

export const setCanvasSize = (formData) => ({
  type: CANVAS_SIZE,
  data: formData,
});

export const setCategory = (formData) => ({
  type: CATEGORY,
  category: formData,
});
