import React, {useEffect} from "react" 
import { useDispatch} from "react-redux"
import Subscriptioninfo from "../components/dashboard/SubscriptionInfo";
import { fetchSubscription } from "../redux/slices/userSlice";
import { fetchPlan } from "../redux/slices/planSlice";
import NodeList from "../components/dashboard/NodeList";
import Status from "../components/dashboard/Status";

const Dashboard = () => {
  const dispatch = useDispatch()
 
  
  useEffect(() => {
    dispatch(fetchPlan());
    dispatch(fetchSubscription());
  }, [dispatch]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/2 flex flex-col">
        <Subscriptioninfo />
        <NodeList />
      </div>
      <div className="flex-1">
        <Status />
      </div>  
    </div>
  )
}

export default Dashboard
