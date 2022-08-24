import React, { useContext} from "react";
import { CountContext } from "../App";
import * as THREE from 'three'
//import { forwardRef } from "react";
import './data.css'
export default function Data(props){
const PointList=useContext(CountContext) ;
return(<>
<ul className="rend">{  

// eslint-disable-next-line array-callback-return
PointList.map((item,index)=>
<li className="myli">
<div className="right1">Point Id:{index+1}<button className="right" onClick={
()=>{
PointList.splice(index,1);//移除标记点数组的数据
//delete PointList[index];
props.scene.remove(props.list[index]);//移除标记点
props.list.splice(index,1);//移除标记点模型数组
props.line.splice(props.line.length-3-index*3,3)//移除点的线段
/* delete props.line[props.line.length-3-index*3];
delete props.line[props.line.length-3-index*3];
delete props.line[props.line.length-1-index*3]; */
//delete方法可以通过数组的下标将js数组中的一个元素从指定位置上删除，
//且删除掉数组中的元素后，会把该下标出的值置为undefined，数组的长度不会变。
props.linemodel.geometry.attributes.position=new THREE.BufferAttribute(new Float32Array(props.line),3);
props.scene.add(props.linemodel)
props.uprender(n=>n+1);
}}>清除此点</button></div>
<div>x:{item.x}</div>
<div>y:{item.y}</div>
<div>z:{item.z}</div>
</li>
)}</ul>
</>
);
}

