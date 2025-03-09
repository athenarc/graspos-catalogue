import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthContext.jsx";
import AppLayout from "./components/AppLayout.jsx";
import LoginForm from "./components/Forms/LoginForm.jsx";
import ProfileForm from "./components/Forms/ProfileForm.jsx";
import RegisterForm from "./components/Forms/RegisterForm.jsx";
import DatasetForm from "./components/Forms/DatasetForm.jsx";
import DocumentForm from "./components/Forms/DocumentForm.jsx";
import ToolForm from "./components/Forms/ToolForm.jsx";

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
              <Route path="/dataset/add" element={<DatasetForm />}></Route>
              <Route path="/document/add" element={<DocumentForm />}></Route>
              <Route path="/tool/add" element={<ToolForm />}></Route>
              <Route path="*" exact element={<Navigate to={"/"} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
