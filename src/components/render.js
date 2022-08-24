/* eslint-disable react-hooks/exhaustive-deps */
import * as THREE from 'three'
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// eslint-disable-next-line no-unused-vars
import { useState,useLayoutEffect,forwardRef, useImperativeHandle, useContext, useMemo, useRef} from 'react';
// eslint-disable-next-line no-unused-vars
import { memo } from 'react';
import { CountContext } from '../App';
import './render.css';



const Render= forwardRef((props,ref)=>{
  //视角指示器
  var aspect = window.innerWidth / window.innerHeight;
  var frustumSize = 200;
  let intera;
  let PointCloudData = [];
  let spheres =[{position:{x:0,y:0,z:0}}];
  let renderer=useRef(new THREE.WebGLRenderer());
  let camera=useRef(new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  ));
    //camera也要用useref包裹，不然每次重新渲染就是新的camera对象，
    //而draw()函数被包裹,不会把新camera绑定three模型，而return更新了，
    //操纵的是新的camera对象不是three绑定的camera对象
  let scene=useRef(new THREE.Scene())//将scene对象保留，不然每次都会是新的scene,里面没有ply模型
  //let scene = new THREE.Scene();
  let controls=useRef();
  let PointCloud=useRef();
  let	cameraOrtho=useRef(new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 20000000000)) 
  let sceneOrtho=useRef(new THREE.Scene()) ;
  sceneOrtho.current.add(cameraOrtho.current);
  let stats;
  let sphere;//红色球体
  const RecordPointList=useRef([]);//记录的点对象数组
  // eslint-disable-next-line no-unused-vars
 

  let viewBox;//视角显示器正方体
  //helper,axis两个坐标轴
  let helper;//点云坐标轴
  let axes ;//视角显示器坐标轴
  let mark2=1;
  let mark3=1;
  let mark4=1;
  let mark5=1;

  // eslint-disable-next-line no-unused-vars
  const [state,setstate]=useState(0);
  // eslint-disable-next-line no-unused-vars
 const PointList=useContext(CountContext)
  const raycaster = new THREE.Raycaster(); 
 // let raycaster1 = new THREE.Raycaster();
  const pointer = new THREE.Vector2();//鼠标click
 // const mouse=new THREE.Vector2()//鼠标hover
 // eslint-disable-next-line no-unused-vars
 
 function onWindowResize() {
    camera.current.aspect = window.innerWidth / window.innerHeight;
    camera.current.updateProjectionMatrix();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
  }
  
  
  function initRender() {
   // renderer.current =new THREE.WebGLRenderer() ;
    renderer.current.setSize(window.innerWidth, window.innerHeight); 
  
    document.body.appendChild(renderer.current.domElement);
  }
  function initSpheres() {
    const sphereGeometry = new THREE.SphereGeometry(0.4, 32, 32);//0xff0000
    const sphereMaterial = new THREE.MeshBasicMaterial({ color:0xffff00 ,opacity:0.8 ,
      transparent:true});
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
 
    scene.current.add(sphere);
  spheres.unshift(sphere);
  //不使用pop，用unshift更新数组首项
    //spheres.current[0]=sphere;
  }
  
  function initCamera() {
    /* camera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ); */
    camera.current.position.x = 50;
    camera.current.position.y = 0;
    camera.current.position.z = 40;
   
  }
  
  // eslint-disable-next-line no-unused-vars
  function initModel() {
     helper = new THREE.AxesHelper(50);
    scene.current.add(helper);
    let loader = new PLYLoader();
  
    loader.load("/0.ply", (geometry) => {
      let material = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true,
      });
       PointCloud.current = new THREE.Points(geometry, material);
      PointCloudData.push(PointCloud.current);
      
      //
      var materialArr = [];
    materialArr.push(new THREE.MeshBasicMaterial({ color: 0x009e60 }));
    materialArr.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));
    materialArr.push(new THREE.MeshBasicMaterial({ color: 0xffd500 }));
    materialArr.push(new THREE.MeshBasicMaterial({ color: 0xff5800 }));
    materialArr.push(new THREE.MeshBasicMaterial({ color: 0xc41e3a }));
    materialArr.push(new THREE.MeshBasicMaterial({ color: 0xff00ff }));
     viewBox = new THREE.Mesh(new THREE.BoxBufferGeometry(90, 70, 90, 1, 1, 1), materialArr);
    sceneOrtho.current.add(viewBox);
    //【坐标轴】
     axes = new THREE.AxesHelper(100);
    viewBox.add(axes);
      scene.current.add(PointCloud.current);
    }); 
  }
  
  function initStats() {
    stats = new Stats();
 const a= document.body.appendChild(stats.dom);
 a.className='asa'
 
  }
  
  //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
  function initControls() {
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);
    controls.current.maxPolarAngle = Infinity;
    controls.current.enablePan = true;
    controls.current.target.set(50, 0, 0);
    //
    const controls1 = new OrbitControls(cameraOrtho.current, renderer.current.domElement);
    controls1.maxPolarAngle = Infinity;
    controls1.enablePan = true;
    controls1.target.set(50, 0, 0);
  }
  
  function animate() {
    stats.update();
    controls.current.update();
   requestAnimationFrame(animate);
  
   renderer.current.setViewport(0, 0, window.innerWidth, window.innerHeight);

     renderer.current.render(scene.current, camera.current);
     
     //
     cameraOrtho.current.position.copy(camera.current.position);
    cameraOrtho.current.quaternion.copy(camera.current.quaternion);//Quaternion（表示对象局部旋转的四元数)
    cameraOrtho.current.lookAt(scene.current.position);
 
  
   renderer.current.autoClear = false;
cameraOrtho.current.updateProjectionMatrix();
     renderer.current.setViewport(window.innerWidth - 170, window.innerHeight - 150, 150, 150);
       renderer.current.render(sceneOrtho.current, cameraOrtho.current);
     //【设置次场景视区视口，(x, y,width,height)，用来显示viewCube】
  }

 // eslint-disable-next-line no-unused-vars
 function draw() {
    
    window.addEventListener("resize", onWindowResize);
    initStats();
    initRender();
    initCamera();
    initControls();
    initModel();
    initSpheres();
    animate();
   
   
  }; 
