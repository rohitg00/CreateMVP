import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  color1?: string;
  color2?: string;
  interactivity?: 'none' | 'follow' | 'repel';
  density?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  color1 = "#4f46e5", // Indigo
  color2 = "#9333ea", // Purple
  interactivity = 'follow',
  density = 1000
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const mousePositionRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const particleVelocities = useRef<Float32Array | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Track mouse position
  useEffect(() => {
    if (interactivity === 'none') return;
    
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse coordinates to normalized device coordinates (-1 to +1)
      mousePositionRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePositionRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactivity]);

  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    const container = containerRef.current;
    if (!container) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Improve performance on high-DPI displays
    rendererRef.current = renderer;

    // Create particle system
    const particleCount = density;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    particleVelocities.current = velocities;

    // Convert hex colors to THREE.Color objects
    const color1Obj = new THREE.Color(color1);
    const color2Obj = new THREE.Color(color2);

    // Create a gradient of positions - some close, some far
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a sphere
      const radius = 5 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2; // around the circle
      const phi = Math.acos(2 * Math.random() - 1); // top to bottom
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.6; // Flatten slightly
      const z = (radius * Math.cos(phi)) * 0.8;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Random velocities for movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      // Interpolate between colors based on position
      const colorMix = Math.random();
      const particleColor = new THREE.Color().lerpColors(color1Obj, color2Obj, colorMix);
      
      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;

      // Random sizes for particles with variation based on distance from center
      const distFromCenter = Math.sqrt(x*x + y*y + z*z);
      sizes[i] = Math.max(0.1, Math.min(0.5, 0.3 - distFromCenter * 0.005)) + Math.random() * 0.2;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create shader material for particles with improved visual effects
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Adjust point size based on distance from camera for depth effect
          float depth = 350.0 - mvPosition.z;
          gl_PointSize = size * clamp(depth, 150.0, 350.0) / 150.0;
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Soft circle shape with feathered edge
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Create a soft glow with smoothstep for a more organic feel
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          
          // Add slight color variation for depth
          vec3 finalColor = vColor * (0.8 + 0.2 * (1.0 - dist)); 
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation function
    const animate = () => {
      if (!particlesRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current || !particleVelocities.current) return;

      // Get the current positions
      const positions = (particlesRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const velocities = particleVelocities.current;
      
      // Apply mouse interaction if enabled
      if (interactivity !== 'none' && mousePositionRef.current) {
        // Convert normalized device coordinates to world coordinates
        const mousePos = new THREE.Vector3(
          mousePositionRef.current.x * 20,
          mousePositionRef.current.y * 20,
          0
        );
        
        // Apply interaction to each particle
        for (let i = 0; i < positions.length; i += 3) {
          const particlePos = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]);
          const distToMouse = particlePos.distanceTo(mousePos);
          
          if (distToMouse < 10) {
            const force = 0.02 / Math.max(0.5, distToMouse);
            const direction = new THREE.Vector3().subVectors(
              interactivity === 'repel' ? particlePos : mousePos,
              interactivity === 'repel' ? mousePos : particlePos
            ).normalize();
            
            velocities[i] += direction.x * force;
            velocities[i+1] += direction.y * force;
            velocities[i+2] += direction.z * force * 0.5;
          }
        }
      }
      
      // Update particle positions based on velocities
      for (let i = 0; i < positions.length; i += 3) {
        // Apply velocity
        positions[i] += velocities[i];
        positions[i+1] += velocities[i+1];
        positions[i+2] += velocities[i+2];
        
        // Apply damping to slow down particles gradually
        velocities[i] *= 0.99;
        velocities[i+1] *= 0.99;
        velocities[i+2] *= 0.99;
        
        // Boundary check - if particles go too far, bring them back
        const dist = Math.sqrt(
          positions[i] * positions[i] + 
          positions[i+1] * positions[i+1] + 
          positions[i+2] * positions[i+2]
        );
        
        if (dist > 35) {
          const factor = 35 / dist;
          positions[i] *= factor;
          positions[i+1] *= factor;
          positions[i+2] *= factor;
          
          // Reverse velocity when hitting boundary
          velocities[i] *= -0.3;
          velocities[i+1] *= -0.3;
          velocities[i+2] *= -0.3;
        }
      }
      
      // Notify Three.js that positions have changed
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Slowly rotate the particle system for additional movement
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Request next frame
      frameIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();
    setIsInitialized(true);

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (particlesRef.current) {
        if (particlesRef.current.geometry) {
          particlesRef.current.geometry.dispose();
        }
        if (particlesRef.current.material) {
          (particlesRef.current.material as THREE.Material).dispose();
        }
      }
    };
  }, [color1, color2, interactivity, density, isInitialized]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ pointerEvents: 'none' }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default AnimatedBackground; 