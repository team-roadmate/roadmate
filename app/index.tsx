import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { userToken, loading } = useAuth();

  if (loading) return null; // 로딩 중 스플래시 화면 가능

  return <Redirect href={userToken ? "/home" : "/login"} />;
}
