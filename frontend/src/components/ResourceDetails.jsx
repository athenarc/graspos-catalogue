import { Outlet, useParams } from "react-router-dom";

export default function ResourceDetails() {
  const { resourceId } = useParams();

  return (
    <>
      <h1> Resource Details </h1>
      <h5> {resourceId}</h5>
      <Outlet />
      
    </>
  );
}
