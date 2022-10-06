import React, { Fragment, useState } from "react";
import ResizableRect from "react-resizable-rotatable-draggable";

const ResizableContent = (props) => {
  const [width, setWidth] = useState(80);
  const [height, setHeight] = useState(80);
 
  const [rotateAngle, setRotateAngle] = useState(props.rotateAngle);

  const contentStyle = {
    top: props.top,
    left : props.left,
    width : props.widthResizer,
    height : props.heightResizer,
    position: "absolute",
    transform: `rotate(${rotateAngle}deg)`
  };

  const handleResize = (style, isShiftKey, type) => {
    const { top, left, width, height } = style
    if(!props.resizeActive){
        props.setResizeActive(true)
    }
    props.setWidthResizer(Math.round(width))
    props.setHeightResizer(Math.round(height))

    props.setWidthImg(Math.round(width))
    props.setHeightImg(Math.round(height))
    
    props.setTop(Math.round(top))
    props.setLeft(Math.round(left))
  }

  const handleRotate = (rotateAngle) => {
    setRotateAngle(rotateAngle)
  }

  const handleDrag = (deltaX, deltaY) => {
    if(!props.resizeActive){
      props.setResizeActive(true)
  }
    props.setLeft(props.left + deltaX)
    props.setTop(props.top + deltaY)
  }

  return (
    <Fragment>
      <div style={contentStyle}>{props.children}</div>
      <ResizableRect
        top={props.top}
        left={props.left}
        minWidth={10}
        width={props.widthResizer}
        minHeight={10}
        height={props.heightResizer}
        onDrag={handleDrag}
        onResize={handleResize}
        zoomable="n, e, w, s, nw, ne, se, sw"
        rotateAngle={rotateAngle}
        style={{ border: "30px solid black !important" , zIndex : 6}}
      />
    </Fragment>
  );
};

export default ResizableContent;
