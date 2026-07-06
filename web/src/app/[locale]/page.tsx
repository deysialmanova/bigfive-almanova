"use client";
import React, { useState, useEffect } from 'react';
import { Link } from '@/navigation';

export default function HomePage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Ocultar cabeçalho, rodapé e menu de navegação originais na página inicial
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Remove o padding do contêiner geral para permitir um design clean e centralizado
    if (main) {
      main.classList.remove('pt-16', 'px-6');
      main.style.paddingTop = '0px';
      main.style.paddingLeft = '0px';
      main.style.paddingRight = '0px';
      main.style.maxWidth = '100%';
    }

    return () => {
      // Restaurar ao sair da página inicial
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Armazena no localStorage para recuperar na finalização do teste
    localStorage.setItem('almanova_user_info', JSON.stringify(formData));
    setIsRegistered(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Ícones com link para WhatsApp e Instagram no topo direito da página */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-10">
        <a 
          href="https://api.whatsapp.com/send?phone=5511919677918" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#871217] hover:text-[#FFBA1F] transition-colors p-2.5 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center"
          title="Fale no WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.022-.015-.043-.027-.065-.04l-2.222-1.107c-.4-.2-.8-.2-1.1.2l-.995 1.216c-.225.275-.55.225-.975-.025-1.116-.625-2.033-1.542-2.658-2.658-.25-.425-.025-.75.25-.975l1.216-.995c.4-.3.4-.7.2-1.1L10.32 6.64c-.113-.227-.24-.343-.377-.384-.236-.07-.577-.07-.872.23l-1.22 1.22a2.38 2.38 0 0 0-.675 1.545c.01 2.21.82 4.4 2.585 6.165 1.765 1.765 3.955 2.575 6.165 2.585a2.38 2.38 0 0 0 1.545-.675l1.22-1.22c.3-.3.3-.64.23-.872-.04-.137-.157-.264-.384-.377zM12 2C6.477 2 2 6.477 2 12c0 1.71.43 3.32 1.18 4.75L2.05 21.95l5.35-1.13C8.78 21.57 10.33 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.56 0-3.02-.45-4.28-1.23l-.3-.19-3.18.67.68-3.11-.2-.3A7.957 7.957 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </a>
        <a 
          href="https://www.instagram.com/deysi.almanova/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#871217] hover:text-[#FFBA1F] transition-colors p-2.5 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center"
          title="Siga no Instagram"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Coluna da Esquerda: Marca e Textos */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Logo Minimalista Almanova com Dados da Terapeuta */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#871217] flex items-center justify-center text-white font-bold text-lg border-2 border-[#FFBA1F] shadow-md">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-widest text-[#871217] font-serif leading-none">ALMANOVA</span>
              <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Terapeuta - Deysi Dias</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#871217] font-serif">
              Big Five
            </h1>
            <p className="text-xl font-medium text-slate-700">
              Descubra seu perfil com o modelo dos Cinco Grandes Fatores
            </p>
          </div>

          <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
            <p className="font-medium text-slate-800">
              Você está prestes a ter acesso ao principal modelo para estudos de personalidade e predição de comportamento do mundo.
            </p>
            <p>
              Este projeto utiliza como base o projeto open source sob licença MIT, personalizado para a metodologia de devolutiva clínica da Almanova.
            </p>
            <p>
              Ao final da avaliação, você poderá agendar uma sessão de devolutiva individual para interpretação completa do relatório e leitura das correlações entre as facetas, além de compreender como esse perfil se relaciona com sua história, seus desafios atuais e seus objetivos.
            </p>
          </div>
        </div>

        {/* Coluna da Direita: Card com Formulário ou Sucesso */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden max-w-md mx-auto">
            {/* Faixa decorativa no topo do Card */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#871217] to-[#FFBA1F]" />

            {!isRegistered ? (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="text-center pb-2">
                  <h3 className="text-2xl font-bold text-slate-800">Identificação</h3>
                  <p className="text-sm text-slate-500 mt-1">Preencha seus dados para iniciar a avaliação</p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Como você gostaria de ser chamado"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#871217] focus:border-transparent transition-colors text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Seu melhor e-mail"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#871217] focus:border-transparent transition-colors text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#871217] focus:border-transparent transition-colors text-slate-800 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#871217] hover:bg-[#720f13] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
                >
                  Confirmar e Avançar
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Tudo pronto, {formData.name.split(' ')[0]}!
                </h3>
                
                <p className="text-slate-600 mb-8 text-sm sm:text-base leading-relaxed">
                  O questionário a seguir levará cerca de 10 a 15 minutos. Responda com honestidade e no seu próprio ritmo. Ao final, suas respostas serão registradas para a sua devolutiva individual.
                </p>
                
                <Link
                  href="/test"
                  className="block w-full py-4 px-6 bg-gradient-to-r from-[#871217] to-[#a31c22] hover:from-[#720f13] hover:to-[#871217] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  Começar o Questionário
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
