import "./App.css";
import Dashboard from "./pages/Dashboard/dashboard";
import Orphanage from "./pages/Orphanage/Orphanage";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import OrpRegister from "./pages/OrpanageRegistration/OrpRegister";
import Donation from "./pages/Donation/Donation";
import ToDonateList from "./pages/ToDonateList/ToDonateList";
import OrphanageNews from "./pages/OrphanageNews/OrphanageNews";
import Spinner from "./components/Spinner";
import UploadOrphanageProfilePhoto from "./components/UploadOrphanageProfilePhoto";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadOrphanagePhotos from "./components/UploadOrphanagePhotos";
import Forum from "./pages/Forum/Forum";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="orphanage/:orphanageid" element={<Orphanage />} />
        <Route path="register" element={<Register />} />
        <Route path="orpregister" element={<OrpRegister />} />
        <Route path="login" element={<Login />} />
        <Route path="donation" element={<Donation />} />
        <Route path="todonate/:userid" element={<ToDonateList />} />
        <Route path="news" element={<OrphanageNews />} />
        <Route path="spinner" element={<Spinner />} />
        <Route path="upload-orp-profile-photo/:orphanageid" element={<UploadOrphanageProfilePhoto />} />
        <Route path="upload-orp-photos/:orphanageid" element={<UploadOrphanagePhotos />} />
        <Route path="forum" element={<Forum />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
