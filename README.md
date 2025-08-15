# 🚀 EIC Pathway - Student Assessment & Learning Platform

A comprehensive web application designed to assess and guide students through the EIC (Entrepreneurship Innovation Center) Pathway at Bowie State University.

## ✨ Features

### 🎯 **Smart Level Assessment System**
- **8-question adaptive assessment** to determine student experience level
- **Intelligent phase placement** based on comprehensive scoring algorithm
- **Personalized learning pathways** tailored to individual skill levels
- **Real-time progress tracking** and phase recommendations

### 🔐 **Enterprise-Grade Security**
- **JWT-based authentication** with secure token management
- **Email verification system** with 6-digit codes
- **Domain-restricted access** (Bowie State University emails only)
- **Rate limiting** and account lockout protection
- **bcrypt password hashing** with industry-standard security
- **FERPA and GDPR compliant** data handling

### 🎨 **Modern User Experience**
- **Responsive design** optimized for all devices
- **Intuitive navigation** with React Router
- **Beautiful UI components** built with Tailwind CSS
- **Real-time feedback** and validation
- **Personalized welcome messages** using student names

### 🏗️ **Robust Architecture**
- **React.js frontend** with TypeScript
- **Node.js backend** with MongoDB database
- **Unified server architecture** for simplified deployment
- **RESTful API** with comprehensive error handling
- **Scalable design** for future growth

## 🛠️ Technology Stack

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Shadcn/ui** component library
- **Vite** for build tooling

### **Backend**
- **Node.js** with ES modules
- **MongoDB** for data persistence
- **JWT** for authentication
- **bcryptjs** for password security
- **Nodemailer** for email services

### **Security & Infrastructure**
- **JWT tokens** with automatic refresh
- **Rate limiting** and account protection
- **CORS protection** with controlled origins
- **Environment variable** management
- **Ngrok integration** for public access

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd eic-pathfinder-app-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp server/env-template.txt .env
   # Edit .env with your actual values
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### **Production Build**

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the unified server**
   ```bash
   npm run start
   ```

3. **For public access with ngrok**
   ```bash
   npm run start:ngrok
   ```

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT Security Keys (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017

# Server Port
PORT=3000
```

### **MongoDB Setup**

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Create database**: `eic-pathfinder`
3. **Collections will be created automatically** on first use

## 📱 Usage

### **Student Registration**
1. **Navigate to** `/login`
2. **Enter Bowie State email** (e.g., `student@bowiestate.edu`)
3. **Click "Send Code"** to receive verification
4. **Enter 6-digit code** and verify email
5. **Complete registration** with personal details

### **Level Assessment**
1. **After login**, automatically redirected to assessment
2. **Answer 8 questions** about your experience
3. **Receive personalized phase placement**
4. **View your customized learning pathway**

### **Learning Pathway**
1. **Browse phases** based on your assessment results
2. **Track progress** through the EIC curriculum
3. **Retake assessment** anytime to update placement
4. **Logout securely** when finished

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT tokens** with automatic refresh
- **Secure password hashing** with bcrypt
- **Email verification** required for registration
- **Session management** with configurable timeouts

### **Data Protection**
- **Input validation** on all endpoints
- **SQL injection protection** via MongoDB driver
- **XSS protection** with content security policies
- **CSRF protection** through token validation

### **Access Control**
- **Domain restriction** to Bowie State emails
- **Rate limiting** on authentication endpoints
- **Account lockout** after failed attempts
- **Secure headers** and CORS configuration

## 📊 Assessment Algorithm

### **Scoring System**
- **8 comprehensive questions** covering key EIC areas
- **Weighted scoring** based on experience level
- **Phase recommendation** using statistical analysis
- **Dynamic placement** based on current capabilities

### **Phase Categories**
- **Phase 1**: Beginner level (0-16 points)
- **Phase 2**: Intermediate level (17-24 points)  
- **Phase 3**: Advanced level (25+ points)

### **Question Categories**
- Entrepreneurship experience
- Innovation methodologies
- Creative thinking skills
- Business development knowledge
- Technology proficiency
- Market analysis skills
- Team collaboration experience
- Project management expertise

## 🚀 Deployment

### **Local Development**
```bash
npm run dev          # Start development servers
npm run build:full   # Build and start unified server
```

### **Production Deployment**
```bash
npm run build        # Build frontend
npm run start        # Start production server
```

### **Public Access with Ngrok**
```bash
npm run start:ngrok  # Start server and expose via ngrok
```

## 📈 Performance & Scalability

### **Optimizations**
- **Code splitting** for faster loading
- **Lazy loading** of components
- **Optimized bundle** with Vite
- **Efficient database queries**

### **Scalability Features**
- **Stateless authentication** for horizontal scaling
- **Modular architecture** for easy expansion
- **Environment-based configuration**
- **Database connection pooling**

## 🧪 Testing

### **Manual Testing**
1. **User registration** with email verification
2. **Login functionality** and session management
3. **Assessment completion** and phase placement
4. **Pathway navigation** and progress tracking
5. **Security features** (rate limiting, account lockout)

### **Security Testing**
- **Authentication bypass** attempts
- **SQL injection** prevention
- **XSS protection** validation
- **CSRF attack** prevention
- **Rate limiting** effectiveness

## 🤝 Contributing

### **Development Workflow**
1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### **Code Standards**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional commits** for version control

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bowie State University** for the EIC Pathway concept
- **React.js** community for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the robust database solution
- **Open source community** for security best practices

## 📞 Support

For support, please contact:
- **Technical Issues**: [GitHub Issues](https://github.com/yourusername/eic-pathfinder-app/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/eic-pathfinder-app/discussions)
- **Security Concerns**: [Security Policy](https://github.com/yourusername/eic-pathfinder-app/security/policy)

---

**Built with ❤️ for Bowie State University's EIC Pathway Program**

*Last updated: December 2024*
