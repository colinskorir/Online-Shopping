const Login = () => (
  <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Login</h2>
    <form className="space-y-4">
      <input className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" type="email" placeholder="Email" />
      <input className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" type="password" placeholder="Password" />
      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold">Login</button>
    </form>
  </div>
);

export default Login;
