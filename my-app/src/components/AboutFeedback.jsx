import React from "react";

const AboutFeedback = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        };
        
        // Send email using mailto
        window.location.href = `mailto:lokesh20127050@gmail.com?subject=Feedback from ${formData.name}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0AMessage: ${formData.message}`;
    };

    return (
        <section className="about-feedback">
            <div className="about-section">
                <h2>About Us</h2>
                <p>
                    At FindMyHelper, we connect you with skilled professionals for all your home and business service needs.
                    Whether you require a plumber, electrician, carpenter, painter, or appliance repair expert, we
                    ensure high-quality, reliable, and efficient services at your doorstep.

                    Our mission is to simplify the process of finding trusted workers by offering a user-friendly platform
                    where customers can book services effortlessly. With a team of experienced professionals, we prioritize
                    customer satisfaction, transparency, and affordability in every service we provide.

                    We are committed to making your life easier by providing quick, reliable, and professional solutions
                    whenever you need them. Whether it's a minor repair or a major installation, FindMyHelper is
                    here to help!
                </p>
                <br />
                <p>👉 Need a service? Book now and experience hassle-free home solutions! 😊</p>
            </div>
            <div className="feedback-section">
                <h2>Feedback</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" placeholder="Your Name" required />
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Your Email" required />
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" placeholder="Your feedback..." required></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </section>
    );
};

export default AboutFeedback;