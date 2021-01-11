import React from "react";
import LoginForm from "../components/Home/LoginForm";
import Layout from "../components/MainLayout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Typography } from "@material-ui/core";

export default function Home() {
  const authData = useSelector((state: RootState) => state.authData);
  return (
    <Layout>
      {authData.login ? (
        <Typography>Witaj, {authData.login}</Typography>
      ) : (
        <LoginForm />
      )}
    </Layout>
  );
}
