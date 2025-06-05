import React, {useEffect} from "react" 
import { useDispatch} from "react-redux"
import Subscriptioninfo from "../components/dashboard/SubscriptionInfo";
import { fetchSubscription } from "../redux/slices/userSlice";
import { fetchPlan } from "../redux/slices/planSlice";
import NodeList from "../components/dashboard/NodeList";
import TrafficChart from "../components/dashboard/TrafficChart";

const Dashboard = () => {
  const dispatch = useDispatch()
 
  
  useEffect(() => {
    dispatch(fetchPlan());
    dispatch(fetchSubscription());
  }, [dispatch]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-2/3 flex flex-col">
        <Subscriptioninfo />
        <TrafficChart />
      </div>
      <div className="lg:w-1/3 flex flex-col">
        <NodeList />
      </div>  
    </div>
  )
}

export default Dashboard
