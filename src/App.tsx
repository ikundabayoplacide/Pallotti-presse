import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";

function App() {

  return (
    <>
      <ScrollToTop />
      <AppRoutes />

      <ToastContainer />
    </>
     
  );
}

export default App;
