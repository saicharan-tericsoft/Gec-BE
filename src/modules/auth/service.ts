import { User } from '../user/model';
import { comparePassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';
import { generateOTP, verifyOTP } from '../otp/service';

// ADMIN LOGIN
export const adminLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email, role: 'admin' });

  if (!user) throw new Error('Invalid credentials');

  const isMatch = await comparePassword(password, user.passwordHash!);

  if (!isMatch) throw new Error('Invalid credentials');

  return generateToken({
    userId: user._id,
    role: user.role,
    adminType: user.adminType
  });
};

// STUDENT REQUEST OTP
export const requestStudentOTP = async (email: string, applicationId: string, flag: boolean) => {
  const field = flag ? 'email' : 'phoneNo';
  const user = await User.findOne({ [field]: email, applicationId, role: 'student' });

  if (!user || !user.isEligible) {
    throw new Error('Not eligible');
  }

  await generateOTP(email);
};

// STUDENT LOGIN WITH OTP
export const studentLogin = async (email: string, otp: string) => {
  const field = email.includes('@') ? 'email' : 'phoneNo';
  const isValid = await verifyOTP(email, otp, field);

  if (!isValid) throw new Error('Invalid OTP');

  const user = await User.findOne({ [field]: email });

  return generateToken({
    userId: user!._id,
    role: 'student'
  });
};