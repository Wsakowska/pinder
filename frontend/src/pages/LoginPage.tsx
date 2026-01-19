import LoginForm from '../components/LoginForm.tsx';
import AuthLayout from '../components/AuthLayout.tsx';

export function LoginPage() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center mb-6">Logowanie</h2>
      <LoginForm />
    </AuthLayout>
  );
}
export default LoginPage;