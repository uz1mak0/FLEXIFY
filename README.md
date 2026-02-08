# FLEXIFY - Next.js Project

A modern social media platform that everyone can share their experiences in lif with secured identity, built with Next.js, TypeScript, Tailwind CSS, and Node.js.

## Project Structure

```
flexify/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── home/route.ts         # Login endpoint
│   │   ├── register/route.ts     # Registration endpoint
│   │   ├── reset-password/route.ts
│   │   ├── verify-otp/route.ts
│   │   ├── set-new-password/route.ts
│   │   └── feed/route.ts         # Feed endpoint
│   ├── forgetpassword/page.tsx   # Forgot password page
│   ├── verify-otp/page.tsx       # OTP verification page
│   ├── reset-password-page/page.tsx # Reset password page
│   ├── register/page.tsx         # Registration page
│   ├── home/page.tsx             # Home/feed page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Login page (root)
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
├── lib/
│   ├── otpHandler.ts             # OTP generation & verification
│   ├── emailService.ts           # Email sending service
│   └── mockData.ts               # Mock feed data
├── public/
│   └── star.mp4                  # Background video
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .env.local                    # Environment variables
└── README.md
```

## Features

- 🔐 **Authentication**
  - Login page with email validation
  - User registration with password confirmation
  - Forgot password flow with OTP
  - Password reset with strength requirements

- 📧 **Email Service**
  - OTP generation and sending via Nodemailer
  - 10-minute OTP expiration
  - Resendable OTPs

- 🎨 **Modern UI**
  - Frosted glass effects
  - Dark mode support
  - Responsive design
  - Smooth animations and transitions

- 📱 **Social Features**
  - Infinite-loading feed
  - Post creation UI
  - Like and comment interactions
  - User profiles

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**For Gmail:**
1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated 16-character password in `EMAIL_PASSWORD`

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/home` | POST | Login endpoint |
| `/api/register` | POST | User registration |
| `/api/reset-password` | POST | Request password reset OTP |
| `/api/verify-otp` | POST | Verify OTP |
| `/api/set-new-password` | POST | Reset password |
| `/api/feed` | GET | Fetch paginated feed |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Login page |
| `/register` | Registration page |
| `/home` | Home/feed page |
| `/forgetpassword` | Forgot password page |
| `/verify-otp` | OTP verification page |
| `/reset-password-page` | Reset password page |

## Key Features Breakdown

### Authentication Flow

1. **User Registration** → `/register`
2. **User Login** → `/` → `/home`
3. **Forgot Password** → `/forgetpassword` → Request OTP
4. **Verify OTP** → `/verify-otp` → Verify code sent to email
5. **Reset Password** → `/reset-password-page` → Set new password

### OTP System

- 6-digit numeric OTP
- 10-minute expiration time
- Resendable after 30 seconds
- In-memory storage (for production, use Redis/Database)

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Database Integration (TODO)

Currently, the app uses:
- In-memory storage for OTPs
- Mock data for the feed

For production, implement:
1. Database connection (PostgreSQL, MongoDB, etc.)
2. User model and authentication
3. Post model and feed system
4. Session management

## Email Service

The app uses **Nodemailer** for sending OTPs. Currently configured for Gmail, but can be adapted for:
- SendGrid
- Mailgun
- AWS SES
- Custom SMTP servers

## Deployment

### Deploy to Vercel

```bash
git push origin main
```

Vercel will automatically deploy from your GitHub repository.

### Environment Variables for Production

Set these in your Vercel dashboard:
- `EMAIL_USER`
- `EMAIL_PASSWORD`

## Technologies Used

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Email:** Nodemailer
- **OTP:** otp-generator
- **UI Components:** React 19

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Server-side rendering (SSR)
- Image optimization
- Code splitting
- CSS optimization
- Lazy loading

## Security Considerations

1. **OTP Security:**
   - 10-minute expiration
   - One-time use verification
   - Stored securely (transition to database)

2. **Password Security:**
   - Strong password requirements
   - Client-side validation
   - Server-side validation needed

3. **API Security:**
   - Input validation
   - Error handling
   - Rate limiting (recommended for production)

## Future Enhancements

- [ ] Implement database(PostgreSQL or MongoDB)
- [ ] Add user authentication (JWT/Sessions)
- [ ] Implement real posting feature
- [ ] Add real-time notifications
- [ ] Implement user profiles
- [ ] Add file upload for images/videos
- [ ] Implement search functionality
- [ ] Add follow/unfollow system
- [ ] Implement direct messaging
- [ ] Add analytics dashboard

## Troubleshooting

### Email not sending?
- Check `.env.local` configuration
- Verify Gmail App Password is correct
- Ensure 2-Factor Authentication is enabled on Gmail

### OTP expired?
- OTP expires after 10 minutes
- Use the "Resend OTP" button (available after 30 seconds)

### Password reset not working?
- Ensure you've verified your email via OTP
- Check browser console for errors
- Verify `.env.local` variables are set

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

---

**Note:** This is a scaffolded application ready for production integration. Implement database connections and real authentication before deploying to production.
