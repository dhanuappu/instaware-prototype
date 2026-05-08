"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // 1. Check if we are safely in the browser environment
    if (typeof window === "undefined") return;

    // 2. Look for the user data we saved during login
    const userString = localStorage.getItem("user");

    // If no user object is found, send them back to the login page
    if (!userString) {
      console.log("No user found. Redirecting to login...");
      router.replace("/login");
      return;
    }

    try {
      // Parse the JSON string back into a JavaScript object
      const user = JSON.parse(userString);
      
      // 3. Check if the user has vendor, superadmin, or partner rights
      if (user.role === "vendor" || user.role === "superadmin" || user.role === "partner") {
        setUserName(user.name);
        setIsAuthorized(true); // Grant access!
      } else {
        console.log("User is just a customer. Kicking them out...");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Local storage error:", error);
      localStorage.removeItem("user"); // Clear corrupted data
      router.replace("/login");
    }
  }, [router]);

  // If they aren't authorized yet, show a loading message to prevent flickering
  if (!isAuthorized) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#F1F3F6" }}>
        <h2>Verifying Security Clearance... 🛡️</h2>
      </div>
    );
  }

  // ==========================================
  // ACTUAL ADMIN DASHBOARD UI
  // ==========================================
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", background: "#F1F3F6", minHeight: "100vh" }}>
      <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxWidth: "1200px", margin: "0 auto" }}>
        
        <h1 style={{ color: "#2874F0", margin: "0 0 10px 0" }}>Vendor Command Center 🏪</h1>
        <p style={{ fontSize: "18px", color: "#535665" }}>Welcome back, <strong>{userName}</strong>!</p>
        
        <hr style={{ border: "none", borderTop: "1px solid #E0E0E0", margin: "20px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {/* Dashboard Stat Cards */}
          <div style={{ background: "#E8F8EE", padding: "20px", borderRadius: "8px", border: "1px solid #26A541" }}>
            <h3 style={{ margin: 0, color: "#26A541" }}>Total Orders</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0 0 0" }}>0</p>
          </div>
          
          <div style={{ background: "#EBF2FF", padding: "20px", borderRadius: "8px", border: "1px solid #2874F0" }}>
            <h3 style={{ margin: 0, color: "#2874F0" }}>Active Products</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0 0 0" }}>0</p>
          </div>
        </div>

        <button 
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          style={{ marginTop: "30px", padding: "10px 20px", background: "#F43F3F", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
