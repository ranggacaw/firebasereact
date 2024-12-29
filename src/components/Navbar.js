import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebaseConfig';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-white text-[#4b4b4b] p-4 shadow-lg">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center">
            <img src='https://media.istockphoto.com/id/1332414584/vector/baphomet-pentagramv.jpg?s=612x612&w=0&k=20&c=ZJDxK7ZWaspqwy01nscBo7fgZ5bp57VUqvHHiLexYkQ=' className='w-14' />
          <button
            onClick={handleLogout}
            className="bg-[#e2e2e2] text-[#4b4b4b] px-4 py-2 rounded-lg hover:bg-[#d4d4d4] transition"
          >
            Logout
          </button>
        </header>
      </div>
    </nav>
  );
};

export default Navbar;
