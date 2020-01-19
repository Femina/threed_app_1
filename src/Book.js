import * as THREE from "three"
import React, { useEffect, useRef, useState, useMemo,Suspense } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import lerp from "lerp"
import { getMouseDegrees } from "./utils"

function Asset({ url }) {
    const gltf = useLoader(GLTFLoader, url)
    return <primitive object={gltf.scene} />
  }

  
export default function Book({ mouse, ...props }) {
    
    return (
       
            <group {...props}>
                <Suspense fallback={null}>
                        <Asset url="/Liddu.glb" />
                </Suspense>
            </group>
        
    )
}