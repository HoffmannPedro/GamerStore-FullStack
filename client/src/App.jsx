import './App.css';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';

function App() {

  return (
    <div className="min-h-screen w-full bg-dark bg-dots shadow-xl/30 font-montserrat">

      <Toaster position="bottom-right" reverseOrder={false} />

      <Navbar />
    </div>
  );
}

export default App;