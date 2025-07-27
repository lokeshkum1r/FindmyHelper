import React from "react";
import { Link } from "react-router-dom";

const Services = ({ searchQuery }) => {
  const services = [
    { id: 1, img: "/plumber.jpg", title: "Plumber", description: "Expert plumbing solutions for homes and businesses.", link: "/services/plumber" },
    { id: 2, img: "/Electrician.jpg", title: "Electrician", description: "Expert Electrician for homes and businesses.", link: "/services/electrician" },
    { id: 3, img: "/Carpenter.jpg", title: "Carpenter", description: "Expert Carpenter for homes and businesses.", link: "/services/carpenter" },
    { id: 4, img: "/Painter.jpg", title: "Painter", description: "Expert Painter for homes and businesses.", link: "/services/painter" },
    { id: 5, img: "/Bike.jpg", title: "Bike repair", description: "Expert Bike repair solutions for homes and businesses.", link: "/services/bikeRepair" },
    { id: 6, img: "/Appliance.jpg", title: "Home Appliance Repair", description: "Expert Home Appliance Repair Services for homes and businesses.", link: "/services/applianceRepair" },
    { id: 7, img: "/Air.jpg", title: "Air conditioner repair", description: "Expert air conditioner repair for homes and businesses.", link: "/services/acRepair" },
    { id: 8, img: "/water.jpg", title: "Water Purifier Repair", description: "Expert water purifier Repair for homes and businesses.", link: "/services/waterPurifierRepair" },
  ];

  // ✅ Filter services based on search query
  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="services">
      <h2 className="our-services">Our Services</h2>

      {filteredServices.length === 0 ? (
        <p className="no-results">No services found for "{searchQuery}"</p>
      ) : (
        <div className="service-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-box">
              <img src={service.img} alt={service.title} />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              {service.link ? (
                <Link to={service.link}>
                  <button>Book Now</button>
                </Link>
              ) : (
                <button disabled>Coming Soon</button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Services;
