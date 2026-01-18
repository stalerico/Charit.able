// import React, { useRef, useState, useEffect } from "react";

// interface Highlight {
//   label: string;       // e.g., "Total", "Date", "Merchant"
//   top: number;         // % from top of the image
//   left: number;        // % from left of the image
//   width: number;       // % width of box
//   height: number;      // % height of box
//   color?: string;      // optional box color
// }

// interface BeforeAfterSliderProps {
//   beforeImage: string; // Original receipt
//   afterImage: string;  // AI-highlighted overlay
//   highlights?: Highlight[];
//   width?: string;       // default "100%"
//   height?: string;      // default "400px"
//   paddingTop?: string;  // padding from top
// }

// const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
//   beforeImage,
//   afterImage,
//   highlights = [],
//   width = "100%",
//   height = "400px",
//   paddingTop = "2rem",
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [sliderPos, setSliderPos] = useState(50); // Percentage of overlay
//   const [dragging, setDragging] = useState(false);

//   const handleMouseMove = (e: MouseEvent) => {
//     if (!dragging || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const pos = ((e.clientX - rect.left) / rect.width) * 100;
//     setSliderPos(Math.min(100, Math.max(0, pos)));
//   };

//   const handleMouseUp = () => setDragging(false);
//   const handleMouseDown = () => setDragging(true);

//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [dragging]);

//   return (
//     <div style={{ paddingTop }}>
//       <div
//         ref={containerRef}
//         className="relative overflow-hidden select-none cursor-ew-resize mx-auto"
//         style={{ width, height, borderRadius: "12px", border: "1px solid #ccc" }}
//       >
//         {/* Before Image */}
//         <img
//           src={beforeImage}
//           alt="Before"
//           className="absolute top-0 left-0 w-full h-full object-contain"
//           style={{ zIndex: 1 }}
//         />

//             {/* After Image Overlay */}
//             <div
//             className="absolute top-0 left-0 h-full overflow-hidden"
//             style={{ width: `${sliderPos}%`, zIndex: 2 }}
//             >
//             <img
//                 src={afterImage}
//                 alt="After"
//                 className="w-full h-full object-contain" // remove absolute
//                 style={{ display: "block" }}            // make sure it fills container
//             />

//             {/* Highlight Boxes */}
//             {highlights.map((h, i) => (
//                 <div
//                 key={i}
//                 className="absolute border-2 rounded-md flex items-center justify-center text-sm font-bold text-green-500"
//                 style={{
//                     top: `${h.top}%`,
//                     left: `${h.left}%`,
//                     width: `${h.width}%`,
//                     height: `${h.height}%`,
//                     borderColor: h.color || "lime",
//                     zIndex: 3,
//                 }}
//                 >
//                 {h.label}
//                 </div>
//             ))}
//             </div>

//             {/* Slider Handle */}
//             <div
//             onMouseDown={handleMouseDown}
//             className="absolute top-0 h-full w-1 bg-green-500 cursor-ew-resize"
//             style={{ left: `${sliderPos}%`, transform: "translateX(-50%)", zIndex: 4 }}
//             />
//         </div>
//         </div>

        
//   );
// };

// export default BeforeAfterSlider;
