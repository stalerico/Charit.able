import React from "react";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css"; // import CSS
import ItemizedBarcode from "../assets/images/ItemizedBarcode.jpg";
import ReceiptOverlay from "../assets/images/ItemizedBarcodeOverlay.jpg";

export default function ReceiptSliderDemo() {
  return (
    <div className="flex justify-center pt-16">
      <div className="w-[400px] md:w-[600px] lg:w-[800px]">
        <ReactBeforeSliderComponent
          firstImage={ItemizedBarcode}
          secondImage={ReceiptOverlay}
        />
      </div>
    </div>
  );
}
