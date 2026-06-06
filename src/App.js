import React, { useState, useEffect } from 'react';

export default function App() {
  // STATE MUST BE FIRST, INSIDE App()
  const [hostels, setHostels] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState('');
  const [bookerName, setBookerName] = useState('');     // ← THIS LINE
  const [bookerPhone, setBookerPhone] = useState('');   // ← THIS LINE

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hostels/')
      .then(res => res.json())
      .then(setHostels)
      .catch(err => console.log('Error:', err));
  }, []);

  const filteredHostels = hostels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = () => {
    if (!bookerName.trim() || !bookerPhone.trim()) {
      setMsg('Please enter name and phone');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    
    fetch(`http://127.0.0.1:8000/api/hostels/${selected.id}/book/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: bookerName, phone: bookerPhone})
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) setMsg(data.error);
      else {
        setMsg('✅ Reserved! Pay cash at hostel');
        setHostels(hostels.map(h => 
          h.id === selected.id 
            ? {...h, rooms_left: h.rooms_left - 1, isFree: h.rooms_left - 1 > 0} 
            : h
        ));
        setSelected(null);
        setBookerName('');
        setBookerPhone('');
      }
      setTimeout(() => setMsg(''), 3000);
    });
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 40}}>
      <h1 style={{textAlign: 'center', color: 'white', fontSize: 40}}>Hostel Finder Uganda</h1>
      
      {msg && <p style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>{msg}</p>}
      
      <input 
        placeholder="🔍 Search..." 
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{width: '100%', maxWidth: 600, margin: '0 auto 30px', display: 'block', padding: 15, borderRadius: 25, border: 'none'}}
      />

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 25, maxWidth: 1200, margin: '0 auto'}}>
        {filteredHostels.map(h => (
          <div 
            key={h.id} 
            onClick={() => h.isFree && setSelected(h)}
            style={{
              background: 'white', 
              padding: 25, 
              borderRadius: 20,
              cursor: h.isFree ? 'pointer' : 'not-allowed',
              opacity: h.isFree ? 1 : 0.6,
              border: h.isFree ? '4px solid #4caf50' : '4px solid #f44336'
            }}
          >
            <h3>{h.name}</h3>
            <p>📍 {h.location}</p>
            <p style={{fontSize: 24, fontWeight: 'bold'}}>UGX {h.price.toLocaleString()}</p>
            <p>Rooms left: {h.rooms_left}/{h.total_rooms}</p>
            <div style={{padding: 8, borderRadius: 10, background: h.isFree ? '#e8f5e9' : '#ffebee', color: h.isFree ? '#2e7d32' : '#c62828', fontWeight: 'bold', textAlign: 'center'}}>
              {h.isFree ? '✓ Available' : '✗ Full'}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background: 'white', padding: 40, borderRadius: 20, maxWidth: 400}}>
            <h2>{selected.name}</h2>
            <p>UGX {selected.price.toLocaleString()}/night</p>
            
            <input 
              placeholder="Your name" 
              value={bookerName}                    
              onChange={e => setBookerName(e.target.value)}
              style={{width:'100%', padding:12, marginBottom:10, borderRadius:8, border:'2px solid #ddd'}}
            />
            <input 
              placeholder="Phone" 
              value={bookerPhone}                   
              onChange={e => setBookerPhone(e.target.value)}
              style={{width:'100%', padding:12, marginBottom:20, borderRadius:8, border:'2px solid #ddd'}}
            />
            
            <button onClick={handleBook} style={{width: '100%', padding:14, background: '#667eea', color: 'white', border: 'none', borderRadius: 25}}>
              Reserve Room
            </button>
            <button onClick={() => {setSelected(null); setBookerName(''); setBookerPhone('')}} style={{width: '100%', padding:12, marginTop: 10, background: '#ccc', border: 'none', borderRadius: 25}}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}