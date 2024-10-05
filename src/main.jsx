import * as React from "react";
import * as ReactDom from "react-dom/client";
import App from "./App.jsx";
// import './index.css'
import Main from "./components/mainContent.jsx";
import FormPage from "./pages/form.jsx";
import Header from "./components/header.jsx";
// import { Root } from './App.jsx';
import Channel from "./channel.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Error } from "./pages/error.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "user/:userId",
        element: <Main />,
      },
      {
        path: "/channel/:id",
        element: <Channel/>,
      },
    ],
  },
  {
    path: "/register",
    element: <FormPage />,
  },
  // {
  //   path: "/physics",
  //   element: <Channel channelId={"physics"} />,
  // },
]);

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
