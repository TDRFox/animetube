import React, { useState } from 'react';
const sampleVideos = [
  { id: 'v1', title: 'OP: Shinobi No Yume', author: 'Studio Kage', thumbnail: 'https://placehold.co/600x340?text=Anime+1', src: '' },
  { id: 'v2', title: 'AMV: Moonlight Fight', author: 'FansubLab', thumbnail: 'https://placehold.co/600x340?text=AMV+2', src: '' },
  { id: 'v3', title: 'Episode 1 - Prologue', author: 'Studio Nebula', thumbnail: 'https://placehold.co/600x340?text=Episode+1', src: '' }
];
export default function AnimeTubePrototype(){
  const [videos] = useState(sampleVideos);
  const [selected, setSelected] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex items-center gap-4">
        <h1 className="text-2xl font-extrabold text-purple-600">AnimeTube</h1>
        <input className="flex-1 border rounded px-3 py-2" placeholder="Rechercher..." />
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Uploader</button>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-6">
        {videos.map(v=>(
          <article key={v.id} className="bg-white rounded shadow overflow-hidden">
            <button onClick={()=>setSelected(v)} className="w-full text-left">
              <img src={v.thumbnail} alt="" className="w-full h-40 object-cover" />
              <div className="p-3">
                <h4 className="font-semibold">{v.title}</h4>
                <p className="text-sm text-gray-500">{v.author}</p>
              </div>
            </button>
          </article>
        ))}
      </main>
      {selected && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white w-[90%] md:w-3/4 p-4 rounded">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">{selected.title}</h3>
            <button onClick={()=>setSelected(null)} className="px-3 py-1 border rounded">Fermer</button>
          </div>
          <div className="mt-4">Lecteur vidéo (mock)</div>
        </div>
      </div>}
    </div>
  );
}
