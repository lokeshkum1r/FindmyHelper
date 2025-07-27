import React, { useState } from 'react';
import '../styles/helper.css';
import Footer from './Footer';

const Helper = () => {
  const [fullName, setFullName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // List of available skills
  const availableSkills = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'AC Repair',
    'Bike Repair',
    'Appliance Repair',
    'Water Purifier Repair'

  ];

  const handleSkillChange = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
  
    try {
      const response = await fetch("http://localhost:5000/api/workers/register", { // Ensure this matches the backend route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, 
          skills: selectedSkills.join(', '),
          phoneNumber
        }),
      });

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          setMessage(
            <div className="success-message">
              <p>✅ Registration successful!</p>
              {data.telegramLink && (
                <div>
                  <p>Connect Telegram to receive jobs:</p>
                  <a 
                    href={data.telegramLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="telegram-link"
                  >
                    Click here to open Telegram
                  </a>
                </div>
              )}
            </div>
          );
          // Reset form
          setFullName('');
          setSelectedSkills([]);
          setPhoneNumber('');
        } else {
          setMessage(data.message || 'There was an error with your registration.');
        }
      } else {
        setMessage('Unexpected response from the server. Please try again later.');
        console.error('Unexpected response:', await response.text());
      }
    } catch (error) {
      setMessage('Failed to connect to server. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Earn More. Earn Respect. Safety Ensured.</h1>
        <p>Join 40,000+ partners across India, USA, Singapore, UAE and many more</p>
        <div className="form-section">
          <p>Fill out the form below, and we'll reach out to you shortly.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            
            <div className="skills-section">
              <label>Select Your Skills:</label>
              <div className="skills-container">
                {availableSkills.map((skill) => (
                  <div 
                    key={skill} 
                    className={`skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => handleSkillChange(skill)}
                  >
                    {skill}
                  </div>
                ))}
              </div>
              {selectedSkills.length > 0 && (
                <div className="selected-skills">
                  <small>Selected: {selectedSkills.join(', ')}</small>
                </div>
              )}
            </div>

            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading || selectedSkills.length === 0}>
              {isLoading ? 'Joining...' : 'Join Us'}
            </button>
          </form>
          {message && <div className="message">{message}</div>}
        </div>
      </header>

      <section className="intro-section">
        <h2>Join FindmyHelper to change your life</h2>
        <p>FindmyHelper is an app-based marketplace that empowers professionals like you to become your own boss</p>
        <div className="stats">
          <div className="stat">
            <h3>40,000+</h3>
            <p>Partners already on board</p>
          </div>
          <div className="stat">
            <h3>¥1547Cr</h3>
            <p>Paid out to partners in 2022</p>
          </div>
          <div className="stat">
            <h3>1,250,000+</h3>
            <p>Services delivered each month</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Helper;