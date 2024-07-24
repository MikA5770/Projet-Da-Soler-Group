import { Carousel } from "antd";
import "../../../style/Carousel.scss";

function CarouselDSL({ images }: any) {
  return (
    <div style={{ height:"350px", width: "350px" }}>
      <Carousel arrows infinite={true} className="test">
        {images.map((image: any, index: any) => (
          <div key={index} style={{height:"350px"}}>
            <img
              src={image}
              style={{ height: "350px" }}
              alt={`slide-${index}`}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default CarouselDSL;
