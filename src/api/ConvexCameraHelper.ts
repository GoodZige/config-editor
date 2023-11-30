/* eslint-disable no-console */
// import { Camera } from '../cameras/Camera.js';
// import { Vector3 } from '../math/Vector3.js';
// import { LineSegments } from '../objects/LineSegments.js';
// import { Color } from '../math/Color.js';
// import { LineBasicMaterial } from '../materials/LineBasicMaterial.js';
// import { BufferGeometry } from '../core/BufferGeometry.js';
// import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import * as THREE from 'three'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'

const _vector = /* @__PURE__ */ new THREE.Vector3()

class ConvexCameraHelper extends THREE.Mesh {
  pointMap: { [key: string]: number[] }
  projectionMatrixInverse: THREE.Matrix4
  type: string
  constructor(matrixWorld:THREE.Matrix4, projectionMatrixInverse:THREE.Matrix4) {
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })

    const vertices: number[] = []
    const colors = []

    type PointMap = {[key:string]:number[]}
    const pointMap:PointMap = {}

    addPoint('n1')
    addPoint('n2')
    addPoint('n3')
    addPoint('n4')

    addPoint('p')

    function addPoint(id: string) {
      vertices.push(0, 0, 0)
      colors.push(0, 0, 0)

      if (pointMap[id] === undefined)

        pointMap[id] = []

      pointMap[id].push((vertices.length / 3) - 1)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    super(geometry, material)

    this.type = 'ConvexCameraHelper'

    this.matrix = matrixWorld// 需要相机的世界矩阵
    this.matrixAutoUpdate = false

    this.pointMap = pointMap

    this.projectionMatrixInverse = projectionMatrixInverse

    this.update()
    // colors
    this.drawConvexCameraHelper(geometry.getAttribute('position').array)
  }

  // n1 n2 n3 n4 p
  drawConvexCameraHelper(positionArray: any[] | THREE.TypedArray) {
    const pointV3Array: THREE.Vector3[] = []
    positionArray.forEach((e: any, i: number) => {
      if ((i + 1) % 3 === 0) {
        pointV3Array.push(
          new THREE.Vector3(
            positionArray[i - 2],
            positionArray[i - 1],
            positionArray[i])
        )
      }
    })

    const [n1, n2, n3, n4, p] = pointV3Array
    const r = p.distanceTo(n1)

    const [p_n1, p_n2, p_n3, p_n4] = pointV3Array
      .slice(0, 4)
      .map(e => e.sub(p)) // 向量

    const angle_pn1_pn3 = p_n1.angleTo(p_n3)
    const SEGMENT = 100
    const angle_segment = angle_pn1_pn3 / SEGMENT

    const arcGroup: THREE.Vector3[] = []
    const drawArcPoints = (v1: THREE.Vector3, v2: THREE.Vector3) => {
      const points = []
      const nextV = v1.clone()
      const normalV = new THREE.Vector3().crossVectors(v1, v2).normalize()
      for (let i = 0; i < SEGMENT; i++) {
        // nextV.applyAxisAngle(normalV, -0.1).normalize().multiplyScalar(r) ; //得到旋转后的向量
        nextV.applyAxisAngle(normalV, angle_segment) // 得到旋转后的向量
        const track_p = new THREE.Vector3().addVectors(nextV, p) // 得到旋转后在弧面上的点
        arcGroup.push(track_p)
        points.push(track_p)
      }
      return points
    }

    const pointArray_12 = drawArcPoints(p_n1, p_n2)
    const pointArray_13 = drawArcPoints(p_n1, p_n3)
    const pointArray_24 = drawArcPoints(p_n2, p_n4)
    const pointArray_34 = drawArcPoints(p_n3, p_n4)

    // console.log(pointArray_12, pointArray_34)
    for (let i = 0; i < pointArray_12.length; i++)
      drawArcPoints(pointArray_12[i], pointArray_34[i])

    const drawPoints = [...arcGroup, ...pointV3Array]
    this.geometry = new ConvexGeometry(drawPoints)
  }

  update() {
    const geometry = this.geometry
    const pointMap = this.pointMap

    const w = 0.7
    const h = 1

    // we need just camera projection matrix inverse
    // world matrix must be identity

    // near

    setPoint('n1', pointMap, geometry, this.matrixWorld, this.projectionMatrixInverse, -w, -h, 1)
    setPoint('n2', pointMap, geometry, this.matrixWorld, this.projectionMatrixInverse, w, -h, 1)
    setPoint('n3', pointMap, geometry, this.matrixWorld, this.projectionMatrixInverse, -w, h, 1)
    setPoint('n4', pointMap, geometry, this.matrixWorld, this.projectionMatrixInverse, w, h, 1)

    geometry.getAttribute('position').needsUpdate = true
  }

  dispose() {
    this.geometry.dispose();
    (this.material as THREE.Material).dispose()
    
  }
}

function setPoint(point: string, pointMap: { [x: string]: any }, geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>, matrixWorld: THREE.Matrix4, projectionMatrixInverse: THREE.Matrix4, x: number, y: number, z: number) {
  // _vector.set( x, y, z ).unproject( camera );
  _vector.set(x, y, z).applyMatrix4(projectionMatrixInverse).applyMatrix4(matrixWorld)
  const points = pointMap[point]

  if (points !== undefined) {
    const position = geometry.getAttribute('position')

    for (let i = 0, l = points.length; i < l; i++)

      position.setXYZ(points[i], _vector.x * 0.002, _vector.y * 0.002, _vector.z * 0.002)
  }
}

export { ConvexCameraHelper }
