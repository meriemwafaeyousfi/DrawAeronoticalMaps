import React, { Fragment, useEffect, useState } from "react";
import ResizableRect from "react-resizable-rotatable-draggable";
import { useDispatch, useSelector } from 'react-redux';

const ResizableContent = (props) => {
  const [width, setWidth] = useState(80);
  const [height, setHeight] = useState(80);
  const [rotateAngle, setRotateAngle] = useState(props.rotateAngle);
  const selectedFeature = useSelector((state) => state.selectedFeature)
  const map = useSelector((state) => state.map)
  const dispatch = useDispatch()

  const contentStyle = {
    top: props.top,
    left : props.left,
    width : props.widthImg,
    height : props.heightImg,
    position: "absolute",
    transform: `rotate(${rotateAngle}deg)`
  };

  const handleResize = (style, isShiftKey, type) => {
    const { top, left, width, height } = style
    props.setWidthImg(Math.round(width)) 
    props.setHeightImg(Math.round(height))
    props.setTop(Math.round(top))
    props.setLeft(Math.round(left))
    selectedFeature.set('left', Math.round(left))
    selectedFeature.set('top',Math.round(top))
    selectedFeature.set('width',Math.round(width))
    selectedFeature.set('height',Math.round(height))
  }

  const handleRotate = (rotateAngle) => {
    setRotateAngle(rotateAngle)
  }

  const handleDrag = (deltaX, deltaY) => {
    props.setLeft(props.left + deltaX)
    props.setTop(props.top + deltaY)
    selectedFeature.set('left',props.left + deltaX)
    selectedFeature.set('top',props.top + deltaY)
  }


  return (
    <Fragment>
      <div style={contentStyle}>{props.children}</div>
      <ResizableRect
        top={props.top}
        left={props.left}
        minWidth={10}
        width={props.widthImg}
        minHeight={10}
        height={props.heightImg}
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
