import Header from "../components/Header";

export default function ConnectFacebook() {
  const handleConnect = () => {
    window.location.href = "http://localhost:5000/api/auth/facebook";
  };

  return (
    <div>
      <Header
        title="Connect Facebook"
        subtitle="Connect your Facebook account so the app can fetch your Pages."
      />

      <div className="card">
        <p>
          When you click the button below, you will be redirected to Facebook
          login and permissions approval.
        </p>
        <button onClick={handleConnect}>Connect Facebook</button>
      </div>
    </div>
  );
}