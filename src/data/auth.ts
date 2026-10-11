export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  createdAt: string;
}

// Mock Database
const MOCK_USERS: Record<string, User> = {
  "9876543210": {
    id: "USR-001",
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "9876543210",
    createdAt: "2024-01-15T08:00:00Z",
  },
};

const MOCK_OTP = "123456";

export async function sendOtp(phoneOrEmail: string): Promise<{ success: boolean; isNewUser: boolean; message: string }> {
  if (process.env.NODE_ENV === "production") return { success: false, isNewUser: false, message: "Sign in is currently unavailable." };
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedPhone = phoneOrEmail.replace(/\D/g, '').slice(-10);
      
      const userExists = !!MOCK_USERS[normalizedPhone] || Object.values(MOCK_USERS).some(u => u.email === phoneOrEmail);

      resolve({
        success: true,
        isNewUser: !userExists,
        message: `OTP sent to ${phoneOrEmail}`,
      });
    }, 800);
  });
}

export async function verifyOtp(phoneOrEmail: string, otp: string, nameForSignup?: string): Promise<{ success: boolean; user?: User; error?: string }> {
  if (process.env.NODE_ENV === "production") return { success: false, error: "Sign in is currently unavailable." };
  return new Promise((resolve) => {
    setTimeout(() => {
      if (otp !== MOCK_OTP) {
        resolve({ success: false, error: "Incorrect OTP. Please try again." });
        return;
      }

      const normalizedPhone = phoneOrEmail.replace(/\D/g, '').slice(-10) || "9999999999";
      
      let user = MOCK_USERS[normalizedPhone] || Object.values(MOCK_USERS).find(u => u.email === phoneOrEmail);
      
      if (!user) {
        // Create new user
        user = {
          id: `USR-${Math.random().toString(36).substring(2, 8)}`,
          name: nameForSignup || "Guest Customer",
          phone: normalizedPhone,
          email: phoneOrEmail.includes("@") ? phoneOrEmail : undefined,
          createdAt: new Date().toISOString(),
        };
        MOCK_USERS[normalizedPhone] = user;
      }

      resolve({ success: true, user });
    }, 1200);
  });
}
