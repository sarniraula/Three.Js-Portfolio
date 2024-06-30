import React, { Suspense, useEffect, useState, useMemo} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useMemo(() => useGLTF("./PC/scene.gltf"), []);
  const meshRef = React.useRef();

  // useFrame((state, delta) => {
  //   // Rotate the model slowly around the z-axis
  //   meshRef.current.rotation.y += delta * 0.5; // Adjust the speed as needed
  // });

  return (
    <mesh ref={meshRef}>
      <hemisphereLight intensity={3} groundColor='black' />
      {/* <spotLight
        position={[0,0,-4]}
        angle={0}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      /> */}
      <pointLight position={[0, 0, 0]} intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.09 : 0.2}
        position={isMobile ? [0, -1, 0] : [0, -2.5, 0]}
        rotation={[0, 95, 0]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 2.5}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;