//默认在最后执行
useLayoutEffect(()=>{
  draw();
},[])
    
 // eslint-disable-next-line react-hooks/exhaustive-deps


   useImperativeHandle(ref,()=>{
    return {a:spheres[0].position,
            b:RecordPointList.current,
            c:scene.current
          }} ,[]);

//////////////////////
  //添加记录下的点

  
    
 

 /////////////////////////
    
   //这个监听器不用每次渲染删除，虽然每次渲染都会生成新的监听器，
   //但经测验，如果这些监听器返回值完全相同，也只会执行一次
  document.addEventListener("mousedown", (event) => {
    props.uprender(n=>n+1)//让父组件重新渲染，自己不渲染
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera.current);
    let intersects = raycaster.intersectObjects(PointCloudData);
    intersects = intersects.length > 0 ? intersects[0] : null;
    if (intersects !== null) {
      spheres[0].position.copy(intersects.point);
     spheres[0].scale.set(1, 1, 1);
    };
  });
/* window.addEventListener('mousemove',(event)=>{
  props.uprender(n=>n+1);
RecordPointList.current.map((item)=>{
 
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster1.setFromCamera(mouse, camera.current);
  let intersects1 = raycaster.intersectObjects(PointCloudData);
  intersects1 = intersects1.length > 0 ? intersects1[0] : null;
  console.log(item.position.x);
  console.log(intersects1.point.x);
  console.log(item.position.x===intersects1.point.x)
if(item.position.x===intersects1.point.x){
item.material.opacity=0;
}else{item.material.opacity=1}
return 0;
})}) */



