import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { AuthContextProvider } from "@/auth/AuthContext";
import { Home } from "@/components/app/Home";
import { Loading } from "@/components/app/Loading";
import { Navbar } from "@/components/app/Navbar";
import { ToastContainer } from "@/components/app/toast";
import { Calendar } from "@/components/appointments/Calendar";
import { AllStaff } from "@/components/staff/AllStaff";
import { usePrefetchTreatments } from "@/components/treatments/hooks/useTreatments";
import { Treatments } from "@/components/treatments/Treatments";
import { Signin } from "@/components/user/Signin";
import { UserProfile } from "@/components/user/UserProfile";
import { queryClient } from "@/react-query/queryClient";
import { theme } from "@/theme";

const NotTreatmentLayout = () => {
  usePrefetchTreatments();

  return <Outlet />;
};

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Loading />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<NotTreatmentLayout />}>
                <Route index element={<Home />} />
                <Route path="Staff" element={<AllStaff />} />
                <Route path="Calendar" element={<Calendar />} />
                <Route path="signin" element={<Signin />} />
                <Route path="user/:id" element={<UserProfile />} />
              </Route>
              <Route path="/Treatments" element={<Treatments />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </AuthContextProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
};
