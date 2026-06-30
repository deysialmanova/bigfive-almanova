"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // A mágica do envio de e-mail será conectada aqui no futuro
    setIsRegistered(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', backgroundColor: '#FFFFFF' }}>
      
      {/* TRUQUE MÁGICO: Esconder o cabeçalho e rodapé originais */}
      <style dangerouslySetInnerHTML={{__html: `
        header, footer, nav, .footer, .header { display: none !important; }
      `}} />

      {/* Cabeçalho: Carmim com espaço para Logo */}
      <div style={{ backgroundColor: '#960018', color: 'white', padding: '50px 20px', textAlign: 'center' }}>
        
        {/* ESPAÇO PARA O LOGO DA ALMANOVA */}
        <div style={{ 
          width: '130px', 
          height: '130px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '50%', 
          margin: '0 auto 20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#960018',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          border: '3px solid #FFD700',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          [Logo Almanova]
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px' }}>
          Almanova
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', color: '#FFF8F8' }}>
          Descubra os traços da sua personalidade. Este mapeamento é o primeiro passo para o seu processo de autoconhecimento e nos guiará em nossos encontros clínicos.
        </p>
      </div>

      {/* Corpo: Área clara com Textos Explicativos e Formulário */}
      <div style={{ flex: 1, backgroundColor: '#FAFAFA', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TEXTO DE INTRODUÇÃO DO BIG FIVE */}
        <div style={{ maxWidth: '650px', width: '100%', textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px', fontStyle: 'italic', color: '#666' }}>
            Você está prestes a ter acesso ao principal modelo para estudos de personalidade e predição de comportamento do mundo.
          </p>
          
          <h2 style={{ color: '#960018', fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '10px' }}>
            Big Five
          </h2>
          
          <p style={{ fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '15px', color: '#444' }}>
            Descubra seu perfil com o modelo dos Cinco Grandes Fatores
          </p>
          
          <p style={{ fontSize: '1rem', marginBottom: '25px', backgroundColor: '#FFF', border: '1px solid #E0E0E0', borderLeft: '5px solid #960018', padding: '15px', borderRadius: '8px', lineHeight: '1.6' }}>
            120 afirmações &middot; 5 traços &middot; 30 facetas.<br/>
            <strong>Responda com honestidade &mdash; não há respostas certas ou erradas.</strong>
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', fontSize: '0.95rem', fontWeight: 'bold', color: '#960018' }}>
            <span>N &middot; Neuroticismo</span>
            <span>E &middot; Extroversão</span>
            <span>A &middot; Abertura</span>
            <span>A &middot; Amabilidade</span>
            <span>C &middot; Conscienciosidade</span>
          </div>
        </div>

        {/* Formulário de Cadastro */}
        {!isRegistered ? (
          <form onSubmit={handleRegister} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(150,0,24,0.1)', borderTop: '6px solid #FFD700', maxWidth: '450px', width: '100%' }}>
            <h2 style={{ color: '#960018', fontSize: '1.8rem', marginBottom: '25px', textAlign: 'center', fontWeight: 'bold' }}>
              Preencha para iniciar
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 'bold' }}>Nome completo</label>
              <input type="text" required placeholder="Como você gosta de ser chamada" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 'bold' }}>WhatsApp</label>
              <input type="tel" required placeholder="(00) 00000-0000" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 'bold' }}>E-mail</label>
              <input type="email" required placeholder="Onde você receberá seu relatório" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#FFD700', color: '#960018', fontWeight: 'bold', fontSize: '1.2rem', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: '0.3s' }}>
              Cadastrar e Continuar
            </button>
          </form>
        ) : (
          
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(150,0,24,0.1)', borderTop: '6px solid #FFD700', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <h2 style={{ color: '#960018', fontSize: '2.2rem', marginBottom: '20px' }}>
              Tudo pronto, {formData.name.split(' ')[0]}!
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px', lineHeight: '1.6' }}>
              Seus dados foram registrados. O questionário a seguir levará cerca de 10 a 15 minutos. Responda com a primeira coisa que vier à mente. Ao final, o relatório será encaminhado para o seu e-mail.
            </p>
            <Link href="/test" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: '#960018', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', borderRadius: '6px' }}>
              Começar o Questionário
            </Link>
          </div>

        )}
      </div>
    </div>
  );
}