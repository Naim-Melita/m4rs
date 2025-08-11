import React from 'react';

/* Simple header con input a la izquierda de la lupa (no flotante) */
export default function Header(){
  return (
    <header className="header container" style={{padding:0}}>
      <div className="brand">
        <div style={{
          width:52, height:52, borderRadius:12, background:'var(--black)',
          display:'flex',alignItems:'center',justifyContent:'center', color:'white', fontWeight:700
        }}>M</div>
        <div>
          <div className="title">MIERES — Propuestas</div>
          <div style={{fontSize:12,color:'var(--gray)'}}>Julio 2025 — Any & Santi</div>
        </div>
      </div>

      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <div className="searchBox" role="search" aria-label="Buscar propuestas">
          {/* input a la izquierda */}
          <input placeholder="Buscar propuesta, tipografía..." />
          <div className="searchIcon" title="Buscar">
            {/* lupa SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21 21l-4.35-4.35" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="11" r="6" stroke="#333" strokeWidth="1.6" />
            </svg>
          </div>
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <button style={{
            padding:'8px 12px', borderRadius:8, border:'1px solid rgba(0,0,0,0.06)',
            background:'white', cursor:'pointer'
          }}>Descargar PDF</button>
          <div style={{width:40,height:40,borderRadius:8,background:'var(--light)',display:'flex',alignItems:'center',justifyContent:'center'}}>⚙️</div>
        </div>
      </div>
    </header>
  )
}
