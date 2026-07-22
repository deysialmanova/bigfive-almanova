"use client";
import { useEffect } from 'react';

export default function TestSetup() {
  useEffect(() => {
    // Verificação de identificação obrigatória
    try {
      const stored = localStorage.getItem('almanova_user_info');
      let isValid = false;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name?.trim() && parsed?.email?.trim()) {
          isValid = true;
        }
      }
      if (!isValid) {
        alert('Atenção: É necessário preencher seus dados de identificação antes de iniciar o questionário.');
        window.location.href = '/';
        return;
      }
    } catch (e) {
      window.location.href = '/';
      return;
    }

    // Forçar português brasileiro no documento
    document.documentElement.lang = 'pt-BR';
    
    // Limpar timer antigo do localStorage
    const localStorageKey = 'bigfive-test-timer';
    window.localStorage.removeItem(localStorageKey);
    
    // Esconder layouts indesejados dinamicamente
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Remove o padding superior padrão do layout NextUI/Tailwind para tela cheia
    if (main) {
      main.classList.remove('pt-16', 'px-6');
      main.style.paddingTop = '0px';
      main.style.paddingLeft = '0px';
      main.style.paddingRight = '0px';
      main.style.maxWidth = '100%';
    }

    return () => {
      // Restaurar ao desmontar a página
      if (navbar) navbar.style.display = '';
      if (footer) footer.style.display = '';
      if (main) {
        main.classList.add('pt-16', 'px-6');
        main.style.paddingTop = '';
        main.style.paddingLeft = '';
        main.style.paddingRight = '';
        main.style.maxWidth = '';
      }
    };
  }, []);

  return (
    <style dangerouslySetInnerHTML={{__html: `
      /* Cabeçalho e rodapé removidos */
      header, footer, nav, .footer, .header, .timer-component, [class*="timer"], [class*="countdown"], .v-counter, [class*="Timer"] { 
        display: none !important; 
      }
      
      /* Cores customizadas da Almanova para os componentes NextUI */
      
      /* Botões Voltar/Avançar (Primary) */
      .bg-primary {
        background-color: #871217 !important;
        color: #ffffff !important;
      }
      .bg-primary:hover {
        background-color: #720f13 !important;
      }
      
      /* Botão Ver Resultados (Secondary) */
      .bg-secondary {
        background-color: #FFBA1F !important;
        color: #871217 !important;
      }
      .bg-secondary:hover {
        background-color: #e0a31b !important;
      }
      
      /* Barra de Progresso */
      .bg-secondary[role="progressbar"] > div,
      div[role="progressbar"] .bg-secondary,
      .bg-secondary.h-full {
        background-color: #871217 !important;
      }
      
      /* Rádios e Inputs */
      .text-secondary {
        color: #871217 !important;
      }
      .border-secondary {
        border-color: #871217 !important;
      }
      
      /* Estilos para Radio do NextUI v2 */
      span[class*="bg-secondary"], 
      span[class*="after:bg-secondary"]::after,
      span[class*="group-data-[selected=true]:bg-secondary"] {
        background-color: #871217 !important;
      }
      span[class*="border-secondary"],
      span[class*="group-data-[selected=true]:border-secondary"] {
        border-color: #871217 !important;
      }
    `}} />
  );
}
