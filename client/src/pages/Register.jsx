import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: {
      street: "",
      barangay: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Philippines",
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value, nested = false) => {
    if (nested) {
      setForm(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (form.password.length < 6) {
    setError("Password must be at least 6 characters");
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, form);

    if (!res.data?.token || !res.data?.user) {
      setError("Invalid server response. Try again.");
      return;
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/", { replace: true }); // ✅ force replace history
  } catch (err) {
    console.error("❌ Register error:", err);
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-card w-full max-w-lg p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required value={form.name} onChange={e => updateField("name", e.target.value)} className="w-full p-3 border rounded-lg" />
          <input type="email" placeholder="Email" required value={form.email} onChange={e => updateField("email", e.target.value)} className="w-full p-3 border rounded-lg" />
          <input type="password" placeholder="Password (min 6)" required value={form.password} onChange={e => updateField("password", e.target.value)} className="w-full p-3 border rounded-lg" />
          <input type="text" placeholder="Phone (optional)" value={form.phone} onChange={e => updateField("phone", e.target.value)} className="w-full p-3 border rounded-lg" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Street" value={form.address.street} onChange={e => updateField("street", e.target.value, true)} className="p-3 border rounded-lg" />
            <input type="text" placeholder="Barangay" value={form.address.barangay} onChange={e => updateField("barangay", e.target.value, true)} className="p-3 border rounded-lg" />
            <input type="text" placeholder="City" value={form.address.city} onChange={e => updateField("city", e.target.value, true)} className="p-3 border rounded-lg" />
            <input type="text" placeholder="Province" value={form.address.province} onChange={e => updateField("province", e.target.value, true)} className="p-3 border rounded-lg" />
            <input type="text" placeholder="Postal Code" value={form.address.postalCode} onChange={e => updateField("postalCode", e.target.value, true)} className="p-3 border rounded-lg" />
            <input type="text" disabled value="Philippines" className="p-3 border rounded-lg bg-gray-100 text-gray-500" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 disabled:opacity-50">
            {loading ? "Creating Account..." : "Register"}
          </button>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
