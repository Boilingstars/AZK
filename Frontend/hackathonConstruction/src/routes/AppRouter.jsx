import { Routes, Route, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./ProtectRoute";
import { useSelector } from "react-redux";

export default function AppRouter() {

  const auth = useSelector(state => state)

  return (
    <div>
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route 
            key={`public-${index}`}
            path={route.path}
            element={<route.component />}
          />
        ))}
        {auth ? ( 
          privateRoutes.map((route, index) => (
            <Route
              key={`private-${index}`}
              path={route.path}
              element={<route.component />}
            />
          ))
        ) : (
          <Route 
            path="*" 
            element={<Navigate to="/auth" replace />}
          />
        )}
      </Routes>
    </div>
  )
}