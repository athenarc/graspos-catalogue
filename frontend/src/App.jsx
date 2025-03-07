import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthContext.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Form from "./components/Forms/Form.jsx";
import LoginForm from "./components/Forms/LofinForm.jsx";
import ProfileForm from "./components/Forms/ProfileForm.jsx";
import RegisterForm from "./components/Forms/RegisterForm.jsx";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/login" element={<LoginForm />}></Route>
              <Route path="/register" element={<RegisterForm />}></Route>
              <Route path="/profile" element={<ProfileForm />}></Route>
              <Route path="/resources/add" element={<Form />}></Route>
              <Route path="*" exact element={<Navigate to={"/"} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
