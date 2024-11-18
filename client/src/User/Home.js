import Slider from "./Slider";

export default function Home() {
  return (
    <>
      <Slider />
      <div class="col-lg-12 order-lg-1 text-white mt-5 text-center">
        <h1 class="mb-4">Wireless Innovation for Total Peace of Mind.</h1>
        <p>
          AJAX security systems combine sleek design with cutting-edge
          technology to offer you unparalleled protection. From motion detectors
          to fire safety sensors, AJAX provides a complete range of solutions
          that ensure your home or business remains secure 24/7.
        </p>
      </div>
      <div class="container text-white mt-5">
        <div class="row gy-4 justify-content-center">
          <div class="col-lg-4">
            <div class="services-item" data-aos="fade-up">
              <div class="services-icon">
                <i class="bi bi-bullseye"></i>
              </div>
              <div>
                <h3>Technology</h3>
                <p>Advanced wireless tech ensures seamless performance.</p>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="services-item" data-aos="fade-up" data-aos-delay="100">
              <div class="services-icon">
                <i class="bi bi-command"></i>
              </div>
              <div>
                <h3>Design</h3>
                <p>Sleek designs blend with any space.</p>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="services-item" data-aos="fade-up" data-aos-delay="200">
              <div class="services-icon">
                <i class="bi bi-bar-chart"></i>
              </div>
              <div>
                <h3>Security</h3>
                <p>Real-time alerts for ultimate protection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