return (<>
<ul className='ulul'>
  <li>
    <button onClick={()=>{
  camera.current.position.set(0, 0, 50);
  camera.current.lookAt(0,0,0);
  cameraOrtho.current.zoom=1;
}}>锁定俯视</button>
</li>
  <li>
    <button onClick={()=>{
  camera.current.position.set(0, 0, -50);
  camera.current.lookAt(0,0,0);
  cameraOrtho.current.zoom=1;
}}>锁定仰视</button>
</li>
  <li><button onClick={()=>{
  camera.current.position.set(110, 0, 40);
  camera.current.lookAt(-10,0,0);
  cameraOrtho.current.zoom=1;
  camera.current.up.x = 0;
camera.current.up.y = 0;
camera.current.up.z = 1;
}}>锁定左视</button></li>

  <li>
    <button onClick={()=>{
  camera.current.position.set(-30, 0, 40);
  camera.current.lookAt(0,0,0);
  camera.current.up.x = 0;
  camera.current.up.y = 0;
  camera.current.up.z = 1;
  cameraOrtho.current.zoom=1;
}}>锁定右视</button>
</li>
 
<li>
<button onClick={()=>{
  if(document.body.style.backgroundColor==='white' ){
    document.body.style.backgroundColor='black';
        document.getElementsByClassName('fixed')[0].style.color='white';
        document.getElementsByClassName('rend')[0].style.color='white'
        document.getElementsByClassName('write')[0].style.color='white';
        document.getElementsByClassName('write')[1].style.color='white';
        document.getElementsByClassName('write')[2].style.color='white';
        document.getElementsByClassName('write')[3].style.color='white';
  }else{
    document.body.style.backgroundColor='white';
    document.getElementsByClassName('fixed')[0].style.color='red';
    document.getElementsByClassName('rend')[0].style.color='red'
    document.getElementsByClassName('write')[0].style.color='black';
    document.getElementsByClassName('write')[1].style.color='black';
    document.getElementsByClassName('write')[2].style.color='black';
    document.getElementsByClassName('write')[3].style.color='black';
    document.getElementsByClassName('write')[4].style.color='black';
    document.getElementsByClassName('write')[5].style.color='black';
    /* document.getElementsByClassName('label')[1].onClick='' */
    
  }
}}>视觉切换</button>
</li>
<li>
<div class="radio-beauty-container">
   
    <label class="switch-slide">
      
      <div className='write'>开启/关闭街道视角</div>
     <input type="checkbox" id="menu-right3" onClick={()=>{
if(mark3===1){
    camera.current.position.set(-10, 0, 0);
    camera.current.lookAt(0,0,0);
    camera.current.up.x = 0;
    camera.current.up.y = 0;
    camera.current.up.z = 1;
    cameraOrtho.current.zoom=1;
    mark3=0;
    //改变视角显示器camera
}else{
 camera.current.position.x = 50;
 camera.current.position.y = 0;
 camera.current.position.z = 40;
 cameraOrtho.current.zoom=1;
 mark3=1;
 //改变视角显示器camera

}    
}} hidden />
<label htmlFor="menu-right3" class="switch-slide-label" >
        </label>
    </label>
  </div>
</li>
<li>
  <div class="radio-beauty-container">
    <label class="switch-slide">
      <div className='write'>隐藏/显示点云地图</div>
      <input type="checkbox" id="menu-right" hidden />
      <label htmlFor="menu-right" class="switch-slide-label" onClick={()=>{
        if(controls.current.enableDamping === false){
          controls.current.enableDamping = true;  //是否开起控制器阻尼系数（理解为对旋转的阻力，系数越小阻力越小）
            controls.current.dampingFactor = 0;//设置阻尼系数（如果设置阻尼系数，这涉及到了模型的动态渲染所以在渲染器中需要一直调用.update()。调用update()的前提是需要建立一个时钟 如下）
           }else{ 
            controls.current.enableDamping = false;
       }//加入轨道控制的逻辑，禁用轨道控制
     if(camera.current.position.z>=10000){
     camera.current.position.z=50;
     
     document.getElementsByTagName("button")[1].disabled=false;//开启锁定俯视
     document.getElementsByTagName("button")[2].disabled=false;//禁用锁定俯视
     document.getElementsByTagName("button")[3].disabled=false;//禁用锁定俯视
     document.getElementsByTagName("button")[4].disabled=false;
     document.getElementsByTagName("button")[5].disabled=false;
     document.getElementsByTagName('input')[0].disabled=false;
     document.getElementsByTagName('input')[2].disabled=false;
     document.getElementsByTagName('input')[3].disabled=false;
    
      }else{
     renderer.current.autoClear = true;
     camera.current.position.z=1000000;
     
     document.getElementsByTagName("button")[1].disabled=true;//禁用锁定俯视
     document.getElementsByTagName("button")[2].disabled=true;
     document.getElementsByTagName("button")[3].disabled=true;
     document.getElementsByTagName("button")[4].disabled=true;
     document.getElementsByTagName("button")[5].disabled=true;
     document.getElementsByTagName('input')[0].disabled=true;
    document.getElementsByTagName('input')[2].disabled=true;
    document.getElementsByTagName('input')[3].disabled=true;
     
    
  }
}}></label>
    </label>
  </div>
</li>
<li>
  <div class="radio-beauty-container">
    <label class="switch-slide">
      <div className='write'>锁定/解锁轨道控制</div>
      <input type="checkbox" id="menu-right1" onClick={()=>{
     if(controls.current.enableDamping === false){
      controls.current.enableDamping = true;  //是否开起控制器阻尼系数（理解为对旋转的阻力，系数越小阻力越小）
        controls.current.dampingFactor = 0;//设置阻尼系数（如果设置阻尼系数，这涉及到了模型的动态渲染所以在渲染器中需要一直调用.update()。调用update()的前提是需要建立一个时钟 如下）
       }else{ 
        controls.current.enableDamping = false;
        
   }
}} hidden />
      <label htmlFor="menu-right1" class="switch-slide-label" ></label>
    </label>
  </div>
</li>
<li>
  <div className="radio-beauty-container">
    <label className="switch-slide">
      <div className='write'>开启/关闭自动播放</div>
      <input type="checkbox" id="menu-right2" onClick={()=>{
     if(mark2===1){
      let a=1;
    //间隔20ms周期性调用函数fun,20ms也就是刷新频率是50FPS(1s/20ms)，每秒渲染50次
   intera = setInterval(()=>{  
       renderer.current.autoClear = true;  
       renderer.current.render(scene.current,camera.current);      
        if(PointCloud.current.position.x>-100&&a===1){
        PointCloud.current.translateX(-0.125);
       
        }else{
          a=0;
          if(a===0){
          PointCloud.current.translateX(0.125);
          
          if(PointCloud.current.position.x>0){
            a=1;
          }
        }}},10); 
    
     mark2=0;
  }else{
        clearInterval(intera);
        mark2=1;
        PointCloud.current.position.x=0;
   }}} hidden />
      <label htmlFor="menu-right2" class="switch-slide-label" ></label>
    </label>
  </div>
</li>
<li>
  <div className="radio-beauty-container">
    <label className="switch-slide">
      <div className='write'>隐藏/显示点云标记</div>
      <input type="checkbox" id="menu-right4" onClick={()=>{
        if(mark4===1){
           RecordPointList.current.map((item)=>{
          item.material.opacity=0;
          mark4=0;
          return 0;
        })}else{
          RecordPointList.current.map((item)=>{
            item.material.opacity=0.8;
            mark4=1;
            return 0;
          })

        }
       
     }} hidden />
      <label htmlFor="menu-right4" class="switch-slide-label" ></label>
    </label>
  </div>
</li>
<li>
  <div className="radio-beauty-container">
    <label className="switch-slide">
      <div className='write'>开启/关闭折线吸附</div>
      <input type="checkbox" id="menu-right5" onClick={()=>{
        if(mark5===1){
          props.linemodel.material.visible=false;
          mark5=0;
        }else{
          props.linemodel.material.visible=true;
          mark5=1;
        }
      

     }} hidden />
      <label htmlFor="menu-right5" class="switch-slide-label" ></label>
    </label>
  </div>
</li>
</ul></>)
  
}) 
export default memo(Render) 

