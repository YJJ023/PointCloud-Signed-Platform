/* eslint-disable jsx-a11y/no-access-key */

import './App.css';
import Render from './components/render';
import {  useRef, useState ,createContext, useLayoutEffect} from 'react';
// eslint-disable-next-line no-unused-vars
import * as THREE from 'three'
import Data from './components/data';
export const CountContext = createContext();

function App() {
 let data=useRef({a:[0,0,0]})
// eslint-disable-next-line no-unused-vars
let pointlist=useRef([{x:0,y:0,z:0}]);//标记点的集合
let arr=useRef([]);
// eslint-disable-next-line no-unused-vars
const[a,seta]=useState(1);
let geometry =useRef(new THREE.BufferGeometry()) ;
let line=useRef(new THREE.Line(
  geometry.current,
  new THREE.LineBasicMaterial({
    color:0x00ffff ,
  })));
useLayoutEffect(()=>{
geometry.current.attributes.position=new THREE.BufferAttribute(new Float32Array(arr.current),3);
data.current.c.add(line.current);},[])
  return (
<><div className='fixed'>

<button accesskey="s" onClick={()=>{//将球模型添加至数组
const sphereGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff3344,opacity:0.8,transparent:true});
let  pointsphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
pointsphere.position.x=Object.values(data.current.a)[0];
pointsphere.position.y=Object.values(data.current.a)[1];
pointsphere.position.z=Object.values(data.current.a)[2];



data.current.b.unshift(pointsphere);
data.current.c.add(pointsphere);

pointlist.current.unshift({//将xyz添加至数组
   x: Object.values(data.current.a)[0],
   y:Object.values(data.current.a)[1],
   z:Object.values(data.current.a)[2]
    });
    seta(n=>n+1)//状态a改变子组件不渲染

arr.current.push(//将球模型坐标添加至线渲染数组
Object.values(data.current.a)[0],
Object.values(data.current.a)[1],
Object.values(data.current.a)[2]
);
//////////////////除去第一个无用数据
if(pointlist.current[pointlist.current.length-1].x===0){
  pointlist.current.splice(pointlist.current.length-1,1)
}
//更新一下线
geometry.current.attributes.position=new THREE.BufferAttribute(new Float32Array(arr.current),3);
//////////////////
}} >标注点云(Alt+S)</button>
<div>x:{Object.values(data.current.a)[0]}</div>
<div>y:{Object.values(data.current.a)[1]}</div>
<div>z:{Object.values(data.current.a)[2]}</div>
<div>点云数据类型：Intensity</div>
<div>点云阈值：1 反射强度：1.5</div>
<CountContext.Provider value={pointlist.current}>
  <Render ref={data}
          uprender={seta} 
          line={arr.current}
          linemodel={line.current}></Render>
  <Data uprender={seta} 
  list={data.current.b} 
  scene={data.current.c} 
  line={arr.current}
  linemodel={line.current}
  geometry={geometry.current}
  ></Data>
</CountContext.Provider>
</div>
</>
  
  );
}

export default App;
