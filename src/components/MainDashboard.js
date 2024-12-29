import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../utils/firebaseConfig';
import { 
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
 } from "firebase/firestore";
import Navbar from './Navbar';
import Footer from './Footer';

const MainDashboard = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [updateName, setUpdateName] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState(null);
  const itemCollectionRef = collection(db, 'items'); // untuk mengakses collection items dari firestore
  const navigate = useNavigate();

  useEffect(() => { 
    const unsubscribe = auth.onAuthStateChanged((user) => {  // untuk mengecek apakah user sudah login atau belum
      if (!user) {
        navigate('/login')
      }
    })

    return () => unsubscribe()
  }, [navigate])

  // fetching data from firestore
  const fetchItems = async () => {
    const data = await getDocs(itemCollectionRef);
    setItems(data.docs.map(doc => ({...doc.data(), id: doc.id}))) // untuk mengambil data dari firestore
  }

  // handle add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    const user = auth.currentUser; // untuk ngecek user udah login atau belom

    if (!user) { // kalo belom login mesti login dulu
      navigate('/login');
      return;
    }

    if (name && quantity) { // untuk mengecek apakah field name dan quantity sudah diisi
      await addDoc(itemCollectionRef, {
        name, 
        quantity: (parseInt, 10), // untuk menambahkan data integer pada quantity ke firestore
        useremail: user.email // untuk menambahkan data email user ke firestore
      }) 

      setName(''); 
      setQuantity('');
      fetchItems();
    } else {
      alert('Please fill all fields')
    }
  }

  // edit item
  const handleEditItem = async (id) => {
    const itemDoc = doc(db, 'items', id);
    await updateDoc(itemDoc, {
      name: updateName || items.find((item) => item.id === id).name, 
      quantity: updateQuantity ? parseInt(updateQuantity, 10) : items.find((item) => item.id === id).quantity
    })

    setIsEditing(null); 
    fetchItems(); // untuk fetch data dari firestore
  }
  
  // handle delete item
  const handleDeleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id))
    fetchItems();
  }
  
  //useEffect untuk fetch data dari firestore saat pertama kali component di render dan saat itemCollectionRef berubah
  useEffect(() => {
    fetchItems();
  }, [itemCollectionRef]);
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            {/* <button
              onClick={() => {
                signOut(auth);
                navigate('/login');
              }}
              className="bg-[#e2e2e2] text-[#4b4b4b] px-4 py-2 rounded-lg hover:bg-[#d4d4d4] transition"
            >
              Logout
            </button> */}
          </header>

          <section className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Item</h2>
            <form className="flex space-x-4" onSubmit={handleAddItem}>
              <input
                type="text"
                placeholder="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-[#e9e7fd] text-[#7367f0] px-4 py-2 rounded-lg hover:bg-[#dddbfb] transition"
              >
                Add Item
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.length === 0 ? (
                <h5>There is no item.</h5>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="bg-white shadow rounded-lg p-4">
                    {isEditing === item.id ? (
                      <div>
                        <input
                          type="text"
                          defaultValue={item.name}
                          onChange={(e) => setUpdateName(e.target.value)}
                          className="block w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          defaultValue={item.quantity}
                          onChange={(e) => setUpdateQuantity(e.target.value)}
                          className="block w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleEditItem(item.id)}
                            className="bg-[#ddf6e8] text-[#28c76f] px-4 py-2 rounded-lg hover:bg-[#ddf6e8] transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-600">Added By: {item.useremail}</p>  {/* untuk narik email */}
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => setIsEditing(item.id)}
                            className="bg-[#fff0e1] text-[#ff9f43] px-4 py-2 rounded-lg hover:bg-[#ffe8d2] transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-[#fce4e4] text-[#ea5455] px-4 py-2 rounded-lg hover:bg-[#fad6d6] transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )
            }
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MainDashboard