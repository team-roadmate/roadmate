import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  return <Redirect href="/record/record" />;
}
