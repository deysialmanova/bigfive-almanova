"use client";
import React, { useEffect } from 'react';

export default function TestPage() {
  
  // Forçar o idioma e desativar o comportamento padrão de tempo assim que a tela carrega
  useEffect(() => {
    // Define o idioma no navegador para português brasileiro
    document.documentElement.lang = 'pt-BR';
    
    // Pequeno truque para tentar desativar timers que estejam rodando no script original
    const localStorageKey = 'bigfive-test-timer';
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(localStorageKey);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#FAFAFA' }}>
      
      {/* Esconder cabeçalho, rodapé, menus e o elemento do cronômetro visual se ele existir */}
      <style dangerouslySetInnerHTML={{__html: `
        header, footer, nav, .footer, .header, .timer-component, [class*="timer"], [class*="countdown"] { 
          display: none !important; 
        }
      `}} />

      {/* Cabeçalho Fixo da sua Clínica */}
      <div style={{ backgroundColor: '#960018', color: 'white', padding: '20px', textAlign: 'center', borderBottom: '4px solid #FFD700' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold' }}>Almanova &middot; Questionário de Personalidade</h2>
      </div>

      {/* Área onde o teste original vai rodar, mas agora sem pressa */}
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>
          Responda no seu próprio ritmo. Não há limite de tempo para esta avaliação.
        </p>
        
        {/* Aqui o projeto original carrega os componentes das perguntas */}
        {/* Como mudamos o motor para Next.js, ele vai puxar a tradução automática para PT-BR se ela estiver configurada no sistema de idiomas deles */}
      </div>
    </div>
  );
}
// Forçar a remoção visual do cronômetro, cabeçalho e rodapé do MIT
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    header, footer, nav, .footer, .header, [class*="Header"], [class*="Footer"], [class*="nav"], [class*="timer"], [class*="countdown"], .v-counter, [class*="Timer"] { 
      display: none !important; 
    }
  `;
  document.head.appendChild(style);
}
