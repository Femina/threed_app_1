import * as THREE from "three"
import React, { useEffect, useRef, useState, useMemo } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import lerp from "lerp"
import { getMouseDegrees } from "./utils"

function moveJoint(mouse, joint, degreeLimit = 40) {
  let degrees = getMouseDegrees(mouse.current.x, mouse.current.y, degreeLimit)
  joint.rotation.xD = lerp(joint.rotation.xD || 0, degrees.y, 0.1)
  joint.rotation.yD = lerp(joint.rotation.yD || 0, degrees.x, 0.1)
  joint.rotation.x = THREE.Math.degToRad(joint.rotation.xD)
  joint.rotation.y = THREE.Math.degToRad(joint.rotation.yD)
}

export default function Character({ mouse, ...props }) {
  const group = useRef()
  const actions = useRef()
  const texture = useLoader(THREE.TextureLoader, "/stacyCoat.jpg")

  const gltf = useLoader(GLTFLoader, "/stacyy.glb")
  const [bones, skeleton, neck, waist] = useMemo(() => {
    // By putting bones into the view Threejs removes it automatically from the
    // cached scene. Next time the component runs these two objects will be gone.
    // Since the gltf object is a permenently cached object, we can extend it here
    // and extend it with all the data we may need.
    if (!gltf.bones) gltf.bones = gltf.scene.children[0].children[0]
    if (!gltf.skeleton) gltf.skeleton = gltf.scene.children[0].children[1].skeleton
    if (!gltf.neck) {
      gltf.bones.traverse(o => {
        if (o.isBone && o.name === "mixamorigNeck") gltf.neck = o
        if (o.isBone && o.name === "mixamorigSpine") gltf.waist = o
      })
    }
    return [gltf.bones, gltf.skeleton, gltf.neck, gltf.waist]
  }, [gltf])

  const [mixer] = useState(() => new THREE.AnimationMixer())
  useEffect(() => {
    actions.current = {
      pockets: mixer.clipAction(gltf.animations[0], group.current),
      rope: mixer.clipAction(gltf.animations[1], group.current),
      swingdance: mixer.clipAction(gltf.animations[2], group.current),
      jump: mixer.clipAction(gltf.animations[3], group.current),
      react: mixer.clipAction(gltf.animations[4], group.current),
      shrug: mixer.clipAction(gltf.animations[5], group.current),
      wave: mixer.clipAction(gltf.animations[6], group.current),
      golf: mixer.clipAction(gltf.animations[7], group.current),
      idle: mixer.clipAction(gltf.animations[8], group.current)
    }
    actions.current.idle.play()
    return () => gltf.animations.forEach(clip => mixer.uncacheClip(clip))
  }, [mixer, gltf])

  useFrame((state, delta) => {
    mixer.update(delta)
    moveJoint(mouse, neck)
    moveJoint(mouse, waist)
  })

  return (
    // dispose={null} to bail out of recursive dispose here to keep the geometry.
    // Without this it destroys the material and the buffergeometry on unmount.
    // This is a react-three-fiber@beta feature
    <group ref={group} {...props} dispose={null}>
      <object3D name="Stacy" rotation={[1.5707964611537577, 0, 0]} scale={[0.009999999776482582, 0.009999999776482582, 0.009999999776482582]}>
        <primitive object={bones} />
        <skinnedMesh name="stacy" rotation={[-1.5707964611537577, 0, 0]} scale={[100, 100, 99.9999771118164]} skeleton={skeleton} castShadow>
          <bufferGeometry attach="geometry" {...gltf.__$[67].geometry} />
          <meshPhongMaterial attach="material" {...gltf.__$[67].material}>
            <texture attach="map" {...texture} flipY={false} />
          </meshPhongMaterial>
        </skinnedMesh>
      </object3D>
    </group>
  )
}
