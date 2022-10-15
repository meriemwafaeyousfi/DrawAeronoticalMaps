import React from "react";
import "./resizerStyle.css";
import ResizableContent from "./ResizableContent";
import { setSelectedFeature } from "../../../CardDrawingTools/redux/actions";
import { useDispatch, useSelector } from "react-redux";

export default function Resizer(props) {
  const selectedFeature = useSelector((state) => state.selectedFeature);

  return (
    <div className="Resizer">
      <div id="mnode">
        <ResizableContent
          setWidthImg={props.setWidthImg}
          setHeightImg={props.setHeightImg}
          top={props.top}
          left={props.left}
          setTop={props.setTop}
          setLeft={props.setLeft}
          width={80}
          height={80}
          widthImg={props.widthImg}
          heightImg={props.heightImg}
          widthResizer={props.widthResizer}
          setWidthResizer={props.setWidthResizer}
          heightResizer={props.heightResizer}
          setHeightResizer={props.setHeightResizer}
          resizeActive={props.resizeActive}
          setResizeActive={props.setResizeActive}
          rotateAngle={0}
        >
          <div className="centreImageDiv varbox content2">
            <img
              className="centreImage resizerImg"
              src={"/Icons/Clouds/" + props.nameCentre + ".png"}
              style={{
                width: "inherit",
                height: "inherit",
                position: "absolute",
                zIndex: "1",
              }}
            />

            {props.vitesse && props.direction !== -91 && (
              <div
                className="fleche"
                style={{
                  width: 0.9 * props.heightImg + "px",
                  height: props.widthImg * 0.2 + "px",
                  transform: "rotate(" + props.direction + "deg)",
                  zIndex: "1",
                  position: "absolute",
                }}
              >
                <img
                  className="resizerImg"
                  style={{
                    width: "80%",
                    height: "inherit",
                    position: "absolute",
                    marginLeft: (-2 * props.heightImg) / 20 + "px",
                    zIndex: "1",
                  }}
                  src={"/Icons/Clouds/arrow.png"}
                />

                <p
                  style={{
                    float: "right",
                    marginTop:
                      props.widthImg > 80
                        ? (props.heightImg * 0.2) / 3 + "px"
                        : "0px",
                    marginRight: "-15px",
                    position: "relative",
                    zIndex: "2",
                    transform: "rotate(90deg)",
                  }}
                >
                  {props.vitesse}
                </p>
              </div>
            )}
            <p
              style={{
                position: "absolute",
                width: props.widthImg,
                height: "20px",
                marginBottom: "0px",
                marginTop: props.heightImg,
                zIndex: "1",
              }}
            >
              {props.texte}
            </p>
          </div>
        </ResizableContent>
      </div>
    </div>
  );
}
