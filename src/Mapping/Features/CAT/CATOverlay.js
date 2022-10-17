export const createOverlaysContainer = () => {
  const overlayContainer = document.createElement("div");
  overlayContainer.className = "cat_overlay_container";
  const overlayContent = document.createElement("div");
  overlayContent.className = "cat_overlay_content";
  overlayContainer.appendChild(overlayContent);

  const mapContainer = document.getElementById("map-container");
  mapContainer.appendChild(overlayContainer);
};

export const createAndUpdateOverlays = (vectorLayer) => {
  const container = document.querySelector(".cat_overlay_content");
  container.innerHTML = "";
  vectorLayer.getSource().forEachFeature((feature) => {
    const featureDataContainer = document.createElement("div");
    featureDataContainer.innerHTML = feature.get("numCat");
    container.appendChild(featureDataContainer);
  });
};
