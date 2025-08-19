# 🎯 Sistema de Cadastro de Categorias

Um sistema moderno de cadastro de categorias e usuários desenvolvido em React com modo escuro/claro.

## ✨ Funcionalidades

- **📋 Cadastro de Categorias** - CRUD completo com validação
- **👥 Cadastro de Usuários** - Gerenciamento de usuários
- **🌙 Modo Escuro/Claro** - Toggle automático com persistência
- **🔍 Busca e Filtros** - Sistema avançado de busca
- **📊 Exportação** - Exportar dados para CSV
- **📱 Responsivo** - Interface adaptável para mobile
- **🎨 UI Moderna** - Design limpo e intuitivo

## 🚀 Tecnologias

- **React 19** - Framework principal
- **React Router DOM** - Navegação
- **Vite** - Build tool
- **CSS Variables** - Sistema de temas
- **LocalStorage** - Persistência de dados

## 🛠️ Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/cadastro-categoria.git
cd cadastro-categoria
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Execute o projeto:**

```bash
npm run dev
```

4. **Acesse no navegador:**

```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.jsx      # Layout principal
│   ├── ThemeToggle.jsx # Toggle de tema
│   └── DataList.jsx    # Lista de dados
├── hooks/              # Hooks personalizados
│   ├── useTheme.js     # Gerenciamento de tema
│   ├── useLocalStorage.js
│   └── useFormValidation.js
├── pages/              # Páginas da aplicação
│   ├── Home/           # Página inicial
│   ├── CategoryList/   # Lista de categorias
│   ├── CategoryForm/   # Formulário de categoria
│   ├── UserList/       # Lista de usuários
│   └── UserForm/       # Formulário de usuário
├── styles/             # Estilos compartilhados
├── utils/              # Utilitários
└── assets/             # Recursos estáticos
```

## 🎨 Modo Escuro

O projeto inclui um sistema completo de modo escuro:

- **Toggle automático** - Botão sol/lua na sidebar
- **Persistência** - Salva preferência no localStorage
- **Detecção do sistema** - Usa preferência do SO automaticamente
- **Transições suaves** - Animações CSS fluidas

## 📱 Responsividade

- **Desktop** - Layout completo com sidebar
- **Mobile** - Sidebar colapsível e otimizada
- **Tablet** - Layout adaptativo

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificação de código
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)

---

⭐ Se este projeto te ajudou, deixe uma estrela!
