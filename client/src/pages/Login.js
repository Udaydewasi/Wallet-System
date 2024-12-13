import loginImg from "../assets/Images/login2.jpeg"
import Template from "../component/Auth/Template"

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Investment to future-proof your life."
      image={loginImg}
      formType="login"
    />
  )
}

export default Login
