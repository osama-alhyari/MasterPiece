import React, { useState, useEffect } from "react";
import { Carousel, CarouselItem, CarouselControl, Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [sliders, setSliders] = useState([]);
  const navigate = useNavigate();

  // Fetch sliders data from the backend
  async function fetchSliders() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/sliders");
      setSliders(response.data.Sliders); // Assuming the backend returns a "sliders" array
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  }

  useEffect(() => {
    fetchSliders();
  }, []);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === sliders.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? sliders.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  // Redirect to the associated group or product
  const handleRedirect = (group_id, product_id) => {
    if (group_id) {
      navigate(`/user/group/${group_id}`);
    } else if (product_id) {
      navigate(`/product/${product_id}`);
    }
  };

  return (
    <>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        className="w-100"
      >
        {sliders?.map((slider) => (
          <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={slider.id}
          >
            {/* Use a div with background image */}
            <div
              className="d-flex justify-content-center align-items-end"
              style={{
                backgroundImage: `url(http://127.0.0.1:8000/slider_images/${slider.name})`,
                height: "400px",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Button
                color="secondary"
                onClick={() =>
                  handleRedirect(slider.group_id, slider.product_id)
                }
              >
                View
              </Button>
            </div>
          </CarouselItem>
        ))}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </Carousel>
    </>
  );
}

export default Slider;
