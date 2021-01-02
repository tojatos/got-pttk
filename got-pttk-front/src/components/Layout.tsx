import React from "react";
import AppBar from "./AppBar";

interface LayoutProps {
  children?: JSX.Element;
}

function Layout(props: LayoutProps) {
  return (
  <div>
    <AppBar/>
    <main> 
      {props.children}
    </main>
  </div>);
}

export default Layout;
