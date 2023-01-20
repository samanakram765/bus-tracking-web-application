import Sidebar from "./Sidebae";
import AdminPanel from "./AdminPanel";
import useAuth from "./../../context/auth/useAuth";
import Loader from "./../../components/Loader";

const Home = () => {
  const { authUser } = useAuth();

  console.log("Auth User : ", authUser);
  if (authUser === undefined) {
    return <Loader />;
  }

  return (
    <main className="admin-panel row">
      <Sidebar />
      <AdminPanel />
    </main>
  );
};

export default Home;
