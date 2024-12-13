import signupImg from "../assets/Images/signup2.jpg"
import Template from "../component/Auth/Template"

function Signup() {
  return (
    <Template
      title="Join the millions Investor to invest with Swan-Investment"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Investment to future-proof your life."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup