import RegisterForm from '../components/RegisterForm';
import AuthLayout from '../components/AuthLayout';

export function RegisterPage() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center mb-6">Rejestracja</h2>
      <RegisterForm />
    </AuthLayout>
  );
}
export default RegisterPage;