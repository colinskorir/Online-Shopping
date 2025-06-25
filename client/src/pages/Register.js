const Register = () => (
  <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
    <h2 className="text-2xl font-semibold text-green-600 mb-4">Register</h2>
    <form className="space-y-4">
      <input className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" type="text" placeholder="Name" />
      <input className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" type="email" placeholder="Email" />
      <input className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" type="password" placeholder="Password" />
      <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors font-semibold">Register</button>
    </form>
  </div>
);

export default Register;
