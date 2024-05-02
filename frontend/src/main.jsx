import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css';
import { Root, User, Admin, VerifyAdmin, Error} from "./routes/exporter.js";

const router =  createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error/>,
    children: [
      {
        index: Boolean(1),
        element: <User />
      },
      {
        path: "verify",
        element: <VerifyAdmin />
      },
      {
        path: "admin-output",
        element: <Admin />
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
