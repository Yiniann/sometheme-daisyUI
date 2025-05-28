import Stat from './Stat'
import TrafficChart from "./TrafficChart";

import { getTrafficLog } from "../../redux/slices/userSlice";
import {  useDispatch } from "react-redux";
import { useEffect } from "react";
const Status = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTrafficLog());
  }, [dispatch]);
  return (
    <div className="flex flex-col gap-4">
      <Stat />
      <TrafficChart />
    </div>
  );
}
export default Status;