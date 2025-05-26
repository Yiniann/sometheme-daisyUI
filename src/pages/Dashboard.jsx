import React, {useEffect} from "react" 
import { useDispatch, useSelector } from "react-redux"
import Subscriptioninfo from "../components/dashboard/SubscriptionInfo";
import { fetchSubscription } from "../redux/slices/userSlice";
import { fetchPlan } from "../redux/slices/planSlice";

const Dashboard = () => {
  const dispatch = useDispatch()
  const subscription = useSelector((state) => state.user.subscription);
  
  useEffect(() => {
    dispatch(fetchPlan());
    dispatch(fetchSubscription());
  }, [dispatch]);

  return (
    <div className="flex flex-col lg:flex-row">
      <Subscriptioninfo />
    </div>
  )
}

export default Dashboard
