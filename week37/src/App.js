import { Routes, Route } from "react-router-dom";
import { Sign } from "./pages/sign/signup";
import { Log } from "./pages/Login/login";
import { ForgotPassword } from "./pages/Login/forget";
import { ResetPassword } from "./pages/Login/reset";

function App() {
  return (
    <Routes>

      <Route path='/' element={<Log />} />
      <Route path='/sign' element={<Sign />} />
      <Route path='/forgot' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />

    </Routes>
  );
}

export default App;
