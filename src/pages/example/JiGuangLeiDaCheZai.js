import * as THREE from "three"
//激光雷达范围显示
export default class JiGuangLeiDaCheZai {    
     group;
     cylinder;
     data;

    constructor(radius,height){
        this.data = {
            radius: radius,
            height: height,
            radialSegments: 32,//分段
            heightSegments: 1,
            openEnded: true,//true:不封顶 false:封顶
            thetaStart: 0,
            thetaLength: 2*Math.PI,
        };
        const geometry = new THREE.CylinderGeometry( 
            this.data.radius, this.data.radius, 
            this.data.height,
            this.data.radialSegments,
            this.data.heightSegments,
            this.data.openEnded,
            this.data.thetaStart,
            this.data.thetaLength,
        );
        const material = new THREE.MeshBasicMaterial( {
            color: 0x888222,
            transparent:true,
            opacity:0.6,
            side:THREE.DoubleSide,
        });
        material.blending = THREE.NormalBlending;
        const cylinder = new THREE.Mesh( geometry, material );

        this.group=new THREE.Group();
        cylinder.position.y+=height/2;
        this.group.add(cylinder);
        this.cylinder=cylinder;
        this.createCone();
        // this.cylinder.renderOrder=10
        // this.createFace()
    }
    //创建一个圆锥
    createCone(){
        const material = new THREE.MeshBasicMaterial( {color: 0xffffff,transparent:true,opacity:0.5,side:THREE.DoubleSide} );
        material.blending = THREE.NoBlending;
        
        {
            const geometry = new THREE.ConeGeometry(
                this.data.radius, this.data.height/2,
                this.data.radialSegments,this.data.heightSegments,
                this.data.openEnded
             );
            const cone = new THREE.Mesh( geometry, material );
            cone.position.y=this.cylinder.position.y;
            this.cone_bottom=cone;
            this.group.add( cone );
        }
        {
            const geometry = new THREE.ConeGeometry(
                this.data.radius, this.data.height/2,
                this.data.radialSegments,this.data.heightSegments,
                this.data.openEnded
             );
            const cone = new THREE.Mesh( geometry, material );
            cone.position.y=this.cylinder.position.y+this.data.height/2;
            this.cone_top=cone;
            this.cone_top.rotation.x=Math.PI;
            this.group.add( cone );
        }
        
    }
    //设置特效位置。
    setCylinderPosition(p){
        let height=this.data.height/2;
        this.cylinder.position.set(
            // p.x,p.y+height,p.z
            p.x,height,p.z
        )
    }

}