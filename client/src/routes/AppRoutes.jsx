import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ChangePassword from "../pages/auth/ChangePassword";
import MainLayout from "../components/layouts/MainLayouts";
import Doctors from "../pages/admin/doctors/Doctors";
import Tests from "../pages/admin/tests/Tests";
import Patients from "../pages/admin/patients/Patients";
import Medicines from "../pages/admin/medicines/Medicines";
import AdminVisits from "../pages/admin/visits/AdminVisits";
import Dashboard from  "../pages/admin/dashboard/Dashboard";
import DoctorsList from "../pages/reception/DoctorsList";
import CreateVisit from "../pages/reception/CreateVisit";
import RecepDash from "../pages/reception/Dashboard";
import DoctorPatients from "../pages/doctor/DocotorPatients";
import Consultation from "../pages/doctor/Consultation";
import RecepPatients from "../pages/reception/Patients";
import RecepBilling from "../pages/reception/Billing";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAllPatients from "../pages/doctor/DoctorAllPatients";
import Revenue from "../pages/admin/revenue/Revenue";
import Staff from "../pages/admin/staff/Staff";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
     <Route path="/change-password"  element={    <MainLayout>     <ChangePassword />   </MainLayout> }
/>

      <Route
        path="/admin/dashboard"
        element={ <MainLayout>  <Dashboard />   </MainLayout>}
      />
      <Route
        path="/admin/doctors"
        element={<MainLayout>  <Doctors/> </MainLayout> }
      />
     
     <Route
        path="/admin/tests"
        element={<MainLayout> <Tests/></MainLayout>
        }
      />

      <Route
        path="/admin/patients"
        element={ <MainLayout><Patients/></MainLayout> }
      />

      <Route
        path="/admin/staff"
        element={ <MainLayout><Staff/></MainLayout> }
      />

    <Route
        path="/admin/Medicines"
        element={  <MainLayout> <Medicines/>  </MainLayout>   }
      />
      <Route
        path="/admin/Visits"
        element={ <MainLayout> <AdminVisits/>  </MainLayout>}
      />
      <Route
        path="/admin/Revenue"
        element={ <MainLayout> <Revenue/>  </MainLayout>}
      />
     
  {  /* __________________________________________________________________________________*/ }
     <Route
        path="/reception/doctors"
        element={  <MainLayout> <DoctorsList/>  </MainLayout>    }
      />

      <Route
        path="/reception/patients"
        element={  <MainLayout> <RecepPatients/>  </MainLayout> }
      />
      
      <Route
        path="/reception/billing"
        element={  <MainLayout> <RecepBilling/>  </MainLayout>    }
      />
      <Route
        path="/reception/dashboard"
        element={ <MainLayout> <RecepDash /> </MainLayout>}
      />
      
      <Route
        path="/reception/visits/create"
        element={  <MainLayout> <CreateVisit/>  </MainLayout> }
      />
      
     
     {  /* __________________________________________________________________________________*/ }
     
     <Route
        path="/doctor/patients"
        element={ <MainLayout> <DoctorPatients /> </MainLayout>}
      />
      <Route
        path="/doctor/consultation/:visitId"
        element={ <MainLayout> <Consultation /> </MainLayout>}
      />
      <Route
        path="/doctor/dashboard"
        element={ <MainLayout> <DoctorDashboard/>  </MainLayout>}
      />

      <Route
        path="/doctor/all-patients"
        element={ <MainLayout> <DoctorAllPatients/>  </MainLayout>}
      />

    </Routes>
  );
}