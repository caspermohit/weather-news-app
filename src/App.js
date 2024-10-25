import React from 'react'; // Corrected import statement
import { BrowserRouter as Router, } from 'react-router-dom'; // Change Switch to Routes
import './App.css'; // Import the CSS file
import Weather from './components/Weather'; // Import the Weather component
import News from './components/news'; // Import the News component
import Footer from './components/Footer'; // Import the Footer component



const App = () => {
  

  return (
    <Router>
      <div className="date-time-section">
        <h2>Current Date and Time</h2>
        {/* New date and time section */}
        <p>{new Date().toLocaleString()}</p> {/* Display current date and time */}
      </div>
      <div className='main-container'>
        
       
        <div className='weather-container'>
          <Weather /> {/* Weather component without specific class */}
        </div>
        
      </div>
      <div>
          <News /> {/* News component without specific class */}
        </div>
        <div>
          <Footer /> {/* News component without specific class */}
        </div>
        
    </Router>
  );
  
};


export default App;
