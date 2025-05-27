import React, {useEffect} from "react" 
import { useDispatch} from "react-redux"
import Subscriptioninfo from "../components/dashboard/SubscriptionInfo";
import { fetchSubscription } from "../redux/slices/userSlice";
import { fetchPlan } from "../redux/slices/planSlice";
import NodeList from "../components/dashboard/NodeList";

const Dashboard = () => {
  const dispatch = useDispatch()
 
  
  useEffect(() => {
    dispatch(fetchPlan());
    dispatch(fetchSubscription());
  }, [dispatch]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div>
        <Subscriptioninfo />
        <NodeList />
      </div>
    </div>
  )
}

export default Dashboard
